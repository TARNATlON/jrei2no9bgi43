module.exports = {
	clearMocks: true,
	collectCoverage: true,
	coverageDirectory: 'coverage',
	coverageProvider: 'v8',
	preset: 'ts-jest',
	roots: ['./Source/Tests'],
	transform: {
		'^.+\\.(ts|tsx)?$': 'ts-jest',
		'^.+\\.(js|jsx)$': 'babel-jest',
	},
	globals: {
		'ts-jest': {
			tsConfig: 'tsconfig.json',
		},
	},

	moduleDirectories: ['node_modules', 'Source'],
};
