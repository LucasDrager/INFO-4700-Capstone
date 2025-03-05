-- INIT FILE FOR POSTGRES DB --
CREATE TABLE IF NOT EXISTS ReaderDatabase (
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
    FOREIGN KEY (user_id) REFERENCES ReaderDatabase(user_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS files (
    file_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_path TEXT NOT NULL,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES ReaderDatabase(user_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Annotations (
    annotation_id SERIAL PRIMARY KEY,
    file_id INT NOT NULL,
    user_id INT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (file_id) REFERENCES files(file_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES ReaderDatabase(user_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Chats (
    chat_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES ReaderDatabase(user_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Messages (
    message_id SERIAL PRIMARY KEY,
    chat_id INT NOT NULL,
    sender VARCHAR(50) NOT NULL,
    content TEXT NOT NULL,
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (chat_id) REFERENCES chats(chat_id) ON DELETE CASCADE
);

-- INSERT INTO chatbot_chatmessage (sender, text) 
-- VALUES ('bot', 'Welcome! Ask me anything.');
