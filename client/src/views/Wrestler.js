import React, { useEffect, useState } from "react";
import MatchRecord from "../components/MatchTable";

export default function Wrestler(props) {
  const [wrestler, setWrestler] = useState({ profile: {}, matches: [] });
  const [record, setRecord] = useState({ wins: 0, losses: 0 });

  async function getWrestler(name) {
    setWrestler({ profile: {}, matches: [] });
    await fetch(`/api/wrestler/${name}/profile`)
      .then((res) => res.json())
      .then(async (data) => {
        if (data.error) {
          setWrestler({ notFound: "Wrestler not found" });
        } else {
          setWrestler(data);
          setRecord(getRecord(data.matches, data.profile.name));
        }
      });
  }

  function getPointDifference() {
    if (!wrestler.profile.prevPoints) {
      return "";
    }
    let current = wrestler.profile.points;
    let old =
      wrestler.profile.prevPoints[wrestler.profile.prevPoints.length - 1];
    if (current > old) {
      return `+${current - old}`;
    } else {
      return `-${old - current}`;
    }
  }

  function getRecord(matches, name) {
    let wins = 0;
    let losses = 0;
    matches.forEach((match) => {
      if (match.winners.includes(name)) {
        return wins++;
      } else {
        return losses++;
      }
    });
    return { wins, losses };
  }

  useEffect(() => {
    (async () => {
      await getWrestler(props.match.params.name);
    })();
    // eslint-disable-next-line
  }, [props.match.params.name]);

  if (!wrestler) {
    return (
      <div>
        <h1>Loading</h1>
      </div>
    );
  } else if (wrestler.notFound) {
    return (
      <div>
        <h1>Wrestler Not Found</h1>
      </div>
    );
  } else {
    return (
      <div id="wrestlerContainer">
        <img src={wrestler.profile.picture} alt={wrestler.profile.name} />
        <h1>{wrestler.profile.name}</h1>
        <h2>{wrestler.profile.points}</h2>
        <h3>{getPointDifference()}</h3>
        <h4>
          {record.wins} - {record.losses}
        </h4>
        <MatchRecord matches={wrestler.matches} />
      </div>
    );
  }
}
