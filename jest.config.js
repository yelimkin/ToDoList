module.exports = {
  setupFiles: ['<rootDir>/jest.env.js'],
  testEnvironment: 'jsdom', // Next.js에서는 주로 jsdom 환경을 사용
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy', // CSS 파일을 무시
    '^@lib/(.*)$': '<rootDir>/lib/$1',
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'], // 테스트 환경 설정 파일
  transform: { // Jest가 .js, .jsx, .ts, .tsx 파일을 babel-jest로 변환
    '^.+\\.[tj]sx?$': 'babel-jest',
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx'],
};
