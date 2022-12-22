const random = require("./rng");

let objetoRng = random(process.argv[2]);

process.send(objetoRng);
process.exit();
