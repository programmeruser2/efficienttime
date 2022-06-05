const express = require('express');
const router = express.Router();
const Goal = require('../../models/Goal');
router.get('/', (req, res) => {
	//console.log(req.user.goals);
	const user = req.user;
	console.log(user.goals.map(item=>item._id.valueOf()));
});
router.post('/', async (req, res) => {
	const errors = [];
	console.log('we are starting')
	if (!(req.body.type in ['everyday', 'totaltime', 'numericalgoal', 'booleangoal', 'categorical'])) errors.push('Invalid goal type');
	if (!req.body.goalName) errors.push('The goal name is required');

	if (!req.body.dailyGoal) errors.push('Daily goal is required');

	if (errors.length) return res.status(400).json({errors});
	console.log('we finish validation, start insert');
	const data = {};
	const stringValues = ['goalName','goalDescription', 'type', 'categoryStatus'];
	const numberValues = ['dailyGoal', 'totalGoal', 'totalStatus', 'numericalGoal', 'numericalStatus'];
	for (const val of stringValues) {
		data[val] = req.body[val];
	}
	for (const val of numberValues) {
		data[val] = Number(req.body[val]);
	}
	data.categories = typeof req.body.categories === undefined ? req.body.categories : (req.body.categories instanceof Array ? req.body.categories : JSON.parse(req.body.categories));
	data.booleanStatus = typeof req.body.booleanStatus !== 'undefined' ? (data.booleanStatus === true || data.booleanStatus === 'true') : req.body.categories;
	console.log(data);
	console.log('we start save');
	const goal = new Goal(data);
	await goal.save();
	console.log('status ok!!!')
	res.send({status:'OK'});
});
module.exports = router;