module.exports = {
  preset: 'react-native',
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|react-native-vector-icons|react-native-gesture-handler|@react-navigation)/)'
  ],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
};
