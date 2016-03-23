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
      this.$http.post('/api/things/',{'board': this.board, 'play': play}).then((data) => {
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
    if (this.playerInTurn === 0){
      this.playerInTurn = 1;
    }else {
      this.playerInTurn = 0;
    }
  }

  isWinner = function(board, play) {
    const dimension = board.length;
    const code = board[play.x][play.y];
    let rowSum = 0, colSum = 0, diagLSum = 0, diagRSum = 0;
    let leftX= 0 , rightX = 0;

    for(let i=0; i < dimension; i++){
      if(board[play.x][i] === code) {
        rowSum++;
      }
      if(board[i][play.y] === code) {
        colSum++;
      }
      leftX = i + (play.x - play.y);
      if(leftX >= 0 && leftX < dimension){
        if(board[leftX][i] === code){
          diagLSum++;
        }
      }
      rightX = play.x + play.y - i;
      if(rightX >= 0 && rightX < dimension){
        if(board[rightX][i] === code){
          diagRSum++;
        }
      }
    }
    console.log('dimension', dimension);
    console.log('col', colSum);
    console.log('row', rowSum);
    console.log('diagR', diagRSum);
    console.log('diagL', diagLSum);
    //Return if one of the results is equal to the needed for win the game
    return colSum >= dimension || rowSum >= dimension || diagLSum >= dimension || diagRSum  >= dimension;
  }
}

angular.module('ticTacToeApp')
  .component('main', {
    templateUrl: 'app/main/main.html',
    controller: MainController
  });

})();
