import { useEffect, useState } from "react";
import { getAllInvoices } from "../db.js";

function Record() {
  const [invoices, setInvoices] = useState([]);
  const [filterDate, setFilterDate] = useState("");
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    getAllInvoices().then(setInvoices);
  }, []);

  const filtered = filterDate
    ? invoices.filter((inv) => inv.date === filterDate)
    : invoices;

  return (
    <div>
      <div className="form-group">
        <label htmlFor="filterDate">Filter by date</label>
        <input
          type="date"
          id="filterDate"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
        />
      </div>

      {filtered.length === 0 && <p>No bills found.</p>}

      {filtered.map((inv) => (
        <article key={inv.id} onClick={() => setSelected(inv)} style={{ cursor: "pointer" }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div>
              <strong>{inv.customerName || "Unnamed customer"}</strong>
              <div>
                <small>{inv.invoiceNo} · {inv.date}</small>
              </div>
            </div>
            <strong>₹{inv.total}</strong>
          </div>
        </article>
      ))}

      {selected && (
        <dialog open>
          <article>
            <header>
              <a href="#close" aria-label="Close" className="close" onClick={() => setSelected(null)}></a>
              {selected.invoiceNo} · {selected.date}
            </header>
            <p>From: {selected.from}</p>
            <p>To: {selected.customerName}</p>
            {selected.gst && <p>GST: {selected.gst}</p>}
            <table>
              <thead>
                <tr><th>Part</th><th>Qty</th><th>Rate</th><th>Amount</th></tr>
              </thead>
              <tbody>
                {selected.items.map((it, i) => (
                  <tr key={i}>
                    <td>{it.partName}</td>
                    <td>{it.quantity}</td>
                    <td>₹{it.rate}</td>
                    <td>₹{it.quantity * it.rate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p><strong>Total: ₹{selected.total}</strong></p>
            <p>Status: {selected.status}</p>
            <button type="button" onClick={() => window.print()}>Print</button>
          </article>
        </dialog>
      )}
    </div>
  );
}

export default Record;
