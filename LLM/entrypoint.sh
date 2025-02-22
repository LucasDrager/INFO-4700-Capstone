#!/bin/sh

# Start Ollama in the background
ollama serve &

# Wait for Ollama to be available
echo "Waiting for Ollama to be ready..."
until ollama list > /dev/null 2>&1; do
    sleep 2
done

echo "Ollama is running."

# Check if the model is already installed
if ! ollama list | grep -q "deepseek-r1:14b"; then
    echo "Pulling DeepSeek model..."
    ollama pull deepseek-r1:14b
else
    echo "DeepSeek model already installed. Skipping pull."
fi

# Bring Ollama to the foreground
wait %1
