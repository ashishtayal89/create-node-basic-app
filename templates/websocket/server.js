const express = require("express");
const http = require("http");

const app = express();
const httpServer = http.Server(app);

app.use(express.static("public"));

const listener = httpServer.listen(process.env.PORT || 80, () => {
  console.log(`Listening on port ${listener.address().port}`);
});
