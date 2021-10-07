const address = require('address');
const colors = require('colors');
const PROXY_PORT = process.env.PORT || 3000;
console.log("");
console.log("*****************");
console.log("");
console.log("All clients have loaded.".green);
console.log("");
console.log("Ushahidi client is ready to be viewed at", `http://${address.ip()}:${PROXY_PORT}`.blue);
console.log("");
console.log("*****************");
console.log("");
