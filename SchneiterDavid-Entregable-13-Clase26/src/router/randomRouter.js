const express = require("express");
const { Router } = express;
const { fork } = require("child_process");

const randomApi = Router();

randomApi.get("/", (req, res) => {
  const params = req.query.cant || 100000;
  const child = fork("src/utils/child.js", [params]);
  child.on("message", (msg) => {
    if (msg == "ready") {
      console.log(msg);
      child.send({ PID: process.pid });
    } else res.send(msg);
  });
});

module.exports = randomApi;
