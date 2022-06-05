const e = require('express');
const express = require('express');
const router = express.Router();
const Goal = require('../../models/Goal');
const { asyncWrap } = require('../../util');
async function goalAuthAsync(req, res, next) {
	req.goal = (await Goal.find({_id:req.params.id}))[0];
	//return console.log(goal);
	const goal = req.goal;
	const user = req.user;
	if (!goal) console.log('stop sending fake goals');
	if (!user.hasGoal(goal._id.valueOf())) console.log('stop trying to impersonate');
	console.log('finish')
	if (!goal || !user.hasGoal(goal._id.valueOf())) return res.status(404).json({errors:['no such goal']});
	next();
}
const goalAuth = asyncWrap(goalAuthAsync);
//app.use(goalAuth);
router.get('/', (req, res) => {
	//console.log(req.user.goals);
	const user = req.user;
	/*console.log(user)
	console.log(user.goals)
	console.log(user.goals.map(item=>item._id.valueOf()));*/
	console.log(user.getGoals());
	res.json(user.getGoals());
});
router.get('/:id', goalAuth, (req, res) => {
	console.log('hi were getting goal', req.params.id);
	const { user, goal } = req;
	res.json(goal.toJSON());
});
router.put('/:id', goalAuth, asyncWrap(async (req, res) => {
	//update goal data
	const { goal } = req;
	const stringValues = ['goalName','goalDescription', 'type', 'categoryStatus'];
	const numberValues = ['dailyGoal', 'totalGoal', 'totalStatus', 'numericalGoal', 'numericalStatus'];
	for (const val of stringValues) {
		if (req.body[val] === undefined) continue;
		goal[val] = req.body[val];
	}
	for (const val of numberValues) {
		if (req.body[val] === undefined) continue;
		goal[val] = Number(req.body[val]);
	}
	goal.categories = typeof req.body.categories === 'undefined' ? goal.categories : (req.body.categories instanceof Array ? req.body.categories : JSON.parse(req.body.categories));
	goal.booleanStatus = typeof req.body.booleanStatus !== 'undefined' ? (req.body.booleanStatus === true || req.body.booleanStatus === 'true') : goal.booleanStatus;
	await goal.save();
	res.json({status:'OK'});
}));
router.delete('/:id', goalAuth, asyncWrap(async (req, res) => {
	req.user.goals = req.user.goals.filter(item => item._id.valueOf() !== req.params.id);
	await req.user.save();
	await Goal.findByIdAndRemove(req.params.id); //delete not needed bc it returns, only remove
	res.send({status:'OK'});
}));
router.post('/', asyncWrap(async (req, res) => {
	const errors = [];
	console.log('we are starting');
	console.log(req.body);
	if (['everyday', 'totaltime', 'numericalgoal', 'booleangoal', 'categorical'].indexOf(req.body.type) === -1) errors.push('Invalid goal type');
	if (!req.body.goalName) errors.push('The goal name is required');

	//if (!req.body.dailyGoal) errors.push('Daily goal is required');

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
	data.booleanStatus = typeof req.body.booleanStatus !== 'undefined' ? (req.body.booleanStatus === true || req.body.booleanStatus === 'true') : undefined;
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
}));
router.post('/:id/complete', goalAuthAsync, (req, res) => {
	if (req.goal.type !== 'everyday') {
		const newValue = req.body.value;
		console.log(req.goal.numericalStatus)
		const xp = Math.abs(newValue - (req.goal.type === 'totaltime' ? req.goal.totalStatus : req.goal.numericalStatus));
		//console.log(xp);
		req.user.xp += xp;
		if (req.goal.type === 'totaltime') {
			req.goal.totalStatus = newValue;
		} else {
			req.goal.numericalStatus = newValue;
		}
		//(req.goal.type === 'totaltime' ? req.goal.totalStatus : req.goal.numericalStatus) = newValue;
	} else {
		//console.log(req.dailyStreak);
		//console.log(req.user.xp)
		req.goal.dailyStreak += 1;
		req.user.xp += req.goal.dailyStreak;
	}
	req.user.save();
	req.goal.save();
	res.json({status:'OK'});
});
module.exports = router;