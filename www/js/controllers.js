import {Row, Shape} from "./classes";

angular.module('app')
    .controller('AppCtrl', function(Utils, Model, $rootScope, $scope, Shared, $window){
		window.Model = Model;
		window.Utils = Utils;
		window.$rootScope = $rootScope;
		window.AppCtrl = this;

		let _this = this;
		_this.Model = Model;
		_this.Utils = Utils;
		_this.Shared = Shared;
        _this.Model.nextShapeRows = [new Row({numberOfBlocks:4}),new Row({numberOfBlocks:4}),new Row({numberOfBlocks:4}),new Row({numberOfBlocks:4})];

        _this.restart = function(){
          $('#app-loading-modal').fadeIn('slow', ()=>{
              $window.location.reload();
          });
          return;
          Shared.difficulty.level = 1;
          Shared.difficulty.speed = 1000;
          Shared.score.numOfRowsCleared = 0;
          Shared.score.points = 0;
          Shared.game.over = false;
          Shared.keys.lock = false;
          Model.shapes = [];
          Model.startRows();
          Shared.game.started = true;
          window.appBoard.animate();//@TODO we need to cancel the previous timeout
        }
		_this.kd = (event)=>{
				let code = event.keyCode || event;
                if(Shared.keys.lock && code !== 13){//except space
                    return;
                }
                let key;
				let lastShapeInPlay = Model.shapes[Model.shapes.length-1];
                if(!lastShapeInPlay){
                  return;
                }
				switch(code){
						case 13:
								key = 'enter';
                                if(Shared.game.over){
                                  return;
                                }
                                Shared.keys.lock = !Shared.game.paused;
                                Shared.game.paused = !Shared.game.paused;
								break;
                        case 32:
                                Shared.keys.lock = true;
                                while(true){
                                  Shared.score.points++;
                                  if(!lastShapeInPlay.moveDown()){
                                    break;
                                  }
                                }
								key = 'space';
                                window.appBoard.highSpeed = true;
                                break;
                        case 37:
								key = 'left';
								lastShapeInPlay.moveLeft();
								break;
						case 38:
								key = 'up';
								lastShapeInPlay.turnRight();
								break;
						case 39:
								key = 'right';
								lastShapeInPlay.moveRight();
								break;
						case 40:
								key = 'down';
								lastShapeInPlay.moveDown();
                                Shared.score.points++;
								break;
                        default:
                                break;
				}
		}
	})
