const crypto = require("crypto");
const axios = require("axios");
const fs = require("fs");
const path = require("path");

const privateKey = fs.readFileSync(
  path.join(__dirname, "../private.pem"),
  "utf8"
);



//new file


console.log("========== SIGNED ACTOR GET ==========");
console.log("Actor URL:", actorUrl);
console.log("Host:", parsed.host);
console.log("Date:", date);
console.log("String To Sign:");
console.log(stringToSign);
console.log("Signature Header:", signatureHeader);
console.log("Key ID:", `${actor}#main-key`);
console.log("======================================");




const fetchSignedActor = async (actorUrl, actorUsername) => {
  const parsed = new URL(actorUrl);

  const date = new Date().toUTCString();

  // Signed GET request
  const stringToSign = [
    `(request-target): get ${parsed.pathname}`,
    `host: ${parsed.host}`,
    `date: ${date}`,
  ].join("\n");

  const signer = crypto.createSign("RSA-SHA256");
  signer.update(stringToSign);
  signer.end();

  const signature = signer.sign(privateKey, "base64");

  const actor = `${process.env.DOMAIN}/users/${actorUsername}`;

  const signatureHeader =
    `keyId="${actor}#main-key",` +
    `algorithm="rsa-sha256",` +
    `headers="(request-target) host date",` +
    `signature="${signature}"`;

  const response = await axios.get(actorUrl, {
    headers: {
      Accept: "application/activity+json",
      Host: parsed.host,
      Date: date,
      Signature: signatureHeader,
      "User-Agent": "FediverseApp/1.0",
    },
  });

  return response.data;
};

module.exports = fetchSignedActor;
