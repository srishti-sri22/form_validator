import React from "react";
import {FormValidationWidget} from "./FormValidationWidget";


const App = () => {
  const fields = [
    {
      label: "Full Name",
      name: "name",
      required: true,
      validation: (v) => (!v ? "Name is required" : "")
    },
    {
      label: "Email",
      name: "email",
      type: "email",
      required: true,
      validation: (v) =>
        !v
          ? "Email is required"
          : !/\S+@\S+\.\S+/.test(v)
          ? "Invalid email format"
          : ""
    },
    {
      label: "Gender",
      name: "gender",
      type: "select",
      options: [
        { value: "male", label: "Male" },
        { value: "female", label: "Female" },
        { value: "other", label: "Other" }
      ],
      validation: (v) => (!v ? "Please select a gender" : "")
    },
    {
      label: "About You",
      name: "about",
      type: "textarea",
      maxLength: 100,
      showCharCount: true,
      validation: (v) =>
        !v ? "Tell us something" : v.length < 10 ? "Minimum 10 chars" : ""
    }
  ];

  const handleSubmit = (data) => {
    console.log("Form Data:", data);
    alert("Submitted successfully!");
  };

  return (
    <FormValidationWidget
      title="User Information"
      subtitle="Fill the fields below"
      fields={fields}
      onSubmit={handleSubmit}
    />
  );
};

export default App;
