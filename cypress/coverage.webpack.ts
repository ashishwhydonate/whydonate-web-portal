export default {
	module: {
		rules: [
			{
				test: /\.(js|ts)$/,
				loader: '@jsdevtools/coverage-istanbul-loader',
				options: { esModules: true },
				enforce: 'post',
				include: require('path').join(__dirname, '..', 'src'),
				exclude: [
					/\.(e2e|spec)\.js$/,
					/node_modules/,
					/(ngfactory|ngstyle)\.js/,
				],
			},
		],
	},
};
