const { Router } = require('express');
const userAuth = require('../controllers/user.controllers')
const {UserAuthentication} = require('../middleware/user.middleware')
const userCredits = require('../controllers/user.credits.controllers')

const router = Router();


router.post('/register' , userAuth.registerUser)
router.post('/login' , userAuth.loginUser)
router.get('/credit' , UserAuthentication , userCredits.creditsUser)

module.exports = router;