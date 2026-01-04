// lib/firestore.ts
import { getFirestore, initializeFirestore } from "firebase/firestore";
import { app } from "../firebaseConfig";

let _db;
try {
	_db = initializeFirestore(app, {
		experimentalForceLongPolling: true,
		useFetchStreams: false,
	} as any);
} catch (e) {
	_db = getFirestore(app);
}

export const db = _db;
