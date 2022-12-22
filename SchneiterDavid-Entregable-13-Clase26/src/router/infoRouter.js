const express = require("express");
const { Router } = express;

const infoApi = Router();

infoApi.get("/", (req, res) => {
  const datos = {
    directorio: process.cwd(),
    pid: process.pid,
    nodeVersion: process.version,
    title: process.title,
    sistemaOperativo: process.platform,
    memoria: process.memoryUsage().rss,
    args: process.argv.slice(2),
  };

  res.render("info", { info: datos });
});

module.exports = infoApi;
