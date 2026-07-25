import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { app, db };

/**
 * Üretilen kimlik formatı: HUNTER-4X9A-B2M7-K1P9 (3 bloklu rastgele alfanumerik)
 */
export function generateHunterID() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const getBlock = () => {
    let block = '';
    for (let i = 0; i < 4; i++) {
      block += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return block;
  };
  return `HUNTER-${getBlock()}-${getBlock()}-${getBlock()}`;
}

/**
 * Kullanıcının ekranda göreceği 4 haneli eşleştirme kodu (örn: 7392)
 */
export function generatePairingCode() {
  return Math.floor(1000 + Math.random() * 9000).toString();
}
