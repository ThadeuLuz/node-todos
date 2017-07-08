const express = require('express');
const Todo = require('../models/Todo');

const router = express.Router();

router.get('/todo', (req, res, next) => {
  const { id } = req.session.user || {};
  if (!id) return res.sendStatus(403);

  Todo.findOne({ owner: id }, (err, todo) => {
    if (err) return next(err);
    console.log('todo', todo);
    res.send({ items: todo ? todo.items : [{ text: 'Buy milk', done: false }] });
  });
});

router.post('/todo', (req, res, next) => {
  const { id } = req.session.user || {};
  if (!id) return res.sendStatus(403);
  const { items } = req.body;
  if (!items) return res.sendStatus(400);

  Todo.findOne({ owner: id }, (err, todos) => {
    if (err) return next(err);
    if (!todos) todos = new Todo({ owner: id });
    todos.items = items;

    todos.save((saveErr) => {
      if (saveErr) return next(saveErr);
      return res.sendStatus(200);
    });
  });
});

module.exports = router;
