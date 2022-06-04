const express = require('express');
const router = express.Router();
router.get('/', (req, res) => {
	console.log(req.user.goals);
});
module.exports = router;