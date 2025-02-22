# Use the official Ollama image
FROM ollama/ollama:latest

# Set the working directory
WORKDIR /root

# Copy entrypoint script
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Use the entrypoint script
ENTRYPOINT ["/entrypoint.sh"]
