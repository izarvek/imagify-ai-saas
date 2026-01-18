const { Router } = require('express');
const { generateImage } =require('../controllers/image.controlles')
const {UserAuthentication} = require('../middleware/user.middleware')


const router = Router();

router.post('/generate-image', UserAuthentication, generateImage);

module.exports = router;