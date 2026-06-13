import "dotenv/config";
import { auth } from "./lib/auth.js";

async function seed() {
  try {
    await auth.api.signUpEmail({
      body: {
        email: "admin@restaurant.com",
        password: "admin123",
        name: "Admin",
      },
    });
    console.log("Admin user created (admin@restaurant.com / admin123)");
  } catch (err: unknown) {
    if (err && typeof err === "object" && "status" in err && (err as { status: number }).status === 422) {
      console.log("Admin user already exists, skipping.");
    } else {
      console.error("Seed failed:", err);
    }
  } finally {
    process.exit(0);
  }
}

seed();
