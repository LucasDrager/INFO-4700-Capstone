import React, { useState, useEffect, useRef } from "react";

function App() {
    const [query, setQuery] = useState("");  // User input
    const [messages, setMessages] = useState([]);  // Chat history
    const [useWebSearch, setUseWebSearch] = useState(false);
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const API_URL = "http://localhost:8000/api/chat/";

    const sendMessage = async () => {
        if (!query.trim()) return;

        setLoading(true);

        // Add user message to chat
        const userMessage = { sender: "user", text: query };
        setMessages(prevMessages => [...prevMessages, userMessage]);

        setQuery(""); // Clear input box

        try {
            const res = await fetch(API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ query, use_web_search: useWebSearch })
            });

            if (!res.ok) {
                throw new Error(`HTTP error! Status: ${res.status}`);
            }

            const data = await res.json();
            
            // Append bot response
            const botMessage = { sender: "bot", text: data.response };
            setMessages(prevMessages => [...prevMessages, botMessage]);

        } catch (error) {
            console.error("Fetch error:", error);
            setMessages(prevMessages => [...prevMessages, { sender: "bot", text: "Error connecting to backend." }]);
        } finally {
            setLoading(false);
        }
    };

    // Auto-scroll chat to latest message
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Retrieve chat history on load
    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const res = await fetch("http://localhost:8000/api/chat-history/");
                const data = await res.json();
                setMessages(data.messages);
            } catch (error) {
                console.error("Error loading chat history:", error);
            }
        };

        fetchHistory();
    }, []);

    return (
        <div style={{ padding: 20, maxWidth: 600, margin: "auto", fontFamily: "Arial" }}>
            <h1>DeepSeek R1 Chat</h1>
            <div
                style={{
                    border: "1px solid #ccc",
                    padding: 10,
                    maxHeight: "400px",
                    overflowY: "auto",
                    backgroundColor: "#f9f9f9",
                    borderRadius: "5px",
                    marginBottom: "10px"
                }}
            >
                {messages.map((msg, index) => (
                    <div key={index} style={{ 
                        display: "flex", 
                        justifyContent: msg.sender === "user" ? "flex-end" : "flex-start",
                        marginBottom: "10px"
                    }}>
                        <div style={{
                            padding: "10px",
                            borderRadius: "15px",
                            maxWidth: "80%",
                            whiteSpace: "pre-wrap", // Preserve spacing & newlines
                            backgroundColor: msg.sender === "user" ? "#0084ff" : "#f1f0f0",
                            color: msg.sender === "user" ? "white" : "black"
                        }}>
                            <strong>{msg.sender === "user" ? "You: " : "DeepSeek: "}</strong> <br />
                            {msg.text}
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            <textarea
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ask something..."
                rows={4}
                style={{ width: "100%" }}
            />
            <button onClick={sendMessage} disabled={loading} style={{ marginTop: 10 }}>
                {loading ? "Generating..." : "Send"}
            </button>
        </div>
    );
}

export default App;
