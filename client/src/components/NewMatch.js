import React, { useState } from "react";

export default function NewMatch() {
  const [winners, setWinners] = useState("");
  const [losers, setLosers] = useState("");
  const [finish, setFinish] = useState("");
  const [stipulation, setStipulation] = useState("None");
  const [titleMatch, setTitleMatch] = useState(false);
  const [titleOptions, setTitleOptions] = useState({
    change: false,
    title: "",
    new: "",
    old: "",
  });
  const [event, setEvent] = useState("");
  const [date, setDate] = useState("");

  const clearForm = () => {
    setWinners("");
    setLosers("");
    setTitleMatch(false);
    setFinish("");
    setStipulation("None");
    setTitleOptions({ change: false, title: "", new: "", old: "" });
  };

  const handleMatchSubmmit = async (e) => {
    e.preventDefault();
    const data = {
      winners: winners.split(", "),
      losers: losers.split(", "),
      finish,
      stipulation,
      event,
      titleMatch,
      date,
    };
    if (titleMatch) {
      data.titleOptions = [
        {
          ...titleOptions,
          new: titleOptions.new.split(", "),
          old: titleOptions.old.split(", "),
        },
      ];
    }
    await fetch("/api/matches/new", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }).then((res) => {
      if (res.status !== 201) {
        alert("An error has occured");
      } else {
        clearForm();
        alert("Added successfully");
      }
    });
  };
  return (
    <form onSubmit={handleMatchSubmmit}>
      <div className="inputGroup">
        <label>Winners</label>
        <input
          type="text"
          onChange={(e) => setWinners(e.target.value)}
          value={winners}
          required
        />
      </div>
      <div className="inputGroup">
        <label>Losers</label>
        <input
          type="text"
          onChange={(e) => setLosers(e.target.value)}
          value={losers}
          required
        />
      </div>
      <div className="inputGroup">
        <label>Finish</label>
        <input
          type="text"
          onChange={(e) => setFinish(e.target.value)}
          value={finish}
          required
        />
      </div>
      <div className="inputGroup">
        <label>Stipulation</label>
        <input
          type="text"
          onChange={(e) => setStipulation(e.target.value)}
          value={stipulation}
          required
        />
      </div>
      <div className="inputGroup">
        <label>Title Match</label>
        <input
          type="checkbox"
          checked={titleMatch}
          onChange={() => setTitleMatch(!titleMatch)}
        ></input>
      </div>
      {titleMatch && (
        <div className="optionGroup">
          <div className="inputGroup">
            <label>Title Change</label>
            <input
              type="checkbox"
              checked={titleOptions.change}
              onChange={() =>
                setTitleOptions({
                  ...titleOptions,
                  change: !titleOptions.change,
                })
              }
            ></input>
          </div>
          <div className="inputGroup">
            <label>Title</label>
            <input
              type="text"
              onChange={(e) =>
                setTitleOptions({ ...titleOptions, title: e.target.value })
              }
              value={titleOptions.title}
              required
            />
          </div>
          <div className="inputGroup">
            <label>Title Winner</label>
            <input
              type="text"
              onChange={(e) =>
                setTitleOptions({ ...titleOptions, new: e.target.value })
              }
              value={titleOptions.new}
            />
          </div>
          <div className="inputGroup">
            <label>Title Loser</label>
            <input
              type="text"
              onChange={(e) =>
                setTitleOptions({ ...titleOptions, old: e.target.value })
              }
              value={titleOptions.old}
            />
          </div>
        </div>
      )}

      <div className="inputGroup">
        <label>Event</label>
        <input
          type="text"
          onChange={(e) => setEvent(e.target.value)}
          value={event}
          required
        />
      </div>
      <div className="inputGroup">
        <label>Date</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
      </div>
      <input className="save" type="submit" value="Save" />
    </form>
  );
}
