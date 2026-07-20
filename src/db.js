// src/db.js
// Plain IndexedDB wrapper — no external library needed.

const DB_NAME = "jacquard-billing";
const DB_VERSION = 1;

function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);

    req.onupgradeneeded = (e) => {
      const db = e.target.result;

      if (!db.objectStoreNames.contains("invoices")) {
        const store = db.createObjectStore("invoices", { keyPath: "id" });
        store.createIndex("by_date", "date");
      }
      if (!db.objectStoreNames.contains("parts")) {
        db.createObjectStore("parts", { keyPath: "name" });
      }
      if (!db.objectStoreNames.contains("customers")) {
        db.createObjectStore("customers", { keyPath: "name" });
      }
      if (!db.objectStoreNames.contains("meta")) {
        db.createObjectStore("meta", { keyPath: "key" });
      }
    };

    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

function tx(db, storeName, mode) {
  return db.transaction(storeName, mode).objectStore(storeName);
}

function formatInvoiceNo(seq) {
  return "JQ-" + String(seq).padStart(4, "0");
}

// ---------- invoices ----------

// Safe to call anytime (mount, reset, re-render) — does NOT consume a number.
export async function peekNextInvoiceNo() {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const req = tx(db, "meta", "readonly").get("invoiceSeq");
    req.onsuccess = () => {
      const seq = (req.result?.value || 0) + 1;
      resolve(formatInvoiceNo(seq));
    };
    req.onerror = () => reject(req.error);
  });
}

// Only call this at the moment of an actual save — it permanently consumes a number.
async function commitNextInvoiceNo() {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const store = tx(db, "meta", "readwrite");
    const getReq = store.get("invoiceSeq");
    getReq.onsuccess = () => {
      const seq = (getReq.result?.value || 0) + 1;
      const putReq = store.put({ key: "invoiceSeq", value: seq });
      putReq.onsuccess = () => resolve(formatInvoiceNo(seq));
      putReq.onerror = () => reject(putReq.error);
    };
    getReq.onerror = () => reject(getReq.error);
  });
}

// Assigns the real, consecutive invoice number at save time and persists the invoice.
export async function saveInvoice(invoiceData) {
  const invoiceNo = await commitNextInvoiceNo();
  const invoice = {
    ...invoiceData,
    invoiceNo,
    id: invoiceData.id || crypto.randomUUID(),
  };

  const db = await openDB();
  return new Promise((resolve, reject) => {
    const req = tx(db, "invoices", "readwrite").put(invoice);
    req.onsuccess = () => resolve(invoice);
    req.onerror = () => reject(req.error);
  });
}

export async function getAllInvoices() {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const req = tx(db, "invoices", "readonly").getAll();
    req.onsuccess = () => {
      const all = req.result.sort((a, b) => (b.date + b.invoiceNo).localeCompare(a.date + a.invoiceNo));
      resolve(all);
    };
    req.onerror = () => reject(req.error);
  });
}

// ---------- parts catalog ----------

export async function getParts() {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const req = tx(db, "parts", "readonly").getAll();
    req.onsuccess = () => resolve(req.result.map((p) => p.name));
    req.onerror = () => reject(req.error);
  });
}

export async function addPartIfNew(name) {
  if (!name?.trim()) return;
  const db = await openDB();
  tx(db, "parts", "readwrite").put({ name: name.trim() });
}

// ---------- customers ----------

export async function getCustomers() {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const req = tx(db, "customers", "readonly").getAll();
    req.onsuccess = () => resolve(req.result.map((c) => c.name));
    req.onerror = () => reject(req.error);
  });
}

export async function addCustomerIfNew(name) {
  if (!name?.trim()) return;
  const db = await openDB();
  tx(db, "customers", "readwrite").put({ name: name.trim() });
}
