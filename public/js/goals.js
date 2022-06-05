const container = document.querySelector('#goals-container');

const types = {
	everyday: 'Daily Goal',
	totaltime: 'Total Time Goal',
	numericalgoal: 'Goal for Numerical Milestone'
}
async function updateGoals() {
	const child = container.lastElementChild;
	while (child) {
		container.removeChild(child);
		child = container.lastElementChild;
	}
	const goals = await api.goals.list();
	for (const id of goals) {
		const goal = await api.goals.get(id);
		//yes innerhtml bad too lazy no time how many times do i have to say this
		const el = document.createElement('div');
		el.dataset.id = id;
		el.innerHTML = 
`
<h2>${goal.goalName}</h2>
<p>${goal.goalDescription || ''}</p>
<p>Type: ${types[goal.type]}</p>
<p>Goal: ${goal.dailyGoal} ${goal.type === 'numericalgoal' ? '' : 'minutes'} ${goal.type === 'everyday' ? 'per day' : ''}</p>
<button onclick="complete('${id}', '${goal.type}')">Complete</button>
`;
		el.style.border = '1px solid lightgray';
		container.append(el);
	}
}


updateGoals();

async function complete(id, type) {
	const goal = await api.goals.get(id);
	if (type === 'everyday') {
		api.goals.complete(id);
	} else if (type === 'totaltime') {
		let { value: offset } = await Swal.fire({
			title: 'How many minutes did you complete?',
			input: 'text',
			//inputLabel: 'The goal',
			//inputValue: '1',
			showCancelButton: true,
			inputValidator: (value) => {
				if (!value) {
					return 'Please enter a value!';
				}
				const n = Number(value);
				if (!Number.isInteger(n)) {
					return 'Please enter an integer!';
				}
				if (type !== 'numericalgoal' && n <= 0) {
					return 'Please enter positive integer minutes!';
				}
			}
		});
		api.goals.complete(id, goal.totalStatus+offset);
	} else if (type === 'numericalgoal') {
		let { value: newval } = await Swal.fire({
			title: 'What is the new value?',
			input: 'text',
			//inputLabel: 'The goal',
			//inputValue: '1',
			showCancelButton: true,
			inputValidator: (value) => {
				if (!value) {
					return 'Please enter a value!';
				}
				const n = Number(value);
				if (!Number.isInteger(n)) {
					return 'Please enter an integer!';
				}
				if (type !== 'numericalgoal' && n <= 0) {
					//return 'Please enter positive integer minutes!';
				}
			}
		});
		api.goals.complete(id, newval);
	}
}

const questions = {
	'everyday': 'How many minutes every day?',
	'totaltime': 'What is your goal for the total number of minutes?',
	'numericalgoal': 'What is your goal for the final number?',
	//'booleangoal': 'What is your goal for what you want to achieve?',
	//'categorical': 'What do you want as the final state?'
};

//dropped support for boolean and categorical for now
async function newGoal() {
	//its not everyday that something works immediately without debugging
	let options = {};
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
	let { value: goal } = await Swal.fire({
		title: questions[type],
		input: 'text',
		inputLabel: 'The goal',
		//inputValue: '1',
		showCancelButton: true,
		inputValidator: (value) => {
			if (!value) {
				return 'Please enter a value!';
			}
			const n = Number(value);
			if (!Number.isInteger(n)) {
				return 'Please enter an integer!';
			}
			if (type !== 'numericalgoal' && n <= 0) {
				return 'Please enter positive integer minutes!';
			}
		}
	});
	goal = Number(goal);
	options = {
		goalName: name,
		type: type,
		goalDescription: description
	};
	let status;
	if (type === 'numericalgoal') {
		status = Number((await Swal.fire({
			title: 'What is your current status?',
			input: 'text',
			inputLabel: 'The status',
			inputValue: '0',
			showCancelButton: true,
			inputValidator: (value) => {
				if (!value) {
					return 'Please enter a value!';
				}
				const n = Number(value);
				if (!Number.isInteger(n)) {
					return 'Please enter an integer!';
				}
			}
		})).value);
		options.numericalStatus = status;
	}
	if (type === 'everyday') {
		options.dailyGoal = goal;
	} else if (type === 'totaltime') {
		options.totalGoal = goal;
	} else if (type === 'numericalgoal') {
		options.numericalGoal = goal;
	}
	await api.goals.new(options);
	await updateGoals();
}




