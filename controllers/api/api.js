const express = require('express');
const router = express.Router();
const passportConfig = require('../../config/passport');
router.use(passportConfig.isAuthenticated)
router.get('/', (req, res) => {
	res.send('OK');
});
router.use('/goals', require('./goals'));
module.exports = router;
