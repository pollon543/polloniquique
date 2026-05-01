import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';

export const ORDERS_PATH = 'pollon_orders_v1';
export const ORDERS_KEY = 'pollon_orders_local_v1';

const firebaseConfig = {
  apiKey: 'AIzaSyAWv3zPEUU82YcLSwOxsv-MQZP2ZjcycOg',
  authDomain: 'elpollon01-307da.firebaseapp.com',
  databaseURL: 'https://elpollon01-307da-default-rtdb.firebaseio.com',
  projectId: 'elpollon01-307da',
  storageBucket: 'elpollon01-307da.firebasestorage.app',
  messagingSenderId: '1024156951564',
  appId: '1:1024156951564:web:946a9b6003d8dff1053a29',
};

let db = null;
let ordersRef = null;
let firestoreReady = false;

export function getFirestoreState() {
  return { db, ordersRef, firestoreReady };
}

export function isFirestoreActive() {
  return firestoreReady;
}

/**
 * @param {(orders: object[], meta: { prevCount: number }) => void} onSnapshotData
 */
export function initOrdersBackend(onSnapshotData) {
  try {
    const looksPlaceholder = Object.values(firebaseConfig).some((v) => String(v).includes('REEMPLAZA'));
    if (looksPlaceholder) {
      console.warn('[Firebase] Config placeholder: usando localStorage.');
      firestoreReady = false;
      return () => {};
    }

    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }

    db = firebase.firestore();
    ordersRef = db.collection(ORDERS_PATH);
    firestoreReady = true;

    let prevCount = 0;

    const unsub = ordersRef.orderBy('createdAt', 'asc').onSnapshot((snap) => {
      try {
        const incoming = [];
        snap.forEach((doc) => incoming.push({ id: doc.id, ...doc.data() }));
        incoming.sort((a, b) => (a.createdAt || '').localeCompare(b.createdAt || ''));

        const hasNew = prevCount > 0 && incoming.length > prevCount;
        prevCount = incoming.length;
        onSnapshotData(incoming, { hasNew });
      } catch (err) {
        console.warn('[Firebase] Error en listener:', err);
      }
    });

    return () => {
      unsub();
    };
  } catch (err) {
    console.warn('[Firebase] Falló init, usando localStorage:', err);
    firestoreReady = false;
    return () => {};
  }
}

export function loadOrdersFromStorage() {
  if (firestoreReady) return [];
  try {
    const raw = localStorage.getItem(ORDERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function persistOrdersLocal(orders) {
  try {
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
  } catch {
    /* localStorage puede estar bloqueado */
  }
}

export function saveOrdersBatch(orders) {
  const { db: ldb, ordersRef: ref, firestoreReady: ready } = getFirestoreState();
  if (ready && ref && ldb) {
    const batch = ldb.batch();
    orders.forEach((o) => {
      const docRef = ref.doc(o.id);
      batch.set(docRef, o, { merge: true });
    });
    batch.commit().catch((e) => {
      console.warn('[Firebase] batch commit error, fallback local:', e);
      persistOrdersLocal(orders);
    });
  } else {
    persistOrdersLocal(orders);
  }
}

export function saveSingleOrderRemote(order) {
  const ref = ordersRef;
  if (firestoreReady && ref) {
    return ref
      .doc(order.id)
      .set(order, { merge: true })
      .catch((e) => {
        console.warn('[Firebase] set(order) falló:', e);
        return Promise.reject(e);
      });
  }
  return Promise.resolve();
}
