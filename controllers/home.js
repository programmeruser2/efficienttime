/**
 * GET /
 * Home page.
 */
exports.index = (req, res) => {
	if (req.isAuthenticated()) {
		res.redirect('/dash')
	}
  res.render('home', {
    title: 'Home'
  });
};
exports.dash = (req, res) => {
	res.render('dash', {
		title: 'Dashboard'
	})
}
