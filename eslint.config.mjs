import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt({
  ignores: ['.output/**', 'coverage/**', 'test-results/**'],
  rules: { '@typescript-eslint/no-explicit-any': 'error' },
})
