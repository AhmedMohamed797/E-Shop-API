import "dotenv/config";
import app from "./src/app.js";

//* Running server on PORT...
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`Running server on PORT ${PORT}...`);
});

export { server };
