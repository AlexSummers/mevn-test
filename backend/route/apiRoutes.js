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

/**
 * @swagger
 * /api/clients/list:
 *   get:
 *     summary: Retrieve a list of clients.
 *     description: Retrieve a list of clients at providers in JSON format.
 *     tags:
 *       - clients
 *     responses:
 *       200:
 *         description: A list of clients and providers.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 clients:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         description: The client ID.
 *                         example: 60d21721475c6b0018f07831
 *                       name:
 *                         type: string
 *                         description: The clients's name.
 *                         example: Donald Trump
 *                       email:
 *                         type: string
 *                         description: The clients's email.
 *                         example: trump@dc.com
 *                       phone:
 *                         type: string
 *                         description: The clients's phone.
 *                         example: 5553535
 *                       providerIds:
 *                         type: array
 *                         description: Id's list of connected providers.
 *                         items:
 *                           type: string
 *                           description: The provider's id.
 *                           example: 60d21602475c6b0018f0782d
 *                 providers:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         description: The provider's ID.
 *                         example: 60d21602475c6b0018f0782d
 *                       name:
 *                         type: string
 *                         description: The provider's name.
 *                         example: Provider 1
 */
app.get('/clients/list', clientApiController.list);
/**
 * @swagger
 * /api/clients/create:
 *   post:
 *     summary: Creating a new client.
 *     tags:
 *       - clients
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 required: true
 *                 description: The clients's name.
 *                 example: Barak Obama
 *               email:
 *                 type: string
 *                 required: true
 *                 description: The clients's email.
 *                 example: obama@dc.com
 *               phone:
 *                 type: string
 *                 required: true
 *                 description: The clients's phone.
 *                 example: 5557676
 *               providerIds:
 *                 type: array
 *                 description: Id's list of connected providers.
 *                 items:
 *                   type: string
 *                   description: The provider's id.
 *                   example: 60d21602475c6b0018f0782d
 *     responses:
 *       200:
 *         description: Created client.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: The client ID.
 *                   example: 60d21721475c6b0018f07831
 *                 name:
 *                   type: string
 *                   description: The clients's name.
 *                   example: Donald Trump
 *                 email:
 *                   type: string
 *                   description: The clients's email.
 *                   example: trump@dc.com
 *                 phone:
 *                   type: string
 *                   description: The clients's phone.
 *                   example: 5553535
 *                 providerIds:
 *                   type: array
 *                   description: Id's list of connected providers.
 *                   items:
 *                     type: string
 *                     description: The provider's id.
 *                     example: 60d21602475c6b0018f0782d
 */
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
/**
 * @swagger
 * /api/clients/delete:
 *   post:
 *     summary: Removing a client.
 *     tags:
 *       - clients
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 required: true
 *                 description: The clients's ID.
 *                 example: 60d21721475c6b0018f07831
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */
app.post(
  '/clients/delete',
  validate([
    check('id').isString().notEmpty(),
  ]),
  clientApiController.delete,
);
/**
 * @swagger
 * /api/clients/edit:
 *   post:
 *     summary: Editing a existed client.
 *     tags:
 *       - clients
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 required: true
 *                 description: The clients's ID.
 *                 example: 60d21721475c6b0018f07831
 *               name:
 *                 type: string
 *                 required: true
 *                 description: The clients's name.
 *                 example: Barak Obama
 *               email:
 *                 type: string
 *                 required: true
 *                 description: The clients's email.
 *                 example: obama@dc.com
 *               phone:
 *                 type: string
 *                 required: true
 *                 description: The clients's phone.
 *                 example: 5557676
 *               providerIds:
 *                 type: array
 *                 description: Id's list of connected providers.
 *                 items:
 *                   type: string
 *                   description: The provider's id.
 *                   example: 60d21602475c6b0018f0782d
 *     responses:
 *       200:
 *         description: Updated client.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   required: true
 *                   description: The clients's ID.
 *                   example: 60d21721475c6b0018f07831
 *                 name:
 *                   type: string
 *                   required: true
 *                   description: The clients's name.
 *                   example: Barak Obama
 *                 email:
 *                   type: string
 *                   required: true
 *                   description: The clients's email.
 *                   example: obama@dc.com
 *                 phone:
 *                   type: string
 *                   required: true
 *                   description: The clients's phone.
 *                   example: 5557676
 *                 providerIds:
 *                   type: array
 *                   description: Id's list of connected providers.
 *                   items:
 *                     type: string
 *                     description: The provider's id.
 *                     example: 60d21602475c6b0018f0782d
 */
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
/**
 * @swagger
 * /api/providers/create:
 *   post:
 *     summary: Creating a new provider.
 *     tags:
 *       - providers
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 required: true
 *                 description: The provider's name.
 *                 example: Provider 1
 *     responses:
 *       200:
 *         description: Created provider.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: The provider's ID.
 *                   example: 60d21602475c6b0018f0782d
 *                 name:
 *                   type: string
 *                   description: The provider's name.
 *                   example: Provider 1
 */
app.post(
  '/providers/create',
  validate([
    check('name').isString().notEmpty(),
  ]),
  providerApiController.create,
);
/**
 * @swagger
 * /api/providers/delete:
 *   post:
 *     summary: Removing a provider.
 *     tags:
 *       - providers
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 required: true
 *                 description: The provider's ID.
 *                 example: 60d21602475c6b0018f0782d
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */
app.post(
  '/providers/delete',
  validate([
    check('id').isString().notEmpty(),
  ]),
  providerApiController.delete,
);
/**
 * @swagger
 * /api/providers/edit:
 *   post:
 *     summary: Editing a existed provider.
 *     tags:
 *       - providers
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 required: true
 *                 description: The provider's ID.
 *                 example: 60d21602475c6b0018f0782d
 *               name:
 *                 type: string
 *                 required: true
 *                 description: The provider's name.
 *                 example: Provider 1
 *     responses:
 *       200:
 *         description: Updated provider.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: The provider's ID.
 *                   example: 60d21602475c6b0018f0782d
 *                 name:
 *                   type: string
 *                   description: The provider's name.
 *                   example: Provider 1
 */
app.post(
  '/providers/edit',
  validate([
    check('id').isString().notEmpty(),
    check('name').isString().notEmpty(),
  ]),
  providerApiController.edit,
);

module.exports = app;
