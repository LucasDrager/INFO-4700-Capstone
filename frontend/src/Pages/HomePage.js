import React, { useEffect, useState } from "react";
import axios from "axios";

const HomePage = () => {
  const [message, setMessage] = useState("");

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/api/welcome/")
      .then(response => {
        setMessage(response.data.message);
      })
      .catch(error => {
        console.error("Error fetching welcome message:", error);
      });
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>{message || "Loading..."}</h1>
      <p>This is the home page.</p>
    </div>
  );
};

export default HomePage;
