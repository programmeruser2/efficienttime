window.api = {};
//api.test = 1;
api.goals = {};
api.goals.list = async () => {
	return await (fetch('/api/goals').then(res=>res.json()));
};
api.goals.new = async (options) => {
 //{goalName, type, goalDescription, dailyGoal, totalGoal, totalStatus, numericalGoal, numericalStatus, categoryStatus, categories, booleanStatus}
 await fetch('/api/goals', {
	 method: 'POST',
	 headers: {
		 'Content-Type': 'application/json'
	 },
	 body: JSON.stringify(options)
 });
};
api.goals.get = async (id) => {
	const promise = 
		fetch('/api/goals/' + id)
		.then(res => res.json());
	return (await promise);
};
api.goals.edit = async (id, options) => {
	await fetch('/api/goals/' + id, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(options)
	});
};
api.goals.delete = async (id) => {
	await fetch('/api/goals/' + id, {
		method: 'DELETE'
	});
};
api.goals.complete = async (id, newValue) => {
	await fetch('/api/goals/' + id + '/complete', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			value: newValue
		})
	});
};
api.goals.xp = async () => {
	return (await fetch('/api/xp').then(res=>res.json()).then(d=>d.xp));
}