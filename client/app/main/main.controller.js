'use strict';

(function() {

class MainController {

  constructor($http) {
    this.$http = $http;
    this.dimension = 3;
    this.board = [];
    this.players = [
      {
        code: 'x',
        name: 'Player X'
      },
      {
        code: '0',
        name: 'Player 0'
      }
    ];
    this.playerInTurn;
    this.gameOver = false;
    this.movements = 0;
    this.dirtyCells = 0;
    this.gameOverMessage = '';
  }

  $onInit() {
    this.playerInTurn = 0;
    this.board = this.createBoard(this.dimension, null);
  }

  createBoard(dimension,value){
    let board = [];
    for(let i = 0; i < dimension; i++){
      board[i] = [];
      for(let j = 0; j< dimension; j++){
        board[i][j] = value;
      }
    }
    return board;
  }

  play = function(x,y) {

    if(this.gameOver) { return; }
    console.log(x);
    console.log(y);
    const play = {
      'x': x,
      'y': y
    }
    const dimension = this.board.length;
    console.log('dimension', dimension);
    if(this.board[x][y] === null){
      this.board[x][y] = this.players[this.playerInTurn].code;
      if(this.isWinner()) {

      }else {
        this.dirtyCells++;
        if(this.dirtyCells === dimension * dimension){
          this.gameOver = true;
          this.gameOverMessage = 'It\'s a tie';
        }
        this.nextTurn();
      }
    }
  }

  nextTurn(){
    if (this.playerInTurn === 0){
      this.playerInTurn = 1;
    }else {
      this.playerInTurn = 0;
    }
  }

  isWinner = function() {
    return false;
  }
}

angular.module('ticTacToeApp')
  .component('main', {
    templateUrl: 'app/main/main.html',
    controller: MainController
  });

})();
