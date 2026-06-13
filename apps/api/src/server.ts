import "dotenv/config";
import app from "./app.js";

const port = process.env.SERVER_PORT || 3001;

app.listen(port, () => {
  console.log(`API server running on http://localhost:${port}`);
});
