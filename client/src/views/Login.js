import React, { useState } from "react";
import { useHistory } from "react-router-dom";

export default function Login(props) {
  let history = useHistory();
  const [type, setType] = useState("Login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [disableButton, setDisableButton] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setDisableButton(true);
    await fetch("/api/user/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    })
      .then((res) => {
        if (res.status !== 201) {
          throw new Error({ message: "Login Failed" });
        } else {
          return res.json();
        }
      })
      .then((data) => {
        localStorage.setItem("token", data.token);
        localStorage.setItem("username", data.user.username);
        history.push("/");
        props.setUsername(data.user.username);
      })
      .catch((err) => {
        console.log(err);
        setErrorMessage("Login Failed");
        setDisableButton(false);
      });
  };

  if (type === "Login") {
    return (
      <div>
        <form onSubmit={(e) => handleLogin(e)}>
          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <input type="submit" value="Login" disabled={disableButton} />
        </form>
        {errorMessage && <h3>{errorMessage}</h3>}
        <button onClick={() => setType("Signup")}>Switch to Sign Up</button>
      </div>
    );
  } else if (type === "Signup") {
    return (
      <div>
        <h1>Hello, New User</h1>
        <button onClick={() => setType("Login")}>Switch to Sign Up</button>
      </div>
    );
  } else {
    return <h1>Loading</h1>;
  }
}
