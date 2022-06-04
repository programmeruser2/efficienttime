/**
 * GET /
 * Home page.
 */
exports.index = (req, res) => {
	console.log('we are at home page /')
	if (req.isAuthenticated()) {
		 return res.redirect('/dash')
	}
  res.render('home', {
    title: 'Home'
  });
};
exports.dash = (req, res) => {
	res.render('dash', {
		title: 'Dashboard'
	});
}
