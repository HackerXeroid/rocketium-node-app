const express = require("express");
const router = express.Router();
const userControllers = require("../controllers/userControllers");

router.get('/', async (req, res) => {
  await userControllers.getUsers(req, res);
})

module.exports = router;