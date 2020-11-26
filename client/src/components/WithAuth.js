import React, { useState, useEffect } from "react";
import { Redirect } from "react-router-dom";

export default function WithAuth(props, ComponentToProtect) {
  const [loading, setLoading] = useState(true);
  const [redirect, setRedirect] = useState(false);

  async function checkRoute() {
    if (!localStorage.getItem("token")) {
      setLoading(false);
      setRedirect(true);
      return;
    }
    const token = localStorage.getItem("token");
    await fetch("/api/user/checkToken", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        Username: `${localStorage.getItem("username")}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (res.status === 200) {
          setLoading(false);
        } else {
          const error = new Error(res.error);
          throw error;
        }
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
        setRedirect(true);
      });
  }

  useEffect(() => {
    (async () => {
      await checkRoute();
    })();
  }, []);

  if (loading) {
    return null;
  }
  if (redirect) {
    return <Redirect to="/" />;
  } else {
    return <ComponentToProtect {...props} />;
  }
}
