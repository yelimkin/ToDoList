module.exports = { // 최신 JavaScript 기능과 React JSX 구문을 변환
    presets: [
      [
        '@babel/preset-env',
        {
          targets: {
            node: 'current',
          },
        },
      ],
      ['@babel/preset-react', { runtime: 'automatic' }],
    ],
  };
  