
'use strict';

import _ from 'lodash';

// Check if play is a winner play
export function isWinner(req, res) {
  const board = req.body.board;
  const play = req.body.play;
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
  const isWinner = colSum >= dimension || rowSum >= dimension || diagLSum >= dimension || diagRSum  >= dimension;
  return res.send({'isWinner' : isWinner});
}
