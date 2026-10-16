
import { useState } from "react";

const API = "http://localhost:3000";

export default function App() {
  const [message, setMessage] = useState("");

  async function request(path, method = "GET", body) {
    const options = {
      method,
      credentials: "include"
    };

    if (body) {
      options.headers = { "Content-Type": "application/json" };
      options.body = JSON.stringify(body);
    }

    let res = await fetch(API + path, options);

    // If access token expires, refresh and retry
    if (res.status === 401 && path === "/profile") {
      alert('we are calling refresh')
      const refresh = await fetch(API + "/refresh", {
        method: "POST",
        credentials: "include"
      });

      if (refresh.ok) {
        res = await fetch(API + "/profile", {
          credentials: "include"
        });
      }
    }

    const data = await res.json();
    setMessage(data.message + (data.user ? ": " + data.user.email : ""));
  }

  return (
    <div>
      <h2>JWT Authentication</h2>

      <button onClick={() => request("/login", "POST", {
        email: "test@gmail.com",
        password: "1234"
      })}>
        Login
      </button>

      <button onClick={() => request("/profile")}>
        Access Profile
      </button>

      <button onClick={() => request("/refresh", "POST")}>
        Refresh Tokens
      </button>

      <button onClick={() => request("/logout", "POST")}>
        Logout
      </button>

      <p>{message}</p>
    </div>
  );
}
