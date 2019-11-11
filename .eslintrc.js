module.exports = {
    parserOptions: {
        ecmaVersion: 2019,
        sourceType: "module",
        ecmaFeatures: {
            jsx: true
        }
    },

    extends: [
        "eslint:recommended",
        "plugin:react/recommended",

        "plugin:prettier/recommended",
        "prettier/react"
    ],
    env: { node: true }
};
