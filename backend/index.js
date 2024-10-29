const express = require("express");
const { PORT } = require("./config/env.config");
const connectDB = require("./config/db.config");
const userRoute = require("./routes/user.route");
const eventRoute = require("./routes/event.route");
const app = express();
const cors = require("cors");
const port = PORT || 3000;

app.use(cors({ origin: "*" }));
app.use(express.json());

app.use("/api/v1", userRoute);
app.use("/api/v1", eventRoute);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`calendar app listening at http://localhost:${port}`);
  connectDB();
});
