const appConfig = {
  USE_MOCK_DATA: true, // Set to false to use real DB data
  PORT: 5000,           // Port the backend server runs on
  FRONTEND_ORIGIN: 'http://localhost:8080' // Used for CORS config
};

module.exports = appConfig;
