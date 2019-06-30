module.exports = {
  root: true,
  env: {
    node: true,
    browser: true,
    es6: true,
  },
  'extends': [
    'plugin:vue/essential',
    'plugin:vue/strongly-recommended',
    '@vue/standard',
    "eslint:recommended",
    "prettier/vue",
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
    parser: 'babel-eslint',
  },
  plugins: [
    'vue',
  ],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
  },
}
