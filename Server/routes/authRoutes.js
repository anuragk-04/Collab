const { SignUp, SignIn, resetPasswordForUser} = require("../controllers/authController")

const router = require("express").Router();


router.post('/signup', SignUp);


router.post('/login', SignIn)


router.post('/reset-password/:userId', resetPasswordForUser)

module.exports = router;