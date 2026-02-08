

const crypto = require("crypto");
const url = require("url");
const User = require("../models/User");

async function signRequest({ inboxUrl, actor, body, username }) {
  // Validate username
  if (!username || username === "undefined") {
    throw new Error("Invalid username: username cannot be undefined or empty");
  }

  // Load user-specific private key from database
  const user = await User.findOne({ username }).select("+privateKey");
  if (!user || !user.privateKey) {
    throw new Error(`Private key not found for user: ${username}`);
  }

  const privateKey = user.privateKey;
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

module.exports = signRequest;
