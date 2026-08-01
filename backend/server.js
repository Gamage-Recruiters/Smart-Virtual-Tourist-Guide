import dotenv from "dotenv";
import app from "./src/app.js";

const PORT = process.env.PORT || 5000;

dotenv.config();

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
