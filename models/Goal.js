const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema({
	goalName: {
		type: String,
		required: true
	},
	type: {
		type: String,
		enum: ['everyday', 'totaltime', 'numericalgoal', 'booleangoal', 'categorical'],
		required: true
	},
	goalDescription: String,
	dailyGoal: Number, //daily goal of how many minutes, for everyday type
	totalGoal: Number, //total goal for totaltime goal type
	numericalGoal: Number, //numericalgoal
	totalMinutes: Number, //totaltime status
	numericalStatus: Number,
	categoryStatus: String,
	categories: [{ //for categorical goal
		type: String
	}]
});


const Goal = mongoose.model('Goal', goalSchema);

module.exports = Goal;
