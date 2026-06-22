import express, { type Express } from "express";
import cors from "cors";
import { toNodeHandler, fromNodeHeaders } from "better-auth/node";
import { auth } from "./lib/auth.js";
import productsRouter from "./routes/products.js";
import ordersRouter from "./routes/orders.js";

const app: Express = express();

const corsOrigin = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(",")
  : "http://localhost:5173";

app.use(cors({
  origin: corsOrigin,
  credentials: true,
}));

app.all("/api/auth/*splat", toNodeHandler(auth));

app.use(express.json());

app.get("/api/me", async (req, res) => {
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers),
  });
  res.json(session);
});

app.use("/api/products", productsRouter);
app.use("/api/orders", ordersRouter);

export default app;
