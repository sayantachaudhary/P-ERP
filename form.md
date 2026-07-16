the most used form type

so the form elemnet is the wrapper
the main thing is the input

should i use the div container or the form container?

- Autocomplete
- Validate

Every <input> Type
When to use it

text
range
checkbox
radio

hidden
reset
button

input Attributes

autocomplete
autofocus
checked
selected
multiple
min
max
step
minlength
maxlength
pattern
accept
capture
list
form
size

What's the use of Form Encoding
application/x-www-form-urlencoded
multipart/form-data

HTML forms first (native browser behavior)

- <form> fundamentals
- <input> and all major input types
- name, id, value, and label
- <textarea>, <select>, <option>
  

- Buttons (submit, button, reset)
- Validation attributes (required, min, max, pattern, etc.)
- Form submission (GET, POST, action, method)
- FormData and browser form APIs
- Accessibility (label, fieldset, legend, ARIA basics)
- Advanced attributes (autocomplete, accept, capture, multiple, etc.)

---

From → Text + Autocomplete
To → Text + Autocomplete
GST → Text
Date → Date
Bill Number → Readonly
Machine Name → Text + Autocomplete
Machine Number → Text
Repair Notes → Textarea

---

Part Name → Autocomplete
Quantity → Number
Rate → Number
Total → Readonly

---

Grand Total → Readonly

---

Save → Submit Button
Print → Button
Share → Button

---

<!-- The id on an <input> is the same global HTML id attribute that you use on any other HTML element. -->
<!-- React uses htmlFor because for is a reserved keyword in JavaScript. -->
<!-- The <label> element gives a name (description) to a single form control. -->
<!-- <fieldset> groups multiple related form input -->

## Datebase

```javascript
{
  "date": "2026-07-17",
  "from": "Krupa Impex",
  "to": "Khodiyar Textile",
  "phone": "9876543210",
  "parts": [
    {
      "partName": "Pulley",
      "quantity": 2,
      "rate": 40
    }
  ],
  "grandTotal": 80
}
```
