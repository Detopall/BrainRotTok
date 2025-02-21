#!/bin/bash

IMAGE_NAME="brain-rot-tok"
CONTAINER_NAME="brain-rot-tok-container"
PORTS="-p 8000:8000 -p 5173:5173"

function build_image() {
    if ! docker image inspect $IMAGE_NAME > /dev/null 2>&1; then
        echo "Building Docker image..."
        docker build -t $IMAGE_NAME .
    else
        echo "Docker image already exists. Skipping build."
    fi
}

function remove_existing_container() {
    if docker ps -a --filter "name=$CONTAINER_NAME" --format '{{.Names}}' | grep -q $CONTAINER_NAME; then
        echo "Removing existing container..."
        docker stop $CONTAINER_NAME > /dev/null 2>&1
        docker rm $CONTAINER_NAME
    fi
}

function run_container() {
    remove_existing_container
    echo "Running container..."
    docker run -it -d $PORTS --name $CONTAINER_NAME $IMAGE_NAME
    sleep 5
    open_browser
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

function stop_container() {
    if docker ps --filter "name=$CONTAINER_NAME" --format '{{.Names}}' | grep -q $CONTAINER_NAME; then
        echo "Stopping container..."
        docker stop $CONTAINER_NAME
    else
        echo "Container is not running."
    fi
}

function remove_container() {
    stop_container
    if docker ps -a --filter "name=$CONTAINER_NAME" --format '{{.Names}}' | grep -q $CONTAINER_NAME; then
        echo "Removing container..."
        docker rm $CONTAINER_NAME
    else
        echo "Container does not exist."
    fi
}

function remove_all() {
    remove_container
    if docker image inspect $IMAGE_NAME > /dev/null 2>&1; then
        echo "Removing Docker image..."
        docker rmi $IMAGE_NAME
    else
        echo "Image does not exist."
    fi
}

case "$1" in
    --stop)
        stop_container
        ;;
    --remove-container)
        remove_container
        ;;
    --remove-all)
        remove_all
        ;;
    *)
        build_image
        run_container
        ;;
esac
