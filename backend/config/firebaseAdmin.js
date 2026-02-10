const admin = require("firebase-admin");

const serviceAccount = require("./firebase.json");

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
    });

    // ✅ TEMP test (remove after confirmation)
    admin.auth().listUsers(1)
        .then(() => console.log("🔥 Firebase Admin connected"))
        .catch(console.error);
}

module.exports = admin;
