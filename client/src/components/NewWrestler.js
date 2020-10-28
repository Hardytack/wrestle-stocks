import React, { useState } from "react";

export default function NewWrestler() {
  const [name, setName] = useState("");
  const [prom, setProm] = useState("");

  const handleNameSubmmit = async (e) => {
    e.preventDefault();
    const data = {
      name: name,
      promotions: prom.split(", "),
    };
    await fetch("/api/wrestler/new", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }).then((res) => {
      if (res.status !== 201) {
        alert("An error has occured");
      } else {
        alert("Added successfully");
      }
      setName("");
      setProm("");
    });
  };

  return (
    <form onSubmit={handleNameSubmmit}>
      <div className="inputGroup">
        <label>Name</label>
        <input
          type="text"
          onChange={(e) => setName(e.target.value)}
          value={name}
          required
        />
      </div>
      <div className="inputGroup">
        <label>Promotion(s)</label>
        <input
          type="text"
          onChange={(e) => setProm(e.target.value)}
          value={prom}
          required
        />
      </div>
      <input className="save" type="submit" value="Save" />
    </form>
  );
}
