import * as admin from "firebase-admin";
import SaCredentials from "../../config/sentencemixer-local-dev";

const serviceAccount = SaCredentials as admin.ServiceAccount;
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_REALTIME_DATABASE,
});

const db = admin.database();

export { admin, db };
