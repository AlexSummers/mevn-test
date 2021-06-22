const express = require('express');
const { check, validationResult } = require('express-validator');
const clientApiController = require('../controller/ClientApiController');
const providerApiController = require('../controller/ProviderApiController');

// eslint-disable-next-line consistent-return
const validate = (validations) => async (req, res, next) => {
  await Promise.all(validations.map((validation) => validation.run(req)));
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  res.status(400).json({ errors: errors.array() });
};

const app = express.Router();

app.get('/clients/list', clientApiController.list);
app.post(
  '/clients/create',
  validate([
    check('name').exists().isString().notEmpty(),
    check('email').exists().isEmail().notEmpty(),
    check('phone').exists().isString().notEmpty(),
    check('providerIds').isArray(),
  ]),
  clientApiController.create,
);
app.post(
  '/clients/delete',
  validate([
    check('id').isString().notEmpty(),
  ]),
  clientApiController.delete,
);
app.post(
  '/clients/edit',
  validate([
    check('id').isString().notEmpty(),
    check('name').isString().notEmpty(),
    check('email').isEmail().notEmpty(),
    check('phone').isString().notEmpty(),
    check('providerIds').isArray(),
  ]),
  clientApiController.edit,
);

app.post(
  '/providers/create',
  validate([
    check('name').isString().notEmpty(),
  ]),
  providerApiController.create,
);
app.post(
  '/providers/delete',
  validate([
    check('id').isString().notEmpty(),
  ]),
  providerApiController.delete,
);
app.post(
  '/providers/edit',
  validate([
    check('id').isString().notEmpty(),
    check('name').isString().notEmpty(),
  ]),
  providerApiController.edit,
);

module.exports = app;
