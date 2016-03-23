'use strict';

(function() {

class MainController {

  constructor($http) {
    this.$http = $http;
    this.dimension = 100;
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
    this.boardWidth = 0;
  }

  $onInit() {
    this.playerInTurn = 0;
    this.board = this.createBoard(this.dimension, null);
    const elmnt = document.getElementById("board-table");
    let xWidth = elmnt.scrollWidth;
    this.cellStyle = {
      'height': xWidth/this.dimension + 'px'
    };
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
    const play = {
      'x': x,
      'y': y
    }
    const dimension = this.board.length;
    if(this.board[x][y] === null){
      this.board[x][y] = this.players[this.playerInTurn].code;
      this.$http.post('/api/tictac/checkWinner',{'board': this.board, 'play': play}).then((data) => {
        console.log(data);
        if(data.data.isWinner) {
          console.log('winner');
          this.gameOverMessage = this.players[this.playerInTurn].name + 'won!';
          this.gameOver = true;
        }else {
          this.dirtyCells++;
          if(this.dirtyCells === dimension * dimension){
            this.gameOver = true;
            this.gameOverMessage = 'It\'s a tie';
          }
          this.nextTurn();
        }
        console.log(this.gameOverMessage);
      })

    }
  }

  nextTurn(){
    this.playerInTurn = (this.playerInTurn === 0) ? 1 : 0;
  }
}

angular.module('ticTacToeApp')
  .component('main', {
    templateUrl: 'app/main/main.html',
    controller: MainController
  });

})();
