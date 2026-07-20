import { useState } from "react";

function RepairForm() {
  const today = new Date().toLocaleDateString("en-CA");
  const [phone, setPhone] = useState("");
  const [parts, setParts] = useState([
    {
      id: 1,
      partName: "",
      quantity: 1,
      rate: 0,
    },
  ]);

  function handleAddPart() {
    setParts((prevParts) => [
      ...prevParts,
      {
        id: Date.now(),
        partName: "",
        quantity: 1,
        rate: 0,
      },
    ]);
  }

  function handleDeletePart(id) {
    if (parts.length === 1) {
      return;
    }

    setParts((prevParts) => prevParts.filter((part) => part.id !== id));
  }

  const grandTotal = parts.reduce((total, part) => {
    return total + part.quantity * part.rate;
  }, 0);

  function handlePartChange(id, field, value) {
    setParts((prevParts) =>
      prevParts.map((part) =>
        part.id === id
          ? {
            ...part,
            [field]: field === "partName" ? value : Number(value),
          }
          : part,
      ),
    );
  }

  function handleSubmit() {
    e.preventDefault();
    alert("handleSubmit");
  }

  return (
    <form onSubmit={handleSubmit}>
      <fieldset>
        <legend>Repair Form</legend>
        <div className="form-group">
          <label htmlFor="date">Date:</label>
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
          <label htmlFor="from">From:</label>
          <input
            type="text"
            id="from"
            name="from"
            defaultValue="Krupa Impex"
            readOnly
          />
        </div>

        <div className="form-group">
          <label htmlFor="customer">To:</label>
          <select id="customer" name="customer" defaultValue="" required>
            <option disabled value="">
              Select your customer
            </option>
            <option value="khodiyar-textile">Khodiyar Textile</option>
            <option value="radhe-textile">Radhe Textile</option>
            <option value="om-fabrics">Om Fabrics</option>
          </select>
        </div>

        <div>
          <label htmlFor="phone">Phone:</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={phone}
            onChange={(e) =>
              setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))
            }
            required
          />
        </div>

        <div>
          <label htmlFor="gst">GST:</label>
          <input type="text" id="gst" name="gst" placeholder="Optional" />
        </div>
      </fieldset>

      <hr />

      <fieldset>
        <legend>Parts Used</legend>
        <table>
          <thead>
            <tr>
              <th>Part Name</th>
              <th>Qty</th>
              <th>Rate</th>
              <th>Amount</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {parts.map((part) => (
              <tr key={part.id}>
                <td>
                  <input
                    type="text"
                    name="partName"
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

                {/* <td> */}
                {/*   <strong>₹{grandTotal}</strong> */}
                {/* </td> */}
                <td>₹{part.quantity * part.rate}</td>

                <td>
                  <button
                    type="button"
                    onClick={() => handleDeletePart(part.id)}
                  >
                    🗑
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div>
          <strong>Grand Total: ₹{grandTotal}</strong>
        </div>

        <button type="button" onClick={handleAddPart}>
          ➕ Add Part
        </button>
      </fieldset>

      <button type="submit" onClick={handleSubmit}>
        💾 Save
      </button>
    </form>
  );
}

export default RepairForm;
