const admin = require("../config/firebaseAdmin");

/**
 * Verifies a Firebase ID token and returns the decoded token.
 * @param {string} token - The Firebase ID token to verify.
 * @returns {Promise<Object>} The decoded token if valid.
 * @throws Will throw an error if verification fails.
 */
async function verifyToken(token) {
	return admin.auth().verifyIdToken(token);
}

module.exports = verifyToken;
