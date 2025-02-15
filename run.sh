#!/bin/bash

# Build the Docker image
docker build -t brain-rot-tok .

# Run the Docker container in detached mode and expose necessary ports
docker run -it -d -p 8000:8000 -p 5173:5173 --name brain-rot-tok-container brain-rot-tok

# Wait for the container to initialize (adjust sleep time as needed)
echo "Waiting for the application to start..."
sleep 10

# Open the website in the default web browser (Linux/macOS/Windows)
if [[ "$OSTYPE" == "linux-gnu"* ]]; then
    xdg-open "http://localhost:5173/"
elif [[ "$OSTYPE" == "msys" || "$OSTYPE" == "cygwin" ]]; then
    start "http://localhost:5173/"
elif [[ "$OSTYPE" == "darwin"* ]]; then
    open "http://localhost:5173/"
else
    echo "Unsupported OS for opening the browser."
fi
