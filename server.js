const express = require("express");
const app = express();

const db = require("../CRUD/db");

const bodyParser = require("body-parser");
app.use(bodyParser.json());

// const passport = require("./auth")

//Middleware function
// const logRequest = (req, res, next) => {
//   console.log(
//     `${new Date().toLocaleString()} Request mode to : ${req.originalUrl}`
//   );
//   next();
// };

// app.use(passport.initialize());
// const authenticatorMiddleware = passport.authenticate("local", {session: false })

app.use(express.static("Upload"));

const CRUDRouter = require("./Router/NodeRouter");
app.use("/CRUD", CRUDRouter);

// app.use("/CRUD", authenticatorMiddleware, CRUDRouter);
// app.use("/CRUD", logRequest, CRUDRouter);

const mailRouter = require("./Router/mailRouter");
app.use("/api", mailRouter);

app.listen(4000, () => {
  console.log("Server listening on port 4000");
});
