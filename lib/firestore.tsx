// lib/firestore.ts
import { getFirestore } from "firebase/firestore";
import { app } from "../firebaseConfig"; // make sure your firebase.ts exports `app`

export const db = getFirestore(app);
