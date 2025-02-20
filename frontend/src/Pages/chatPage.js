import React, { useState } from "react";

function App() {
    const [query, setQuery] = useState("");
    const [response, setResponse] = useState("");
    const [useWebSearch, setUseWebSearch] = useState(true);

    const API_URL = 'http://localhost:8000/api/chat/'

    const sendMessage = async () => {
        try {
            const res = await fetch(API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ query, use_web_search: useWebSearch })
            });

            if (!res.ok) {
                const text = await res.text();  // Log response as text
                console.error("Server response:", text);
                throw new Error(`HTTP error! Status: ${res.status}`);
            }

            const data = await res.json();
            setResponse(data.response || "No response from AI.");
        } catch (error) {
            console.error("Fetch error:", error);
            setResponse("Error connecting to backend.");
        }
    };

    return (
        <div style={{ padding: 20 }}>
            <h1>DeepSeek R1 Chat</h1>
            <textarea
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ask something..."
                rows={4}
                style={{ width: "100%" }}
            />
            <br />
            <label>
                <input
                    type="checkbox"
                    checked={useWebSearch}
                    onChange={() => setUseWebSearch(!useWebSearch)}
                /> Enable Web Search
            </label>
            <br />
            <button onClick={sendMessage}>Send</button>
            <h2>Response:</h2>
            <p>{response}</p>
        </div>
    );
}

export default App;
