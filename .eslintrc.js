module.exports = {
    root: true,
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint'],
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'prettier'
    ],
    env: {
        node: true,
        es2022: true,
    },
    ignorePatterns: ['node_modules', 'dist', 'build', '.expo'],
    rules: {
        '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
        '@typescript-eslint/no-explicit-any': 'warn',
        '@typescript-eslint/ban-ts-comment': ['error', {
            'ts-expect-error': 'allow-with-description',
            'ts-ignore': false,
        }],
        '@typescript-eslint/no-namespace': 'off',
        'no-console': 'off',
    }
};
