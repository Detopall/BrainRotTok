#!/bin/bash

COMPOSE_FILE="docker-compose.yaml"

function show_help() {
    echo "Usage: $0 [OPTION]"
    echo "Manage the Docker Compose services for brain-rot-tok."
    echo
    echo "Options:"
    echo "  --help                Show this help message and exit."
    echo "  --stop                Stop the running containers."
    echo "  --remove-container    Stop and remove all containers."
    echo "  --remove-all          Stop and remove all containers, then remove images."
    echo "  --logs                View logs of running services."
    echo "  (no option)           Start the services (builds if necessary)."
}

function start_services() {
  echo "Starting services..."

  # Check if the containers are running
  if [[ -z "$(docker ps -q -f name=brainrottok-server)" || -z "$(docker ps -q -f name=brainrottok-client)" ]]; then
    echo "Containers not running. Checking for images..."

    # Check if images exist
    if [[ -z "$(docker images -q brainrottok-server:latest)" || -z "$(docker images -q brainrottok-client:latest)" ]]; then
      echo "Images not found. Building..."
      docker compose -f $COMPOSE_FILE up -d --build
    else
      echo "Images exist. Starting containers..."
      docker compose -f $COMPOSE_FILE up -d
    fi
  else
    echo "Containers are already running."
  fi

  sleep 5
  open_browser
}

function stop_services() {
    echo "Stopping services..."
    docker compose -f $COMPOSE_FILE stop
}

function remove_containers() {
    echo "Removing containers..."
    docker compose -f $COMPOSE_FILE down
}

function remove_all() {
    echo "Removing all containers and images..."
    docker compose -f $COMPOSE_FILE down --rmi all
}

function view_logs() {
    echo "Displaying logs..."
    docker compose -f $COMPOSE_FILE logs -f
}

function open_browser() {
    echo "Opening application in browser..."
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        xdg-open "http://localhost:5173/"
    elif [[ "$OSTYPE" == "msys" || "$OSTYPE" == "cygwin" ]]; then
        start "http://localhost:5173/"
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        open "http://localhost:5173/"
    else
        echo "Unsupported OS for opening the browser."
    fi
}

case "$1" in
    --help)
        show_help
        ;;
    --stop)
        stop_services
        ;;
    --remove-container)
        remove_containers
        ;;
    --remove-all)
        remove_all
        ;;
    --logs)
        view_logs
        ;;
    *)
        start_services
        ;;
esac
