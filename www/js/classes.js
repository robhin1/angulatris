export class Block {
    constructor(){
        this.active = false;

        this.shapeBlock = undefined;
        this.boardBlock = undefined;
    }
}

export class Row {
    constructor({numberOfBlocks=5} = {}){//constructor(numberOfBlocks=5){
        this.blocks = [];
        for (let i = 0; i < numberOfBlocks; i++) {
            this.blocks.push(new Block());
        }
    }

    getBlockAtMiddle(){
        let len = this.blocks.length;
        return Math.ceil(len/2);
    }
}

export class Utils {
    getNumber(num) {
        return new Array(num);
    }
}
export class Shape {
    constructor(rows, color, name){
        this.rows = rows;
        this.name = name;
        this.color = color;
        if(color){
            this.changeBlocksColor(color);
        } 
        this.boardX = 0;
        this.boardY = Math.floor((window.SYSTEM.numberOfCols/2) - (rows[0].blocks.length/2));
    }
    
    changeBlocksColor(color){
        this.rows.forEach(row=>{
           row.blocks.forEach(block=>{
               block.color = color;
           }) 
        });
    }

    getLastRow(){
        let rows = this.rows;
        return rows[rows.length-1];
    }

    moveDown(){
        let r = this.move('down');
        if(!r){
          if(this.brandNew){
            Shared.game.over = true;
          }
        }
        this.brandNew = false;
        return r;
    }

    moveLeft(){
        return this.move('left');
    }

    moveRight(){
        return this.move('right');
    }

    turnRight(_tries, justTurn){
        //@TODO permitir rotar a la izquierda, deberia ser facil nomas cambiar jj por xx y asi...
        if(!this.check('down')){//we don't allow rotating the piece if the piece can't go down anymore (if it's at the bottom)
            return;
        }
        let numOfNewBlocks = this.rows.length;
        let numOfNewRows = this.rows[0].blocks.length;

        let newRows = [];
        for(let i = 0; i < numOfNewRows; i++){
            newRows.push(new Row({numberOfBlocks:numOfNewBlocks}))
        }
        let newShape = new Shape(newRows, this.color);
        for(let i = 0; i < newShape.rows.length; i++){
            let ii = numOfNewRows - i - 1;
            let newRow = newShape.rows[i];
            for(let j = 0; j < newShape.rows[i].blocks.length; j++){
                let jj = numOfNewBlocks - j - 1;
                newRow.blocks[j].active = this.rows[jj].blocks[i].active;
            }
        }
        let index = Model.shapes.indexOf(this);
        newShape.boardX = this.boardX;
        newShape.boardY = this.boardY;
        if(justTurn){
          return newShape;
        }
        appBoard.removeFromPlayBoard(this);
        let willOverlap = false;
        let willOverflow = appBoard.checkIfWillOverflow(newShape);
        if(!willOverflow){
          willOverlap = appBoard.checkIfWillOverlap(newShape)
        }
        let numOfTries = 0;
        let maxNumberOfTries = numOfNewBlocks-1;
        while(willOverflow || willOverlap){
            numOfTries++;
            if(numOfTries > maxNumberOfTries){
              return;
            }
            newShape.boardY--;
            willOverflow = appBoard.checkIfWillOverflow(newShape);
            if(!willOverflow){
              willOverlap = appBoard.checkIfWillOverlap(newShape)
            }
        }
        Model.shapes[index] = newShape;
        newShape.move(false);
        return true;
    }

    changePosition(position, undo){
        switch(position){
            case 'up':
                undo?this.boardX++:this.boardX--;
                break;
            case 'down':
                undo?this.boardX--:this.boardX++;
                break;
            case 'left':
                undo?this.boardY++:this.boardY--;
                break;
            case 'right':
                undo?this.boardY--:this.boardY++;
                break;
            default:
                //refresh
                break;
        }
    }

    hasThisBlock(block){
        for(let x = 0; x < this.rows.length; x++){
            let row = this.rows[x];
            for(let y = 0; y < row.blocks.length; y++){
                if(block === row.blocks[y]){
                    return true;
                }
            }
        }
        return false;
    }

    check(position){
        this.changePosition(position);
        for(let x = 0; x < this.rows.length; x++){
            let row = this.rows[x];
            for(let y = 0; y < row.blocks.length; y++){
                let block = row.blocks[y];
                if(block.active){
                    var error = false;
                    try{
                        var nextBoardBlock = Model.rows[x+this.boardX].blocks[y+this.boardY];
                    }catch(e){error = true;}
                    if(error || !nextBoardBlock || (nextBoardBlock.shapeBlock && !this.hasThisBlock(nextBoardBlock.shapeBlock))){
                        this.changePosition(position, true);
                        return false;
                    }
                }
            }
        }
        this.changePosition(position, true);
        return true;
    }

    move(position){
        if(!this.check(position)){
            return false;
        }
        this.changePosition(position);
        var previousNextBoardBlocks = [];//prevents overriding previous nextBoardBlocks
        for(let x = 0; x < this.rows.length; x++){
            let row = this.rows[x];
            //shape check
            for(let y = 0; y < row.blocks.length; y++){
                let block = row.blocks[y];
                if(block.active){
                    this.changePosition(position, true);
                    var previousBoardBlock = Model.rows[x+this.boardX].blocks[y+this.boardY];
                    this.changePosition(position);
                    var nextBoardBlock = Model.rows[x+this.boardX].blocks[y+this.boardY];
                    //assign references to boardBlockHere
                    nextBoardBlock.shapeBlock = block;
                    nextBoardBlock.shape = this;
                    nextBoardBlock.shapeRow = row;
                    //\assign references to boardBlockHere
                    previousNextBoardBlocks.push(nextBoardBlock);
                    if(!previousNextBoardBlocks.includes(previousBoardBlock)){
                        previousBoardBlock.shapeBlock = undefined;
                    }
                }
            }
        }
        return true;
    }


    getFirstRow(){
        let rows = this.rows;
        return rows[0];
    }

    getTopLeftBlock() {//the block has to be active
        var r = this.getFirstRow();
        for(e of r){
            if(e.active){
                return e;
                break;
            }
        }
    }
}