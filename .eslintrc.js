module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module'
  },
  plugins: ['@typescript-eslint/eslint-plugin'],
  extends: [
    'plugin:@typescript-eslint/recommended'
  ],
  root: true,
  env: {
    node: true,
    jest: true
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    "indent": ["error", "tab"],
		"no-tabs": "off",
		"class-methods-use-this": 0,
		"no-plusplus": 0,
		"max-len": ["error", { "code": 160, "ignoreStrings": true, "ignoreComments": true, "ignoreTemplateLiterals": true }],
		"no-param-reassign": 0,
		"no-await-in-loop": "off",
		"max-classes-per-file": "off",
		"no-underscore-dangle": "off",
		"no-continue": "off",
		"comma-dangle": ["error", "never"],
		"no-multi-assign": "off",
		"brace-style": ["error", "stroustrup", { "allowSingleLine": true }],
		"no-extend-native": "off",
		"no-restricted-syntax": "off",
		"import/extensions": "off",
		"import/no-unresolved": "off",
		"no-unused-vars": "off",
		"no-nested-ternary": "off",
		"no-promise-executor-return": "off",
		"import/prefer-default-export": "off",
		"jsx-quotes": ["error", "prefer-single"],
		"global-require": "off",
		"import/no-dynamic-require": "off",
		"@typescript-eslint/no-non-null-assertion": "off",
		"no-prototype-builtins": "off",
		"linebreak-style": ["error", "unix"],
		"no-console": "warn",
		"@typescript-eslint/no-explicit-any": "off",
		"quotes": [2, "single", { "avoidEscape": true }]
  }
};
