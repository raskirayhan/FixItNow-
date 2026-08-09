import app from "./app";
import { execSync } from "child_process";

const PORT = process.env.PORT || 5000;

try {
  console.log("Pushing Prisma schema to database...");
  execSync("npx prisma db push --accept-data-loss", { stdio: "inherit" });
  console.log("Prisma schema pushed successfully.");
  try {
    execSync("npx tsx prisma/seed.ts", { stdio: "inherit" });
    console.log("Database seeded successfully.");
  } catch (seedErr) {
    console.log("Seeding skipped or completed with warnings.");
  }
} catch (dbErr) {
  console.error("Failed to push Prisma schema:", dbErr);
}

app.listen(PORT, () => {
  console.log(`FixItNow API server running on port ${PORT}`);
});
