import 'dotenv/config';
import app from './app.js';

const port = process.env.PORT || 3000;

// Start server for local development
const server = app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
  console.log(`📊 API endpoints:`);
  console.log(`   GET /api/profiles - Filter and paginate profiles`);
  console.log(`   GET /api/profiles/search - Natural language search`);
});

// For Vercel serverless
export default app;