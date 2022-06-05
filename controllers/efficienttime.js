exports.goals = (req, res) => {
	res.render('goals', {
		title: 'Goals',
		xp: req.user.xp
	});
};