module.exports = {
  testEnvironment: 'jsdom', // Next.js에서는 주로 jsdom 환경을 사용
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy', // CSS 파일을 무시
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'], // 테스트 환경 설정 파일
};
