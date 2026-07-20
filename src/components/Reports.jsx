import { useEffect, useState } from "react";
import { getAllInvoices, computeStatus } from "../db.js";

function startOfWeek(date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = (day === 0 ? -6 : 1) - day;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function Reports() {
  const [weekTotal, setWeekTotal] = useState(0);
  const [monthTotal, setMonthTotal] = useState(0);
  const [monthDue, setMonthDue] = useState(0);
  const [byMonth, setByMonth] = useState({});

  useEffect(() => {
    getAllInvoices().then((invoices) => {
      const now = new Date();
      const weekStart = startOfWeek(now);
      const monthKey = now.toISOString().slice(0, 7);

      let week = 0;
      let month = 0;
      let due = 0;
      const monthMap = {};

      invoices.forEach((inv) => {
        const invDate = new Date(inv.date + "T00:00:00");
        const { balanceDue } = computeStatus(inv);

        if (invDate >= weekStart) week += inv.total;

        const mk = inv.date.slice(0, 7);
        if (mk === monthKey) {
          month += inv.total;
          due += balanceDue;
        }
        monthMap[mk] = (monthMap[mk] || 0) + inv.total;
      });

      setWeekTotal(week);
      setMonthTotal(month);
      setMonthDue(due);
      setByMonth(monthMap);
    });
  }, []);

  const months = Object.keys(byMonth).sort().reverse();

  return (
    <div>
      <div className="grid">
        <article>
          <small>This Week</small>
          <h4>₹{weekTotal}</h4>
        </article>
        <article>
          <small>This Month (Billed)</small>
          <h4>₹{monthTotal}</h4>
        </article>
        <article>
          <small>This Month (Still Due)</small>
          <h4>₹{monthDue}</h4>
        </article>
      </div>

      <h5>Monthly Breakdown</h5>
      {months.length === 0 && <p>No data yet.</p>}
      {months.map((m) => (
        <article key={m} style={{ display: "flex", justifyContent: "space-between" }}>
          <span>{m}</span>
          <strong>₹{byMonth[m]}</strong>
        </article>
      ))}
    </div>
  );
}

export default Reports;
