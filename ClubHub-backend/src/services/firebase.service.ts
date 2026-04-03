import admin from "firebase-admin";
import serviceAccount from "../config/adecas-70555-firebase-adminsdk-fbsvc-bf0ae60726.json";

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as any),
  });
}

export default admin;
