function asyncWrap(f) {
	return async function (req, res, next) {
		try {
			await f(req, res);
		} catch (err) {
			next(err);
		}
	}
}
module.exports = { asyncWrap };