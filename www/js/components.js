import {Row, Shape} from "./classes";

angular.module('app')
    .component('appBoard', {
        template: `
                <div class="app-board">
                    <app-row app-row="row" ng-repeat="row in $ctrl.appRows track by $index" ng-class="::{'app-invisible-row':$index<=$ctrl.SYSTEM.invisibleTopRows}"/>
                </div>
            `,
        controller: function(Utils, Model, $timeout, Shared, $scope, SYSTEM, $rootScope){
            Model.board = this;
            let _this = this;
            _this.Utils = Utils;
            _this.SYSTEM = SYSTEM;
            _this.Model = Model;
            _this.Shared = Shared;
            _this.Utils = Utils;
            window.appBoard = _this;
            window.Shared = Shared;
            _this.highSpeed = false;
            
            _this.animate = () => {
                let ms = Shared.difficulty.speed - (Shared.difficulty.level * 100);
                $timeout(()=>{
                    if(Shared.game.started && !Shared.game.paused){//I could just call _this.animate() too instead of having this if
                    if(Shared.game.over){
                      Shared.keys.lock = true;
                      throw 'Gameover';
                    }
                    _this.moveDown();
                    }
                    _this.animate();
                }, ms>SYSTEM.maxDifficulty?ms:SYSTEM.maxDifficulty);
            }
            
            _this.animate();

            _this.addShape = function(shape){
                Model.shapes.push(shape);
            }

            _this.getFirstRow = function(){
                return _this.appRows[0];
            }

            _this.refresh = function(){
            }

            _this.getBlock = function(x,y){
                return _this.appRows[x].blocks[y];
            }
            _this.moveDown = function(){
                Shared.score.points+=Shared.difficulty.level;
                let noneShapesMovedDown = true;
                for(let i = 0; i < Model.shapes.length; i++){
                    let shape = Model.shapes[i];
                    if(!shape.touchedBottom && shape.moveDown()){
                        noneShapesMovedDown = false;
                    }
                    else{
                        shape.touchedBottom = true;
                    }
                }
                if(noneShapesMovedDown){
                    if(_this.highSpeed){
                      Shared.keys.lock = false
                      _this.highSpeed = false;
                    }
                    Shared.keys.lock = true;
                    var numOfClearedLines = _this.clearLines();
                    if(!numOfClearedLines){
                        let newShape = Utils.getRandomShape();
                        newShape.brandNew = true;
                        Model.shapes.push(newShape);
                        Shared.keys.lock = false;
                        return;
                    }
                    else{
                        Shared.score.numOfRowsCleared+=numOfClearedLines;
                        let scoreMultiplier = SYSTEM.scorePerLine[numOfClearedLines] || SYSTEM.scorePerLineOverflow;
                        Shared.score.points+=scoreMultiplier*(numOfClearedLines+1);
                        Shared.difficulty.level = Math.floor(Shared.score.numOfRowsCleared/Shared.difficulty.everyThisNumberOfLinesGoUpOneLevel)+1;
                    }
                }
            }

            _this.clearLines = ()=>{
                let clearedLines = 0;
                _this.appRows.forEach((row, i) => {
                    let allBlocksAreActive = true;
                    row.blocks.forEach(block=>{
                        if(!(block.shapeBlock)){
                            allBlocksAreActive = false;
                        }
                    });
                    if(allBlocksAreActive){
                        _this.appRows.splice(i,1);
                        _this.appRows.unshift(new Row({numberOfBlocks:row.blocks.length}));
                        clearedLines++;
                    }
                });
                return clearedLines;
            }
            
            _this.removeFromPlayBoard = (shape, undo)=>{
                for(let i = 0; i < shape.rows.length; i++){
                    let shapeRow = shape.rows[i];
                    for(let j = 0; j < shape.rows[i].blocks.length; j++){
                        let shapeBlock = shapeRow.blocks[j];
                        if(shapeBlock.active){
                            _this.appRows[i+shape.boardX].blocks[j+shape.boardY].shapeBlock = undefined;
                        }
                    }
                }
            }

            _this.addShapeToBoard = function(shape){
                for(let i = 0; i < shape.rows.length; i++){
                    var row = shape.rows[i];
                    for(let j = 0; j < row.blocks.length; j++){
                        var block = row.blocks[j];
                        if(block.active){
                             _this.appRows[i+shape.boardX].blocks[j+shape.boardY].shapeBlock = block;
                        }
                    }
                }
                shape.isInPlay = true;
            }
            
            
            _this.checkIfWillOverlap = (shape)=>{
                for(let i = 0; i < shape.rows.length; i++){
                    for(let j = 0; j < shape.rows[i].blocks.length; j++){
                        let block = _this.appRows[i+shape.boardX].blocks[j+shape.boardY].shapeBlock;
                        if(block){
                           return true;
                        }
                    }
                }
                return false;
            }            
            
            _this.checkIfWillOverflow = (shape)=>{
                try{
                for(let i = 0; i < shape.rows.length; i++){
                    for(let j = 0; j < shape.rows[i].blocks.length; j++){
                        let block = _this.appRows[i+shape.boardX].blocks[j+shape.boardY].shapeBlock;
                    }
                }
                }
                catch(e){
                    return true;
                }
                return false;
            }

            //creates a circular references which throws this error in angular: Maximum call stack size exceeded
            _this.linkBlocks = function(shapeBlock, boardBlock){
                boardBlock.shapeBlock = shapeBlock;
                shapeBlock.boardBlock = boardBlock;
            }

        },
        bindings: {
            appRows : '='
        }
    })
    .component('appRow', {
        template: `
            <div class="app-row">
                <app-block ng-repeat="block in $ctrl.appRow.blocks track by $index" app-row="row" app-block="block"/>
            </div>
        `
        ,controller: function(Utils, Model, SYSTEM){
            let _this = this;
            _this.Utils = Utils;
            _this.Model = Model;
            _this.SYSTEM = SYSTEM;

        }
        ,bindings: {
            appRow : '='
        }
    })
    .component('appBlock', {
        template: `
<div class="app-block" ng-style="{'background-color': $ctrl.appBlock.shapeBlock.color}"></div>
        `
        ,controller: function(Utils, Model){
            let _this = this;
            _this.Utils = Utils;
            _this.Model = Model;


        },
        bindings: {
            appBlock : '='
            ,appRow : '='
        }
    })    
  .component('appNextShapeBoard', {
        template: `
<div class="app-next-shape-board app-board">
  <div class="app-row">
    <div class="app-block" ng-style="{'background-color': $ctrl.shape.rows[0].blocks[0].active && $ctrl.shape.rows[0].blocks[0].color}"></div>
    <div class="app-block" ng-style="{'background-color': $ctrl.shape.rows[0].blocks[1].active && $ctrl.shape.rows[0].blocks[1].color}"></div>
    <div class="app-block" ng-style="{'background-color': $ctrl.shape.rows[0].blocks[2].active && $ctrl.shape.rows[0].blocks[2].color}"></div>
    <div class="app-block" ng-style="{'background-color': $ctrl.shape.rows[0].blocks[3].active && $ctrl.shape.rows[0].blocks[3].color}"></div>
  </div>
  <div class="app-row">
    <div class="app-block" ng-style="{'background-color': $ctrl.shape.rows[1].blocks[0].active && $ctrl.shape.rows[1].blocks[0].color}"></div>
    <div class="app-block" ng-style="{'background-color': $ctrl.shape.rows[1].blocks[1].active && $ctrl.shape.rows[1].blocks[1].color}"></div>
    <div class="app-block" ng-style="{'background-color': $ctrl.shape.rows[1].blocks[2].active && $ctrl.shape.rows[1].blocks[2].color}"></div>
    <div class="app-block" ng-style="{'background-color': $ctrl.shape.rows[1].blocks[3].active && $ctrl.shape.rows[1].blocks[3].color}"></div>
  </div>
  <div class="app-row">
    <div class="app-block" ng-style="{'background-color': $ctrl.shape.rows[2].blocks[0].active && $ctrl.shape.rows[2].blocks[0].color}"></div>
    <div class="app-block" ng-style="{'background-color': $ctrl.shape.rows[2].blocks[1].active && $ctrl.shape.rows[2].blocks[1].color}"></div>
    <div class="app-block" ng-style="{'background-color': $ctrl.shape.rows[2].blocks[2].active && $ctrl.shape.rows[2].blocks[2].color}"></div>
    <div class="app-block" ng-style="{'background-color': $ctrl.shape.rows[2].blocks[3].active && $ctrl.shape.rows[2].blocks[3].color}"></div>
  </div>
  <div class="app-row">
    <div class="app-block" ng-style="{'background-color': $ctrl.shape.rows[3].blocks[0].active && $ctrl.shape.rows[3].blocks[0].color}"></div>
    <div class="app-block" ng-style="{'background-color': $ctrl.shape.rows[3].blocks[1].active && $ctrl.shape.rows[3].blocks[1].color}"></div>
    <div class="app-block" ng-style="{'background-color': $ctrl.shape.rows[3].blocks[2].active && $ctrl.shape.rows[3].blocks[2].color}"></div>
    <div class="app-block" ng-style="{'background-color': $ctrl.shape.rows[3].blocks[3].active && $ctrl.shape.rows[3].blocks[3].color}"></div>
  </div>
</div>
        `
        ,bindings: {
            shape : '='
        }
    })
  .component('appControls', {
        template: `
          <div class="app-keyboard">
            <div class="app-keyboard-first-row">
              <div ng-class="{'app-active':$ctrl.promise[38].notCanceled}" my-touchstart="$ctrl.mouseDown(38)" my-touchend="$ctrl.mouseUp(38)" my-touchcancel="$ctrl.mouseUp(38)" ng-mousedown="$ctrl.mouseDown(38)" ng-mouseup="$ctrl.mouseUp(38)" ng-mouseout="$ctrl.mouseUp(38)" ng-click="$ctrl.simulateKeyEvent(38)" class="app-keyboard-key app-up"><div class="app-char" style="pointer-events: none;">&#8593;</div></div>
              <div ng-class="{'app-active':$ctrl.promise[13].notCanceled}" my-touchstart="$ctrl.mouseDown(13)" my-touchend="$ctrl.mouseUp(13)" my-touchcancel="$ctrl.mouseUp(13)" ng-mousedown="$ctrl.mouseDown(13)" ng-mouseup="$ctrl.mouseUp(13)" ng-mouseout="$ctrl.mouseUp(13)" ng-click="$ctrl.simulateKeyEvent(13)" class="app-keyboard-key app-pause"><div class="app-char" style="pointer-events: none;">PAUSE</div></div>
              <div ng-class="{'app-active':$ctrl.promise[38].notCanceled}" my-touchstart="$ctrl.mouseDown(38)" my-touchend="$ctrl.mouseUp(38)" my-touchcancel="$ctrl.mouseUp(38)" ng-mousedown="$ctrl.mouseDown(38)" ng-mouseup="$ctrl.mouseUp(38)" ng-mouseout="$ctrl.mouseUp(38)" ng-click="$ctrl.simulateKeyEvent(38)" class="app-keyboard-key app-up"><div class="app-char" style="pointer-events: none;">&#8593;</div></div>
            </div>
            <div class="app-keyboard-second-row">
              <div ng-class="{'app-active':$ctrl.promise[37].notCanceled}" my-touchstart="$ctrl.mouseDown(37)" my-touchend="$ctrl.mouseUp(37)" my-touchcancel="$ctrl.mouseUp(37)"  ng-mousedown="$ctrl.mouseDown(37)" ng-mouseup="$ctrl.mouseUp(37)" ng-mouseout="$ctrl.mouseUp(37)" ng-click="$ctrl.simulateKeyEvent(37)" class="app-keyboard-key app-left"><div class="app-char" style="pointer-events: none;">&#8592;</div></div>
              <div ng-class="{'app-active':$ctrl.promise[40].notCanceled}" my-touchstart="$ctrl.mouseDown(40)" my-touchend="$ctrl.mouseUp(40)" my-touchcancel="$ctrl.mouseUp(40)" ng-mousedown="$ctrl.mouseDown(40)" ng-mouseup="$ctrl.mouseUp(40)" ng-mouseout="$ctrl.mouseUp(40)" ng-click="$ctrl.simulateKeyEvent(40)" class="app-keyboard-key app-down"><div class="app-char" style="pointer-events: none;">&#8595;</div></div>
              <div ng-class="{'app-active':$ctrl.promise[39].notCanceled}" my-touchstart="$ctrl.mouseDown(39)" my-touchend="$ctrl.mouseUp(39)" my-touchcancel="$ctrl.mouseUp(39)" ng-mousedown="$ctrl.mouseDown(39)" ng-mouseup="$ctrl.mouseUp(39)" ng-mouseout="$ctrl.mouseUp(39)" ng-click="$ctrl.simulateKeyEvent(39)" class="app-keyboard-key app-right"><div class="app-char" style="pointer-events: none;">&#8594;</div></div>
            </div>
            <div class="app-keyboard-third-row">
              <div ng-class="{'app-active':$ctrl.appBoard.highSpeed}" my-touchstart="$ctrl.mouseUp(32)" my-touchend="$ctrl.mouseUp(32)" my-touchcancel="$ctrl.mouseUp(32)" ng-mousedown="$ctrl.mouseUp(32)" ng-mouseup="$ctrl.mouseUp(32)" ng-mouseout="$ctrl.mouseUp(32)" ng-click="$ctrl.simulateKeyEvent(32)" class="app-keyboard-key app-space"><div class="app-char" style="pointer-events: none;">SPACE</div></div>
            </div>
          </div>
        `
        ,bindings: {
            shape : '='
        }
        , controller: function($timeout, $interval, $scope){
          let _this = this;
          _this.appBoard = window.appBoard;
          _this.simulateKeyEvent = window.AppCtrl.kd;
          _this.promise = {};      
          let promise2 = {};
          let allPromises = [];
          
          _this.mouseDown = function(keyEvent) {
            _this.promise[keyEvent] = $timeout(
              function(){
                allPromises.push(promise2[keyEvent] = $interval(function () { 
                  _this.simulateKeyEvent(keyEvent);
                }, 40));
              },300)
            _this.promise[keyEvent].notCanceled = true;
          };

          _this.mouseUp = function (keyEvent) {
             $timeout.cancel(_this.promise[keyEvent]);
            if(_this.promise[keyEvent]){_this.promise[keyEvent].notCanceled = false};
             $interval.cancel(promise2[keyEvent]);
             allPromises.forEach(e=>$interval.cancel(e));
          };
        }
    })
