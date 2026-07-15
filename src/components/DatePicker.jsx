import { useState } from "react";

import { DayPicker } from "@daypicker/react";
import "@daypicker/react/style.css";

function DatePicker() {
  const [selected, setSelected] = useState();

  return (
    <DayPicker
      animate
      mode="single"
      selected={selected}
      onSelect={setSelected}
      footer={
        selected ? `Selected: ${selected.toLocaleDateString()}` : "Pick a day."
      }
    />
  );
}

export default DatePicker;
