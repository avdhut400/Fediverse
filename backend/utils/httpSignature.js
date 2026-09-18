

const crypto = require("crypto");
const url = require("url");
const fs = require("fs");
const path = require("path");

const privateKey = fs.readFileSync(path.join(__dirname, "../private.pem"), "utf8");

function signRequest({ inboxUrl, actor, body }) {
  const parsed = url.parse(inboxUrl);
  const date = new Date().toUTCString();

  const digest = crypto
    .createHash("sha256")
    .update(JSON.stringify(body))
    .digest("base64");

  const stringToSign = [
    `(request-target): post ${parsed.path}`,
    `host: ${parsed.host}`,
    `date: ${date}`,
    `digest: SHA-256=${digest}`,
  ].join("\n");

  const signature = crypto
    .createSign("RSA-SHA256")
    .update(stringToSign)
    .sign(privateKey, "base64");

  const header = [
    `keyId="${actor}#main-key"`,
    `algorithm="rsa-sha256"`,
    `headers="(request-target) host date digest"`,
    `signature="${signature}"`,
  ].join(", ");

  return {
    Date: date,
    Host: parsed.host,
    Digest: `SHA-256=${digest}`,
    Signature: header,
    "Content-Type": "application/activity+json",
    Accept: "application/activity+json"
  };
}




















function signGetRequest({ targetUrl, actor }) {
  const parsed = url.parse(targetUrl);
  const date = new Date().toUTCString();

  const stringToSign = [
    `(request-target): get ${parsed.path}`,
    `host: ${parsed.host}`,
    `date: ${date}`,
  ].join("\n");

  console.log("🔐 GET String to Sign:");
  console.log(stringToSign);

  const signature = crypto
    .createSign("RSA-SHA256")
    .update(stringToSign)
    .sign(privateKey, "base64");

  const header = [
    `keyId="${actor}#main-key"`,
    `algorithm="rsa-sha256"`,
    `headers="(request-target) host date"`,
    `signature="${signature}"`,
  ].join(", ");

  return {
    Date: date,
    Host: parsed.host,
    Signature: header,
    Accept: "application/activity+json",
  };
}


module.exports = {
  signRequest,
  signGetRequest,
};
