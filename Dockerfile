# Use the official Python image
FROM python:3.12-bullseye

# Set environment variables for non-interactive installs
ENV DEBIAN_FRONTEND=noninteractive

# Update system and install essential dependencies
RUN apt-get update && \
    apt-get install -y python3 python3-pip python3-venv ffmpeg espeak curl && \
    apt-get clean

# Install Node.js from NodeSource
RUN curl -fsSL https://deb.nodesource.com/setup_21.x | bash - && \
    apt-get install -y nodejs && \
    apt-get clean

# Verify installation
RUN node -v && npm -v

# Set working directory
WORKDIR /app

# Create and activate the virtual environment
RUN python3 -m venv /app/.venv

# Upgrade pip in the virtual environment
RUN /app/.venv/bin/pip install --upgrade pip

# Copy the server requirements and install dependencies
COPY brain-rot-tok-server/requirements.txt /app/brain-rot-tok-server/requirements.txt
RUN /app/.venv/bin/pip install -r /app/brain-rot-tok-server/requirements.txt

# Copy server files
COPY brain-rot-tok-server /app/brain-rot-tok-server

# Install client dependencies
COPY brain-rot-tok-client /app/brain-rot-tok-client
RUN cd /app/brain-rot-tok-client && npm install

# Set working directory
WORKDIR /app/brain-rot-tok-server

# Expose server and client ports
EXPOSE 8000
EXPOSE 5173

# Command to run the server and client together
CMD ["/bin/bash", "-c", "/app/.venv/bin/python /app/brain-rot-tok-server/server.py & cd /app/brain-rot-tok-client && npm run dev -- --host 0.0.0.0 --port 5173"]
