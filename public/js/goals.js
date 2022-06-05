const questions = {
	'everyday': 'How many minutes every day?',
	'totaltime': 'What is your goal for the total number of minutes?',
	'numericalgoal': 'What is your goal for the final number?',
	//'booleangoal': 'What is your goal for what you want to achieve?',
	//'categorical': 'What do you want as the final state?'
}
//dropped support for boolean and categorical for now
async function newGoal() {
	const { value: name } = await Swal.fire({
		title: 'What is your goal name?',
		input: 'text',
		inputLabel: 'The goal name',
		inputValue: 'My Goal',
		showCancelButton: true,
		inputValidator: (value) => {
			if (!value) {
				return 'Please enter a name!';
			}
		}
	});
	const { value: type } = await Swal.fire({
		title: 'What is the goal type?',
		input: 'select',
		inputOptions: {
			everyday: 'Goal for time every day',
			totaltime: 'Goal for total minutes/time',
			numericalgoal: 'Goal for getting to a certain number',
			//booleangoal: 'Goal for achieving something',
			//categorical: 'Goal for reaching a certain state'
		},
		inputPlaceholder: 'Select a goal type',
		showCancelButton: true,
		inputValidator: (value) => {
			if (!value) {
				return 'Please choose a goal type!';
			}
		}
	});
	//console.log(type);
	const { value: description } = await Swal.fire({
		input: 'textarea',
		title: 'Goal Description',
		inputPlaceholder: 'Type your description here...',
		inputAttributes: {
			'aria-label': 'Type your description here'
		},
		showCancelButton: true
	});
	const { value: goal } = await Swal.fire({
		title: questions[type],
		input: 'text',
		inputLabel: 'The goal',
		inputValue: 'My Goal',
		showCancelButton: true,
		inputValidator: (value) => {
			if (!value) {
				return 'Please enter a name!';
			}
		}
	});
}