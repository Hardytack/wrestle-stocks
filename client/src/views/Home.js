import React, { useEffect, useState } from "react";

import WrestlerList from "../components/WrestlerList";

export default function Home() {
  const [wrestlers, setWrestlers] = useState([]);

  useEffect(() => {
    (async () => {
      const data = await fetch(`/api/wrestler/all`).then((res) => res.json());
      setWrestlers(data.wrestlers);
    })();
  }, []);

  return (
    <div id="home">
      <h1>Welcome!</h1>
      <WrestlerList wrestlers={wrestlers} />
    </div>
  );
}
