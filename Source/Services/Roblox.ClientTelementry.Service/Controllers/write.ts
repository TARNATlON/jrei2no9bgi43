export default {
	method: 'all',
	func: async (_req, res) => {
		console.log(_req.body);
		return res.send();
	},
};
