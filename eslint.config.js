import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  // Ignorar artefactos generados, backups y código de terceros:
  // el lint solo debe revisar la fuente mantenida (src/)
  globalIgnores([
    'dist',
    '.vercel',
    'wpresidence_original',
    'wpresidence_child_original',
    'landings_originales',
    'security-quarantine',
    'scratch',
    'public',
    '**/*.bak*',
    '**/*backup*',
    '**/*.min.js',
  ]),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
  },
  // Scripts de utilidad/deploy en la raíz corren en Node, no en navegador
  // (va después del bloque general para que sus globals tengan prioridad)
  {
    files: ['*.js', 'scripts/**/*.js'],
    languageOptions: { globals: globals.node },
  },
])
