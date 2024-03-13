const { Router } = require("express");
const usersController = require("../controllers/UsersController.js");

const usersRoutes = Router();

usersRoutes.get("/", usersController)

module.exports = usersRoutes;
