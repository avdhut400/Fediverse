

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false },
  // displayName: String,
  email: { type: String, unique: true },
  actorUrl: String,
  inbox: String,
  outbox: String,
  publicKey: String,
  privateKey: { type: String, select: false }, // Private key should not be returned by default
  followers: { type: [String], default: [] },
  following: { type: [String], default: [] },
});

userSchema.pre("save", async function (next) {
  // Validate username is not undefined or empty
  if (!this.username || this.username === "undefined" || this.username.trim() === "") {
    const error = new Error("Username cannot be undefined or empty");
    return next(error);
  }

  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }

  if (!this.publicKey || !this.privateKey) {
    const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
      modulusLength: 2048,
      publicKeyEncoding: { type: "spki", format: "pem" },
      privateKeyEncoding: { type: "pkcs8", format: "pem" },
    });
    this.publicKey = publicKey;
    this.privateKey = privateKey;
  }

  next();
});

// userSchema.methods.comparePassword = async function (candidatePassword) {
//   return await bcrypt.compare(candidatePassword, this.password);
// };

userSchema.methods.comparePassword = async function (candidatePassword) {
  console.log("🧪 Comparing:", candidatePassword, "↔️", this.password);
  return await bcrypt.compare(candidatePassword, this.password);
};


module.exports = mongoose.model("User", userSchema);
