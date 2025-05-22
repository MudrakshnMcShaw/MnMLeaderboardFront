#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

echo "Updating package database..."
sudo apt-get update -y

echo "Installing prerequisite packages..."
sudo apt-get install -y \
    apt-transport-https \
    ca-certificates \
    curl \
    software-properties-common \
    gnupg2 \
    lsb-release

echo "Adding Docker’s official GPG key..."
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

echo "Adding Docker’s official repository..."
echo "deb [arch=amd64 signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

echo "Updating package database again..."
sudo apt-get update -y

echo "Installing Docker Engine..."
sudo apt-get install -y docker-ce docker-ce-cli containerd.io

echo "Starting Docker service..."
sudo systemctl start docker
sudo systemctl enable docker

echo "Verifying Docker installation..."
sudo docker --version

echo "Adding user to Docker group (optional)..."
sudo usermod -aG docker $USER

echo "Installation complete. Please log out and log back in to apply group changes."
