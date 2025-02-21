-- INIT FILE FOR POSTGRES DB --
CREATE TABLE IF NOT EXISTS chatbot_chatmessage (
    id SERIAL PRIMARY KEY,
    sender VARCHAR(10) NOT NULL,
    text TEXT NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- INSERT INTO chatbot_chatmessage (sender, text) 
-- VALUES ('bot', 'Welcome! Ask me anything.');
