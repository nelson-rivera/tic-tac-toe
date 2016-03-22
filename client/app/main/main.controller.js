'use strict';

(function() {

class MainController {

  constructor($http) {
    this.$http = $http;
    this.dimension = 3;
    this.board = [];
  }

  $onInit() {
    // this.$http.get('/api/things').then(response => {
    //   this.awesomeThings = response.data;
    // });

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
}

angular.module('ticTacToeApp')
  .component('main', {
    templateUrl: 'app/main/main.html',
    controller: MainController
  });

})();
