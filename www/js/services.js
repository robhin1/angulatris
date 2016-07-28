import {Row, Shape} from "./classes";

angular.module('app')
	.service('Utils', function(SYSTEM){
		var Utils = {};
		Utils.getRandomInt = (min, max)=>{
            let num = Math.floor(Math.random() * (max - min + 1)) + min;
			return num;
		}

		Utils.getTrueOrFalse = ()=>{
			return !this.getRandomInt(0,1);
		}
		Utils.getRandomShape = ()=>{
			let possibleShapes = Object.keys(SYSTEM.possibleShapes);
			var shapeName = possibleShapes[Utils.getRandomInt(0,possibleShapes.length-1)];
			let createShapeFunction = SYSTEM.possibleShapes[shapeName];
            let randomShape = Utils.nextRandomShape || createShapeFunction();
			Utils.nextRandomShape = createShapeFunction();
            return randomShape;
		}
        Utils.nextRandomShape = Utils.getRandomShape();
		return Utils;
	})
	.service('Model', function(SYSTEM){
		var Model = {}
		var numberOfRows = SYSTEM.numberOfRows;
		var numberOfCols = SYSTEM.numberOfCols;
		Model.shapes = [];
        Model.startRows = () => {
          Model.rows = [];
          for(let i = 0; i < numberOfRows; i++){
              Model.rows.push(new Row({numberOfBlocks: numberOfCols}));
          }
        }

		Model.addShape = function(type){
			Model.shapes.push(SYSTEM.possibleShapes[type]());
		}
        Model.startRows();

		return Model;
	})
	.service('Shared', function(SYSTEM){
		return {
            keys: {
                lock: false
            },
            difficulty: {
                speed: 1000
                ,level: 1
                ,everyThisNumberOfLinesGoUpOneLevel: 2//this should probably be a constant
            },
            score: {
                numOfRowsCleared: 0
                ,points: 0
            }
            ,game: {
              over: false
              ,started: false
              ,paused: false
            }
        };
	})
