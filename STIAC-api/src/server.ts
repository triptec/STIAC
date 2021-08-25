const io = require("socket.io")();
const server = io.listen(3000);

export {server};