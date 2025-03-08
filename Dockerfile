# Build stage
FROM python:3.12-slim-bookworm AS server-build

# Set environment variables for non-interactive installs
ENV DEBIAN_FRONTEND=noninteractive

# Install build dependencies
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    curl \
    ffmpeg \
    espeak \
    python3-venv && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Create and activate the virtual environment
RUN python3 -m venv /app/.venv
RUN /app/.venv/bin/pip install --upgrade pip

# Copy and install server requirements
COPY brain-rot-tok-server/requirements.txt /app/brain-rot-tok-server/requirements.txt
RUN /app/.venv/bin/pip install -r /app/brain-rot-tok-server/requirements.txt

# Runtime stage for server
FROM python:3.12-slim-bookworm AS server

# Install runtime dependencies only
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    ffmpeg \
    espeak && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy virtual environment from build stage
COPY --from=server-build /app/.venv /app/.venv

# Copy server files
COPY brain-rot-tok-server /app/brain-rot-tok-server

# Set working directory
WORKDIR /app/brain-rot-tok-server

# Expose server port
EXPOSE 8000

# Build stage for client
FROM node:21-alpine AS client-build

# Set working directory
WORKDIR /app

# Copy client files and install dependencies
COPY brain-rot-tok-client /app/brain-rot-tok-client
RUN cd /app/brain-rot-tok-client && npm install

# Runtime stage for client
FROM node:21-alpine AS client

# Set working directory
WORKDIR /app

# Copy node_modules and client files from build stage
COPY --from=client-build /app/brain-rot-tok-client /app/brain-rot-tok-client

# Set working directory
WORKDIR /app/brain-rot-tok-client

# Expose client port
EXPOSE 5173
