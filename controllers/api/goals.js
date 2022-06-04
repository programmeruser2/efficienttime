const express = require('express');
const router = express.Router();
const Goal = require('../../models/Goal');
router.get('/', (req, res) => {
	//console.log(req.user.goals);
	const user = req.user;
	console.log(user.goals.map(item=>item._id));
});
router.post('/', async (req, res) => {
	const errors = [];
	if (!(req.body.type in ['everyday', 'totaltime', 'numericalgoal', 'booleangoal', 'categorical'])) errors.push('Invalid goal type');
	if (!req.body.goalName) errors.push('The goal name is required');

	if (!req.body.dailyGoal) errors.push('Daily goal is required');

	if (errors.length) res.status(400).json({errors});
	const data = {};
	const stringValues = ['goalName','goalDescription', 'type', 'categoryStatus'];
	const numberValues = ['dailyGoal', 'totalGoal', 'totalStatus', 'numericalGoal', 'numericalStatus'];
	for (const val of stringValues) {
		data[val] = req.body[val];
	}
	for (const val of numberValues) {
		data[val] = Number(req.body[val]);
	}
	data.categories = typeof req.body.categories === undefined ? undefined : JSON.parse(req.body.categories);
	data.booleanStatus = typeof req.body.booleanStatus !== 'undefined' ? data.booleanStatus === 'true' : undefined;
	const goal = new Goal();
	await goal.save();
	res.send({status:'OK'})
});
module.exports = router;