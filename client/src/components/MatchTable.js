import React from "react";

export default function MatchTable(props) {
  return (
    <table className="matchTable">
      <thead>
        <tr>
          <td>Winner(s)</td>
          <td>Losers(s)</td>
          <td>Finish</td>
          <td>Event</td>
          <td>Date</td>
          <td>Title</td>
        </tr>
      </thead>
      <tbody>
        {props.matches.map((match) => {
          return (
            <tr key={match._id}>
              <td>
                {match.winners.length > 5
                  ? `${match.winners.length} wrestlers`
                  : match.winners.length === 1
                  ? match.winners
                  : match.winners.join(", ").length > 30
                  ? `${match.winners.length} wrestlers`
                  : match.winners.join(", ")}
              </td>
              <td>
                {match.losers.length > 5
                  ? `${match.losers.length} wrestlers`
                  : match.losers.length === 1
                  ? match.losers
                  : match.losers.join(", ").length > 30
                  ? `${match.losers.length} wrestlers`
                  : match.losers.join(", ")}
              </td>
              <td>{match.finish}</td>
              <td>{match.event}</td>
              <td>{match.date}</td>
              <td>{match.titleMatch ? match.titleOptions[0].title : "N/A"}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
