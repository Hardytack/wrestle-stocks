import React, { useEffect, useState } from "react";

import WrestlerBox from "../components/WrestlerBox";

export default function Home() {
  const [topWrestlers, setTopWrestlers] = useState([]);

  useEffect(() => {
    (async () => {
      await fetch("/api/wrestler/topWrestlers")
        .then((res) => res.json())
        .then((data) => {
          setTopWrestlers(data.top);
        });
    })();
  }, []);

  return (
    <div id="home">
      <h1>Top Wrestlers!</h1>
      {topWrestlers.length > 0 && (
        <div>
          <WrestlerBox promotion="WWE" wrestler={topWrestlers[0]} />
          <WrestlerBox promotion="AEW" wrestler={topWrestlers[1]} />
          <WrestlerBox promotion="NJPW" wrestler={topWrestlers[2]} />
        </div>
      )}
    </div>
  );
}
