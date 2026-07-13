import app from "./app";

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`FixItNow API server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});
