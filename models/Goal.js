const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema({
	goalName: {
		type: String,
		required: true
	},
	goalDescription: String,


	type: {
		type: String,
		enum: ['everyday', 'totaltime', 'numericalgoal', 'booleangoal', 'categorical'],
		required: true
	},


	// everyday => dailyGoal
	dailyGoal: Number, //daily goal of how many minutes, for everyday type

	//totaltime => totalGoal, totalStatus
	totalGoal: Number, //total goal for totaltime goal type
	totalStatus: Number, //totaltime status
	
	//numericalgoal => numericalGoal, numericalStatus
	numericalGoal: Number, //numericalgoal
	numericalStatus: Number,

	//categorical => categoryStatus, categories
	categoryStatus: String,
	categories: [{ //for categorical goal
		type: String,
		default: undefined
	}],

	//booleangoal => booleanStatus
	booleanStatus: {
		type: Boolean,
		default: false
	}
});


const Goal = mongoose.model('Goal', goalSchema);

module.exports = Goal;
