'use strict';

(function() {

class MainController {

  constructor($http, $mdDialog) {
    this.$http = $http;
    this.$mdDialog = $mdDialog;
    this.dimension = 3;
    this.board = [];
    this.players = [
      {
        code: 'x',
        name: 'Player 1'
      },
      {
        code: '0',
        name: 'Player 2'
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

  restartGame() {
    this.playerInTurn = 0;
    this.board = this.createBoard(this.dimension, null);
    this.gameOver = false;
    this.movements = 0;
    this.dirtyCells = 0;
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
          this.gameOverMessage = this.players[this.playerInTurn].name + ' won!';
          this.gameOver = true;
          this.showGameOverDialog();
        }else {
          this.dirtyCells++;
          if(this.dirtyCells === dimension * dimension){
            this.gameOver = true;
            this.gameOverMessage = 'It\'s a tie';
            this.showGameOverDialog();
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

  showSettings = function(ev) {
    let confirm = this.$mdDialog.prompt()
          .title('Settings')
          .textContent('Enter the dimension of the board')
          .placeholder('3')
          .ariaLabel('Enter the dimension of the board')
          .targetEvent(ev)
          .ok('Okay')
          .cancel('Cancel');
    this.$mdDialog.show(confirm).then((result) => {
      let resultInt = parseInt(result);
      console.log(Number.isFinite(parseInt(result)));
      if (Number.isFinite(resultInt)) {
        if (resultInt > 100) {
          resultInt = 100;
        }
        else if (resultInt < 2) {
          resultInt = 3;
          console.log('entra');
        }
        this.dimension = resultInt;
        this.board = this.createBoard(this.dimension, null);
      }
      else {
        this.dimension = 3;
      }

    }, function() {
      this.dimension = 3;
    });
  };

  showGameOverDialog = function(ev) {
    const confirm = this.$mdDialog.confirm()
          .title('Game Over')
          .textContent(this.gameOverMessage)
          .ariaLabel('Game Over')
          .targetEvent(ev)
          .ok('Rematch!')
    this.$mdDialog.show(confirm).then( ()=> {
      this.restartGame()
    });
  };
}

angular.module('ticTacToeApp')
  .component('main', {
    templateUrl: 'app/main/main.html',
    controller: MainController
  });

})();
