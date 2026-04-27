const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const jsonServer = require("json-server");
const path = require("path");
const createUsersRouter = require("./routes/users");
const setupSwagger = require("./swagger");

const app = express();
const PORT = process.env.PORT || 3000;
const dbFilePath = path.join(__dirname, "db.json");
const jsonServerRouter = jsonServer.router(dbFilePath);
const db = jsonServerRouter.db;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
setupSwagger(app, PORT);

app.get("/", (req, res) => {
  res.send("Express server is running with Users API. Swagger docs: /api-docs");
});

app.use("/api/users", createUsersRouter(db));

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
