const { getUsersOfSystem, getUserInfoById } = require("../controllers/userController");

const router = require("express").Router();


router.get('/getUsersOfSystem/:userId', getUsersOfSystem);


router.get('/:userId', getUserInfoById);


module.exports = router;