-- INIT FILE FOR POSTGRES DB --
CREATE TABLE IF NOT EXISTS chatbot_chatmessage (
    id SERIAL PRIMARY KEY,
    sender VARCHAR(10) NOT NULL,
    text TEXT NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS reader_database (
    username VARCHAR(50) UNIQUE NOT NULL,
    user_id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS reader_profiles (
    profile_id SERIAL PRIMARY KEY,
    user_id INT UNIQUE NOT NULL,
    full_name VARCHAR(255),
    bio TEXT,
    stats JSONB,
    FOREIGN KEY (user_id) REFERENCES reader_database(user_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS files (
    file_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_path TEXT NOT NULL,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES reader_database(user_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS annotations (
    annotation_id SERIAL PRIMARY KEY,
    file_id INT NOT NULL,
    user_id INT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (file_id) REFERENCES files(file_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES reader_database(user_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS chats (
    chat_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES reader_database(user_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS messages (
    message_id SERIAL PRIMARY KEY,
    chat_id INT NOT NULL,
    sender ENUM('user', 'AI') NOT NULL,
    content TEXT NOT NULL,
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (chat_id) REFERENCES chats(chat_id) ON DELETE CASCADE
);

-- INSERT INTO chatbot_chatmessage (sender, text) 
-- VALUES ('bot', 'Welcome! Ask me anything.');
