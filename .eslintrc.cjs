/** @type {import('eslint').Linter.Config} */
module.exports = {
  root: true,

  // 파서 설정
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },

  // 환경 설정
  env: {
    browser: true,
    commonjs: true,
    es6: true,
    node: true,
  },

  // 무시할 패턴
  ignorePatterns: [
    '!**/.server',
    '!**/.client',
    'node_modules/',
    'dist/',
    'build/',
    'coverage/',
    '*.config.js',
    '*.config.ts',
    'public/mockServiceWorker.js',
  ],

  // 기본 설정 - 모든 파일에 적용
  extends: ['eslint:recommended', 'plugin:import/recommended', 'plugin:import/typescript'],

  // 플러그인
  plugins: ['import', 'unused-imports'],

  // 기본 규칙
  rules: {
    // == 대신 === 사용 강제
    eqeqeq: ['error', 'always'],

    // 사용하지 않는 변수 제거
    'no-unused-vars': 'off', // TypeScript가 처리
    'unused-imports/no-unused-imports': 'error',
    'unused-imports/no-unused-vars': [
      'warn',
      {
        vars: 'all',
        varsIgnorePattern: '^_',
        args: 'after-used',
        argsIgnorePattern: '^_',
      },
    ],

    // Import 정렬 및 그룹화
    'import/order': [
      'error',
      {
        groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index', 'object', 'type'],
        'newlines-between': 'always',
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
      },
    ],

    // Import 중복 방지
    'import/no-duplicates': 'error',

    // 존재하지 않는 모듈 import 방지
    'import/no-unresolved': 'error',

    // console.log 경고 (개발 중에는 허용)
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'warn',

    // 디버거 금지
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
  },

  // import resolver 설정
  settings: {
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
        project: ['./tsconfig.json', './apps/*/tsconfig.json', './libs/tsconfig.json'],
      },
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    },
    'import/internal-regex': '^~/',
  },

  overrides: [
    // React/JSX 파일
    {
      files: ['**/*.{js,jsx,ts,tsx}'],
      plugins: ['react', 'react-hooks', 'jsx-a11y'],
      extends: [
        'plugin:react/recommended',
        'plugin:react/jsx-runtime',
        'plugin:react-hooks/recommended',
        'plugin:jsx-a11y/recommended',
      ],
      settings: {
        react: {
          version: 'detect',
        },
        formComponents: ['Form'],
        linkComponents: [
          { name: 'Link', linkAttribute: 'to' },
          { name: 'NavLink', linkAttribute: 'to' },
        ],
      },
      rules: {
        // React Hook 의존성 배열 검사
        'react-hooks/exhaustive-deps': 'error',

        // React Hook 규칙 강제
        'react-hooks/rules-of-hooks': 'error',

        // JSX에서 key prop 필수
        'react/jsx-key': [
          'error',
          {
            checkFragmentShorthand: true,
            checkKeyMustBeforeSpread: true,
            warnOnDuplicates: true,
          },
        ],

        // JSX 내 boolean 속성 단순화
        'react/jsx-boolean-value': ['error', 'never'],

        // JSX 내 불필요한 Fragment 제거
        'react/jsx-fragments': ['error', 'syntax'],

        // Self-closing 태그 강제
        'react/self-closing-comp': 'error',

        // 접근성 - img 태그에 alt 필수
        'jsx-a11y/alt-text': 'error',

        // 접근성 - 클릭 가능한 요소에 키보드 이벤트 필수
        'jsx-a11y/click-events-have-key-events': 'warn',

        // 접근성 - 상호작용 요소에 role 필수
        'jsx-a11y/no-static-element-interactions': 'warn',
      },
    },

    // TypeScript 파일
    {
      files: ['**/*.{ts,tsx}'],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        project: ['./tsconfig.json', './apps/*/tsconfig.json', './libs/tsconfig.json'],
      },
      plugins: ['@typescript-eslint'],
      extends: [
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
      ],
      rules: {
        // TypeScript 전용 규칙
        '@typescript-eslint/no-unused-vars': 'off', // unused-imports가 처리
        '@typescript-eslint/no-explicit-any': 'warn',
        '@typescript-eslint/no-non-null-assertion': 'warn',
        '@typescript-eslint/prefer-const': 'error',
        '@typescript-eslint/no-var-requires': 'error',

        // 함수 반환 타입 명시 (복잡한 함수만)
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',

        // Promise 처리 강제
        '@typescript-eslint/no-floating-promises': 'error',
        '@typescript-eslint/no-misused-promises': 'error',

        // 타입 import/export 최적화
        '@typescript-eslint/consistent-type-imports': [
          'error',
          {
            prefer: 'type-imports',
            disallowTypeAnnotations: false,
          },
        ],
        '@typescript-eslint/consistent-type-exports': 'error',

        // 네이밍 컨벤션
        '@typescript-eslint/naming-convention': [
          'error',
          {
            selector: 'interface',
            format: ['PascalCase'],
            prefix: ['I'],
          },
          {
            selector: 'typeAlias',
            format: ['PascalCase'],
          },
          {
            selector: 'enum',
            format: ['PascalCase'],
          },
          {
            selector: 'enumMember',
            format: ['UPPER_CASE'],
          },
        ],
      },
    },

    // Node.js 설정 파일들
    {
      files: [
        '.eslintrc.cjs',
        'vite.config.ts',
        'tailwind.config.ts',
        'postcss.config.js',
        'jest.config.js',
        '**/*.config.{js,ts}',
      ],
      env: {
        node: true,
        browser: false,
      },
      rules: {
        '@typescript-eslint/no-var-requires': 'off',
        'import/no-default-export': 'off',
      },
    },

    // Remix 라우트 파일
    {
      files: ['app/routes/**/*.{ts,tsx}'],
      rules: {
        // 라우트에서는 default export 필수
        'import/no-default-export': 'off',
        'import/prefer-default-export': 'error',
      },
    },

    // 테스트 파일
    {
      files: [
        '**/*.test.{js,ts,tsx}',
        '**/*.spec.{js,ts,tsx}',
        '**/__tests__/**/*.{js,ts,tsx}',
        '**/test/**/*.{js,ts,tsx}',
      ],
      env: {
        jest: true,
        'jest/globals': true,
      },
      plugins: ['jest', 'testing-library'],
      extends: ['plugin:jest/recommended', 'plugin:testing-library/react'],
      rules: {
        // 테스트에서는 any 허용
        '@typescript-eslint/no-explicit-any': 'off',

        // 테스트에서는 non-null assertion 허용
        '@typescript-eslint/no-non-null-assertion': 'off',

        // 테스트 파일에서는 console 허용
        'no-console': 'off',

        // Jest 규칙
        'jest/expect-expect': 'error',
        'jest/no-disabled-tests': 'warn',
        'jest/no-focused-tests': 'error',
        'jest/prefer-to-have-length': 'warn',
        'jest/valid-expect': 'error',

        // Testing Library 규칙
        'testing-library/await-async-queries': 'error',
        'testing-library/prefer-screen-queries': 'error',
      },
    },

    // MSW 관련 파일
    {
      files: ['app/mocks/**/*.{js,ts}'],
      rules: {
        '@typescript-eslint/no-explicit-any': 'off',
        'import/no-default-export': 'off',
      },
    },
  ],
};
