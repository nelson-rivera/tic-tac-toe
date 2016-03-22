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
    this.movements = 0;
  }

  $onInit() {
    // this.$http.get('/api/things').then(response => {
    //   this.awesomeThings = response.data;
    // });
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
    console.log(x);
    console.log(y);

    const play = {
      'x': x,
      'y': y
    }
    if(this.board[x][y] === null){
      this.board[x][y] = this.players[this.playerInTurn].code;
    }
  }

}

angular.module('ticTacToeApp')
  .component('main', {
    templateUrl: 'app/main/main.html',
    controller: MainController
  });

})();
