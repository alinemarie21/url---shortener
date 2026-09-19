const port = process.env.PORT || 3000;

export default {
  port,
  baseUrl: process.env.BASE_URL || `http://localhost:${port}`,
  // Origem(ns) do frontend autorizadas a chamar a API; separe várias por vírgula.
  corsOrigins: (process.env.CORS_ORIGIN || 'http://localhost:5173')
    .split(',')
    .map((origin) => origin.trim()),
};
