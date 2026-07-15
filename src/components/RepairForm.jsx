function RepairForm() {
  const today = new Date().toLocaleDateString("en-CA");

  function handleSubmit() {
    alert("handleSubmit");
  }

  function handlePrint() {
    alert("handlePrint");
  }

  function handleShare() {
    alert("handleShare");
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="date">Date</label>
        <input
          type="date"
          id="date"
          name="date"
          defaultValue={today}
          required
        />
      </div>

      <div>
        <label htmlFor="from">From*</label>
        <input type="text" id="from" name="from" required />
      </div>

      <div>
        <label htmlFor="to">To*</label>
        <input type="text" id="to" name="to" required />
      </div>

      <div>
        <label htmlFor="gst">GST</label>
        <input type="text" id="gst" name="gst" placeholder="Optional" />
      </div>

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
          <tr>
            <td>
              <input type="text" name="partName" placeholder="Search..." />
            </td>

            <td>
              <input type="number" min="1" defaultValue={1} />
            </td>

            <td>
              <input type="number" min="0" defaultValue={0} />
            </td>

            <td>₹0</td>

            <td>
              <button type="button">🗑</button>
            </td>
          </tr>
        </tbody>
      </table>

      <button type="button">➕ Add Part</button>

      <button type="submit">💾 Save</button>
      <button type="button" onClick={handlePrint}>
        🖨️ Print
      </button>
      <button type="button" onClick={handleShare}>
        🚀 Share
      </button>
    </form>
  );
}

export default RepairForm;
