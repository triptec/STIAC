const Avanza = require("avanza");
const avanza = new Avanza();

const credentials = {
    username: process.env.AVANZA_USERNAME,
    password: process.env.AVANZA_PASSWORD,
    totpSecret: process.env.AVANZA_TOTP_SECRET,
};
console.log(credentials);

async function authenticate() {
    return avanza
        .authenticate(credentials)
}
authenticate()
    .then(() => console.log("authenticated"))
    .catch((e) => console.log(e));

export {Avanza, avanza, authenticate};