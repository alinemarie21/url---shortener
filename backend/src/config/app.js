const port = process.env.PORT || 3000;

export default {
  port,
  baseUrl: process.env.BASE_URL || `http://localhost:${port}`,
};
