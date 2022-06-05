function asyncWrap(f) {
	return async function (req, res, next) {
		try {
			await f(req, res, next);
		} catch (err) {
			next(err);
		}
	}
}
module.exports = { asyncWrap };