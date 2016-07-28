import {Row, Shape} from "./classes";

angular.module('app')
    .constant('SYSTEM', function () {
        var SYSTEM = {
            numberOfRows: 20
            ,numberOfCols: 10
            ,maxDifficulty: 100
            ,invisibleTopRows: 2
            ,scorePerLine: [40,100,300]
            ,scorePerLineOverflow: 1200
            ,possibleShapes: {
                'line': ()=>{
                    var r1 = new Row({numberOfBlocks: 1});
                    var r2 = new Row({numberOfBlocks: 1});
                    var r3 = new Row({numberOfBlocks: 1});
                    var r4 = new Row({numberOfBlocks: 1});
                    r1.blocks[0].active = true;
                    r2.blocks[0].active = true;
                    r3.blocks[0].active = true;
                    r4.blocks[0].active = true;
                    return new Shape([r1,r2,r3,r4], 'red', 'line');
                }
                ,'square': ()=>{
                    var r1 = new Row({numberOfBlocks: 2});
                    var r2 = new Row({numberOfBlocks: 2});
                    r1.blocks[0].active = true;
                    r1.blocks[1].active = true;
                    r2.blocks[0].active = true;
                    r2.blocks[1].active = true;
                    return new Shape([r1,r2], 'blue', 'square');
                }
                ,'lshape': ()=> {
                    var r1 = new Row({numberOfBlocks: 2});
                    var r2 = new Row({numberOfBlocks: 2});
                    var r3 = new Row({numberOfBlocks: 2});
                    r1.blocks[0].active = true;
                    r2.blocks[0].active = true;
                    r3.blocks[0].active = true;
                    r3.blocks[1].active = true;
                    return new Shape([r1, r2, r3], 'green', 'lshape');
                }
                ,'jshape': ()=> {
                    var r1 = new Row({numberOfBlocks: 2});
                    var r2 = new Row({numberOfBlocks: 2});
                    var r3 = new Row({numberOfBlocks: 2});
                    r1.blocks[1].active = true;
                    r2.blocks[1].active = true;
                    r3.blocks[0].active = true;
                    r3.blocks[1].active = true;
                    return new Shape([r1,r2,r3], 'yellow', 'jshape');
                }
                ,'tree': ()=> {
                    var r1 = new Row({numberOfBlocks: 3});
                    var r2 = new Row({numberOfBlocks: 3});
                    r1.blocks[1].active = true;
                    r2.blocks[0].active = true;
                    r2.blocks[1].active = true;
                    r2.blocks[2].active = true;
                    return new Shape([r1,r2], 'purple', 'tree');
                }
                ,'zshape': ()=> {
                    var r1 = new Row({numberOfBlocks: 2});
                    var r2 = new Row({numberOfBlocks: 2});
                    var r3 = new Row({numberOfBlocks: 2});
                    r1.blocks[1].active = true;
                    r2.blocks[0].active = true;
                    r2.blocks[1].active = true;
                    r3.blocks[0].active = true;
                    return new Shape([r1,r2,r3], 'orange', 'zshape');
                }
                ,'sshape': ()=> {
                    var r1 = new Row({numberOfBlocks: 2});
                    var r2 = new Row({numberOfBlocks: 2});
                    var r3 = new Row({numberOfBlocks: 2});
                    r1.blocks[0].active = true;
                    r2.blocks[0].active = true;
                    r2.blocks[1].active = true;
                    r3.blocks[1].active = true;
                    return new Shape([r1,r2,r3], 'aqua', 'sshape');
                }
            }
        };
        SYSTEM.numberOfRows+=SYSTEM.invisibleTopRows;
        window.SYSTEM = SYSTEM;
        return SYSTEM;
    }())
