const express = require("express");
const { Router } = express;
const { fork } = require("child_process");
const random = require("../utils/rng");

const randomApi = Router();

randomApi.get("/", (req, res) => {
  const params = req.query.cant || 10000;
  // const child = fork("src/utils/child.js", [params]);
  // child.on("message", (msg) => {
  //   if (msg == "ready") {
  //     console.log(msg);
  //     child.send({ PID: process.pid });
  //   } else res.send(msg);
  // });
  res.send(random(params));
});

module.exports = randomApi;
