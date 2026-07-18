const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    profilePic: {
      url: {
        type: String,
        default: "",
      },
      filename: {
        type: String,
        default: "",
      },
    },

    password: {
      type: String,
      required: true,
      select: false,
      minlength: [4, "Password must be at least 4 characters"],
      maxlength: [12, "Password cannot exceed 12 characters"],
    },

    email: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },

    actorUrl: String,
    inbox: String,
    outbox: String,
    publicKey: String,
    privateKey: String,

    followers: {
      type: [String],
      default: [],
    },

    following: {
      type: [String],
      default: [],
    },
    bio: {
      type: String,
      default: "",
      maxlength: 160,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  try {
    if (this.isModified("password")) {
      this.password = await bcrypt.hash(
        this.password,
        10
      );
    }

    if (!this.publicKey || !this.privateKey) {
      const {
        publicKey,
        privateKey,
      } = crypto.generateKeyPairSync("rsa", {
        modulusLength: 2048,

        publicKeyEncoding: {
          type: "spki",
          format: "pem",
        },

        privateKeyEncoding: {
          type: "pkcs8",
          format: "pem",
        },
      });

      this.publicKey = publicKey;
      this.privateKey = privateKey;
    }

    next();
  } catch (error) {
    next(error);
  }
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  console.log("🧪 Comparing:", candidatePassword, "↔️", this.password);
  return await bcrypt.compare(candidatePassword, this.password);
};
module.exports = mongoose.model(
  "User",
  userSchema
);