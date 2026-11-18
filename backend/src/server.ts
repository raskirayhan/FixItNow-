import app from "./app";
import { exec } from "child_process";

const PORT = process.env.PORT || 5000;

// Start listening immediately so health checks and requests respond instantly
app.listen(PORT, () => {
  console.log(`FixItNow API server running on port ${PORT}`);
  
  // Non-blocking background database sync
  exec("npx prisma db push --accept-data-loss", (err) => {
    if (err) {
      console.warn("Background Prisma schema sync notice:", err.message);
    } else {
      console.log("Database schema synchronized successfully in background.");
    }
  });
});
