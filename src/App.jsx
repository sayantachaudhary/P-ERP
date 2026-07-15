import { useState } from "react";

// import Header from "./components/Header.jsx";
import RepairForm from "./components/RepairForm.jsx";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <main className="container-sm">
        <section>
          <h2>Repair Form</h2>
          <RepairForm />
        </section>
      </main>
    </>
  );
}

export default App;
