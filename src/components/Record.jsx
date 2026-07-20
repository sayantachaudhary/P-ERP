import { useEffect, useState } from "react";
import { getAllInvoices, addPayment, computeStatus } from "../db.js";

const STATUS_LABEL = { due: "Due", partial: "Partial", paid: "Paid" };
const STATUS_COLOR = { due: "#B0452F", partial: "#C87F2B", paid: "#3E8F5C" };

function Record() {
  const [invoices, setInvoices] = useState([]);
  const [filterDate, setFilterDate] = useState("");
  const [filterCustomer, setFilterCustomer] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selected, setSelected] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState("");

  async function refresh() {
    const all = await getAllInvoices();
    setInvoices(all);
    return all;
  }

  useEffect(() => {
    refresh();
  }, []);

  const filtered = invoices.filter((inv) => {
    if (filterDate && inv.date !== filterDate) return false;
    if (
      filterCustomer &&
      !inv.customerName?.toLowerCase().includes(filterCustomer.trim().toLowerCase())
    )
      return false;
    if (filterStatus !== "all") {
      const { status } = computeStatus(inv);
      if (status !== filterStatus) return false;
    }
    return true;
  });

  function clearFilters() {
    setFilterDate("");
    setFilterCustomer("");
    setFilterStatus("all");
  }

  async function handleLogPayment(e) {
    e.preventDefault();
    const amount = Number(paymentAmount);
    if (!amount || amount <= 0) {
      alert("Enter a valid payment amount.");
      return;
    }
    const { balanceDue } = computeStatus(selected);
    if (amount > balanceDue) {
      const proceed = confirm(
        `This is ₹${amount}, but only ₹${balanceDue} is due. Log it anyway?`
      );
      if (!proceed) return;
    }
    const updated = await addPayment(selected.id, amount);
    setPaymentAmount("");
    setSelected(updated);
    await refresh();
  }

  return (
    <div>
      <div className="grid">
        <div className="form-group">
          <label htmlFor="filterDate">Date</label>
          <input
            type="date"
            id="filterDate"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="filterCustomer">Customer</label>
          <input
            type="text"
            id="filterCustomer"
            placeholder="Search by name"
            value={filterCustomer}
            onChange={(e) => setFilterCustomer(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="filterStatus">Status</label>
          <select
            id="filterStatus"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All</option>
            <option value="due">Due</option>
            <option value="partial">Partial</option>
            <option value="paid">Paid</option>
          </select>
        </div>
      </div>

      {(filterDate || filterCustomer || filterStatus !== "all") && (
        <button type="button" className="outline" onClick={clearFilters}>
          Clear Filters
        </button>
      )}

      <p>
        <small>{filtered.length} bill{filtered.length !== 1 ? "s" : ""} found</small>
      </p>

      {filtered.length === 0 && <p>No bills found.</p>}

      {filtered.map((inv) => {
        const { status, balanceDue } = computeStatus(inv);
        return (
          <article key={inv.id} onClick={() => setSelected(inv)} style={{ cursor: "pointer" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <strong>{inv.customerName || "Unnamed customer"}</strong>
                <div>
                  <small>{inv.invoiceNo} · {inv.date}</small>
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <strong>₹{inv.total}</strong>
                <div>
                  <small style={{ color: STATUS_COLOR[status] }}>
                    {STATUS_LABEL[status]}
                    {status === "partial" ? ` · ₹${balanceDue} due` : ""}
                  </small>
                </div>
              </div>
            </div>
          </article>
        );
      })}

      {selected && (() => {
        const { amountPaid, balanceDue, status } = computeStatus(selected);
        return (
          <dialog open>
            <article>
              <header>
                <a
                  href="#close"
                  aria-label="Close"
                  className="close"
                  onClick={() => {
                    setSelected(null);
                    setPaymentAmount("");
                  }}
                ></a>
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
              <p>
                Paid so far: ₹{amountPaid} &nbsp;·&nbsp; Balance due: ₹{balanceDue} &nbsp;·&nbsp;
                <span style={{ color: STATUS_COLOR[status] }}>{STATUS_LABEL[status]}</span>
              </p>

              {selected.payments?.length > 0 && (
                <>
                  <p><strong>Payment history</strong></p>
                  <ul>
                    {selected.payments.map((p, i) => (
                      <li key={i}>{p.date} — ₹{p.amount}</li>
                    ))}
                  </ul>
                </>
              )}

              {balanceDue > 0 && (
                <form onSubmit={handleLogPayment}>
                  <div className="grid">
                    <input
                      type="number"
                      min="1"
                      placeholder={`Up to ₹${balanceDue}`}
                      value={paymentAmount}
                      onChange={(e) => setPaymentAmount(e.target.value)}
                    />
                    <button type="submit">Log Payment</button>
                  </div>
                </form>
              )}

              <button type="button" onClick={() => window.print()}>Print</button>
            </article>
          </dialog>
        );
      })()}
    </div>
  );
}

export default Record;
