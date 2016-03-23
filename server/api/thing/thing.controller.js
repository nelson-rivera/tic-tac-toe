/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/things              ->  index
 * POST    /api/things              ->  create
 * GET     /api/things/:id          ->  show
 * PUT     /api/things/:id          ->  update
 * DELETE  /api/things/:id          ->  destroy
 */

'use strict';

import _ from 'lodash';
import {Thing} from '../../sqldb';

function respondWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function(entity) {
    console.log(res);
    if (entity) {
      res.status(statusCode).json(entity);
    }
  };
}

function saveUpdates(updates) {
  return function(entity) {
    return entity.updateAttributes(updates)
      .then(updated => {
        return updated;
      });
  };
}

function removeEntity(res) {
  return function(entity) {
    if (entity) {
      return entity.destroy()
        .then(() => {
          res.status(204).end();
        });
    }
  };
}

function handleEntityNotFound(res) {
  return function(entity) {
    if (!entity) {
      res.status(404).end();
      return null;
    }
    return entity;
  };
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    res.status(statusCode).send(err);
  };
}

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
  //Return if one of the results is equal to the needed for win the game
  const isWinner = colSum >= dimension || rowSum >= dimension || diagLSum >= dimension || diagRSum  >= dimension;
  return res.send({'isWinner' : isWinner});
}

// Gets a list of Things
export function index(req, res) {
  return Thing.findAll()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single Thing from the DB
export function show(req, res) {
  return Thing.find({
    where: {
      _id: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new Thing in the DB
export function create(req, res) {
  return Thing.create(req.body)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Updates an existing Thing in the DB
export function update(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  return Thing.find({
    where: {
      _id: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a Thing from the DB
export function destroy(req, res) {
  return Thing.find({
    where: {
      _id: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}
