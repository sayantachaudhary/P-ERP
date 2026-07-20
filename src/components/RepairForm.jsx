import { useEffect, useState } from "react";
import {
  saveInvoice,
  peekNextInvoiceNo,
  getParts,
  addPartIfNew,
  getCustomers,
  addCustomerIfNew,
} from "../db.js";

import "./RepairForm.css";

function RepairForm() {
  const today = new Date().toLocaleDateString("en-CA");

  const [invoiceNo, setInvoiceNo] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [gst, setGst] = useState("");
  const [status, setStatus] = useState("due");
  const [partsCatalog, setPartsCatalog] = useState([]);
  const [customerCatalog, setCustomerCatalog] = useState([]);
  const [parts, setParts] = useState([
    { id: 1, partName: "", quantity: 1, rate: 0 },
  ]);

  useEffect(() => {
    peekNextInvoiceNo().then(setInvoiceNo);
    getParts().then(setPartsCatalog);
    getCustomers().then(setCustomerCatalog);
  }, []);

  function handleAddPart() {
    setParts((prev) => [
      ...prev,
      { id: Date.now(), partName: "", quantity: 1, rate: 0 },
    ]);
  }

  function handleDeletePart(id) {
    if (parts.length === 1) return;
    setParts((prev) => prev.filter((part) => part.id !== id));
  }

  function handlePartChange(id, field, value) {
    setParts((prev) =>
      prev.map((part) =>
        part.id === id
          ? { ...part, [field]: field === "partName" ? value : Number(value) }
          : part,
      ),
    );
  }

  const grandTotal = parts.reduce(
    (total, part) => total + part.quantity * part.rate,
    0,
  );

  async function resetForm() {
    const nextNo = await peekNextInvoiceNo();
    setInvoiceNo(nextNo);
    setCustomerName("");
    setPhone("");
    setGst("");
    setStatus("due");
    setParts([{ id: 1, partName: "", quantity: 1, rate: 0 }]);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const cleanItems = parts.filter((p) => p.partName.trim());
    if (cleanItems.length === 0) {
      alert("Add at least one part.");
      return;
    }

    const invoiceData = {
      date: today,
      from: "Krupa Impex",
      customerName: customerName.trim(),
      phone,
      gst,
      status,
      items: cleanItems.map((p) => ({
        partName: p.partName.trim(),
        quantity: p.quantity,
        rate: p.rate,
      })),
      total: grandTotal,
    };

    const savedInvoice = await saveInvoice(invoiceData);
    for (const item of savedInvoice.items) await addPartIfNew(item.partName);
    if (savedInvoice.customerName)
      await addCustomerIfNew(savedInvoice.customerName);

    await resetForm();
    setPartsCatalog(await getParts());
    setCustomerCatalog(await getCustomers());
    alert("Bill saved.");
  }

  return (
    <form onSubmit={handleSubmit}>
      <fieldset>
        <div className="grid">
          <div className="form-group">
            <label htmlFor="date">DATE</label>
            <input
              type="date"
              id="date"
              name="date"
              defaultValue={today}
              onClick={(e) => e.target.showPicker?.()}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="invoiceNo">INVOICE NO.</label>
            <input type="text" id="invoiceNo" value={invoiceNo} readOnly />
          </div>
        </div>

        <div className="grid">
          <div className="form-group">
            <label htmlFor="from">FROM</label>
            <input
              type="text"
              id="from"
              name="from"
              defaultValue="Krupa Impex"
              readOnly
            />
          </div>

          <div className="form-group">
            <label htmlFor="customer">TO</label>
            <input
              type="text"
              id="customer"
              list="customerOptions"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Company Name"
              required
            />
            <datalist id="customerOptions">
              {customerCatalog.map((name) => (
                <option key={name} value={name} />
              ))}
            </datalist>
          </div>
        </div>

        <div className="grid">
          <div className="form-group">
            <label htmlFor="phone">PHONE</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={phone}
              onChange={(e) =>
                setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))
              }
            />
          </div>

          <div className="form-group">
            <label htmlFor="status">STATUS</label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="due">Due</option>
              <option value="paid">Paid</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="gst">GST:</label>
          <input
            type="text"
            id="gst"
            name="gst"
            placeholder="Optional"
            value={gst}
            onChange={(e) => setGst(e.target.value)}
          />
        </div>
      </fieldset>

      <hr />

      <fieldset>
        <table className="parts-table">
          <thead>
            <tr>
              <th>PART NAME</th>
              <th>QTY</th>
              <th>RATE</th>
              <th>AMOUNT</th>
              {/* <th></th> */}
            </tr>
          </thead>
          <tbody>
            {parts.map((part) => (
              <tr key={part.id}>
                <td>
                  <input
                    type="text"
                    list="partOptions"
                    placeholder="Search"
                    value={part.partName}
                    onChange={(e) =>
                      handlePartChange(part.id, "partName", e.target.value)
                    }
                  />
                </td>
                <td>
                  <input
                    type="number"
                    min="1"
                    value={part.quantity}
                    onChange={(e) =>
                      handlePartChange(part.id, "quantity", e.target.value)
                    }
                  />
                </td>
                <td>
                  <input
                    type="number"
                    min="0"
                    value={part.rate}
                    onChange={(e) =>
                      handlePartChange(part.id, "rate", e.target.value)
                    }
                  />
                </td>
                <td>₹{part.quantity * part.rate}</td>
                <td>
                  <button
                    type="button"
                    className="outline"
                    onClick={() => handleDeletePart(part.id)}
                  >
                    🗑
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <datalist id="partOptions">
          {partsCatalog.map((name) => (
            <option key={name} value={name} />
          ))}
        </datalist>

        <div className="parts-footer">
          <button type="button" onClick={handleAddPart}>
            ➕ Add Part
          </button>
          <strong>Grand Total: ₹{grandTotal}</strong>
        </div>
      </fieldset>

      <button type="submit">💾 Save</button>
    </form>
  );
}

export default RepairForm;
