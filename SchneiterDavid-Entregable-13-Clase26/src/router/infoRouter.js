const express = require("express");
const { Router } = express;
const cpus = require("os").cpus();

const compression = require("compression");
const infoApi = Router();

infoApi.get("/", compression(), (req, res) => {
  // console.log(process.argv.slice(2));
  const datos = {
    directorio: process.cwd(),
    pid: process.pid,
    nodeVersion: process.version,
    title: process.title,
    sistemaOperativo: process.platform,
    memoria: process.memoryUsage().rss,
    args: process.argv.slice(2),
    procesadores: cpus.length,
  };

  res.render("info", { info: datos });
});

module.exports = infoApi;
