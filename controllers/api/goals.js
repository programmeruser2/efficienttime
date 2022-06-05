const express = require('express');
const router = express.Router();
const Goal = require('../../models/Goal');
router.get('/', (req, res) => {
	//console.log(req.user.goals);
	const user = req.user;
	/*console.log(user)
	console.log(user.goals)
	console.log(user.goals.map(item=>item._id.valueOf()));*/
	console.log(user.getGoals());
	res.json(user.getGoals());
});
router.get('/:id:', async (req, res) => {
	const user = req.user,
	goal = await Goal.find(req.params.id)[0];
	if (!goal || !user.hasGoal(goal)) res.status(404).json({errors:['no such goal']});
	res.json(goal.toJSON());
});
router.post('/', async (req, res) => {
	const errors = [];
	console.log('we are starting');
	console.log(req.body);
	if (['everyday', 'totaltime', 'numericalgoal', 'booleangoal', 'categorical'].indexOf(req.body.type) === -1) errors.push('Invalid goal type');
	if (!req.body.goalName) errors.push('The goal name is required');

	if (!req.body.dailyGoal) errors.push('Daily goal is required');

	if (errors.length) return res.status(400).json({errors});
	console.log('we finish validation, start insert');
	const data = {};
	const stringValues = ['goalName','goalDescription', 'type', 'categoryStatus'];
	const numberValues = ['dailyGoal', 'totalGoal', 'totalStatus', 'numericalGoal', 'numericalStatus'];
	for (const val of stringValues) {
		if (req.body[val] === undefined) continue;
		data[val] = req.body[val];
	}
	for (const val of numberValues) {
		if (req.body[val] === undefined) continue;
		data[val] = Number(req.body[val]);
	}
	data.categories = typeof req.body.categories === 'undefined' ? undefined : (req.body.categories instanceof Array ? req.body.categories : JSON.parse(req.body.categories));
	data.booleanStatus = typeof req.body.booleanStatus !== 'undefined' ? (data.booleanStatus === true || data.booleanStatus === 'true') : undefined;
	console.log(data);
	console.log('we start save');
	const goal = new Goal(data);
	await goal.save();
	console.log(req.user)
	req.user.goals.push(goal);
	await req.user.save();
	console.log('status ok!!!');
	console.log(req.user);
	res.send({status:'OK'});
});

module.exports = router;