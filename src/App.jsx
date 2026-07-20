import { useState } from "react";
import RepairForm from "./components/RepairForm.jsx";
import Record from "./components/Record.jsx";
import Reports from "./components/Reports.jsx";

function App() {
  const [activeTab, setActiveTab] = useState("new");

  return (
    <main className="container-sm">
      <section>
        <h3>Jacquard Repair Billing</h3>

        <nav>
          <ul>
            <li>
              <button
                type="button"
                className={activeTab === "new" ? "contrast" : "outline"}
                onClick={() => setActiveTab("new")}
              >
                New Bill
              </button>
            </li>
            <li>
              <button
                type="button"
                className={activeTab === "records" ? "contrast" : "outline"}
                onClick={() => setActiveTab("records")}
              >
                Records
              </button>
            </li>
            <li>
              <button
                type="button"
                className={activeTab === "reports" ? "contrast" : "outline"}
                onClick={() => setActiveTab("reports")}
              >
                Reports
              </button>
            </li>
          </ul>
        </nav>

        {activeTab === "new" && <RepairForm />}
        {activeTab === "records" && <Record />}
        {activeTab === "reports" && <Reports />}
      </section>
    </main>
  );
}

export default App;
