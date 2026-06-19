import admin from "firebase-admin";
import fs from "fs";

const credentialsPath = process.env.FIREBASE_CREDENTIALS_PATH || "/etc/secrets/firebase.json";

const serviceAccount = JSON.parse(
  fs.readFileSync(credentialsPath, "utf8")
);

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export default admin;