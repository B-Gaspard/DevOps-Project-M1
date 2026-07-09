# Multi-Node Enterprise CI/CD Automation Platform

![Jenkins](https://img.shields.io/badge/Jenkins-CI%2FCD-orange)
![Docker](https://img.shields.io/badge/Docker-Containerization-blue)
![Vagrant](https://img.shields.io/badge/Vagrant-Infrastructure%20as%20Code-purple)
![Java](https://img.shields.io/badge/Java-21-red)
![Node.js](https://img.shields.io/badge/Node.js-Application-green)

---

# Table of Contents

* [Project Overview](#project-overview)
* [Project Objectives](#project-objectives)
* [Technology Stack](#technology-stack)
* [Infrastructure Architecture](#infrastructure-architecture)
* [Virtual Machine Specifications](#virtual-machine-specifications)
* [Software Installation Responsibilities](#software-installation-responsibilities)
* [Prerequisites](#prerequisites)
* [Infrastructure Deployment](#infrastructure-deployment)
* [Network Configuration](#network-configuration)

---

# Project Overview

This project implements a complete enterprise-style Continuous Integration and Continuous Deployment (CI/CD) automation platform using:

* Vagrant
* VirtualBox
* Jenkins
* Docker
* Node.js
* GitHub

The infrastructure is designed around a three-node architecture where each virtual machine has a dedicated responsibility:

1. **Jenkins Master Node**

   * Controls the CI/CD workflow
   * Executes pipeline orchestration
   * Manages credentials and deployment automation

2. **Docker Build Agent Node**

   * Provides dynamic Jenkins execution environments
   * Runs temporary Docker-based Jenkins agents
   * Performs application building and testing

3. **Production Node**

   * Runs only the final production Docker container
   * Does not contain development tooling
   * Receives validated deployment artifacts from Jenkins

The architecture follows enterprise DevOps principles by separating:

* CI workloads
* Build environments
* Production runtime environments

This ensures repeatable builds, isolated testing, and reliable deployments.

---

# Project Objectives

The main objectives of this project are:

## Infrastructure Automation

* Provision multiple Linux servers automatically using Vagrant
* Create a reproducible development and deployment environment
* Configure networking between isolated virtual machines

## Continuous Integration

* Automatically retrieve source code from GitHub
* Build applications inside temporary Docker agents
* Install dependencies automatically
* Execute automated unit testing

## Continuous Deployment

* Package tested applications into Docker images
* Transfer deployment artifacts securely
* Replace running production containers automatically
* Verify application availability after deployment

## Operational Automation

* Clean unused Docker resources
* Remove temporary build artifacts
* Send deployment status notifications through Discord

---

# Technology Stack

| Technology         | Role                           |
| ------------------ | ------------------------------ |
| Vagrant            | VM provisioning and automation |
| VirtualBox         | Virtual machine provider       |
| Ubuntu 20.04 Focal | Operating system               |
| Jenkins LTS        | CI/CD orchestration            |
| Java 21            | Jenkins runtime                |
| Docker Engine      | Container platform             |
| Docker Remote API  | Jenkins agent provisioning     |
| Node.js            | Application runtime            |
| Mocha              | Automated testing framework    |
| GitHub             | Source control                 |
| SSH Agent Plugin   | Secure deployment              |
| Discord Webhook    | Deployment notifications       |

---

# Infrastructure Architecture

```text
                              Developer
                                  |
                                  |
                                  v
                          GitHub Repository
                                  |
                                  |
                                  v

+------------------------------------------------+
|              Jenkins Master Node               |
|------------------------------------------------|
| IP Address: 192.168.56.10                      |
|                                                |
| Installed:                                    |
| - Ubuntu 20.04                                 |
| - Java 21                                      |
| - Jenkins LTS                                  |
| - Git                                          |
| - Jenkins Plugins                               |
|                                                |
| Responsibilities:                              |
| - Pipeline execution                           |
| - Credential management                        |
| - Docker agent orchestration                   |
+------------------------------------------------+

                    |
                    |
                    | Docker Remote API
                    | TCP Port 2375
                    |
                    v


+------------------------------------------------+
|               Docker Host Node                 |
|------------------------------------------------|
| IP Address: 192.168.56.11                      |
|                                                |
| Installed:                                    |
| - Ubuntu 20.04                                 |
| - Docker Engine                                |
| - Docker Buildx                                |
|                                                |
| Responsibilities:                              |
| - Creates temporary Jenkins agents             |
| - Runs application builds                      |
| - Executes npm install                         |
| - Executes Mocha tests                         |
| - Builds Docker images                         |
+------------------------------------------------+

                    |
                    |
                    | SSH Deployment
                    |
                    v


+------------------------------------------------+
|              Production Node                   |
|------------------------------------------------|
| IP Address: 192.168.56.12                      |
|                                                |
| Installed:                                    |
| - Ubuntu 20.04                                 |
| - Docker Engine                                |
|                                                |
| Responsibilities:                              |
| - Runs production container                    |
| - Hosts Node.js application                    |
| - Exposes port 3000                            |
+------------------------------------------------+

                    |
                    |
                    v

          http://192.168.56.12:3000
```

---

# Virtual Machine Specifications

## Jenkins Master VM

| Property         | Value          |
| ---------------- | -------------- |
| Hostname         | jenkins-master |
| IP Address       | 192.168.56.10  |
| Operating System | Ubuntu 20.04   |
| Runtime          | Java 21        |
| Main Service     | Jenkins        |

### Installed Components

* Jenkins LTS
* OpenJDK 21
* Git
* curl
* wget
* unzip
* OpenSSH Server

### Purpose

The Jenkins Master is responsible for:

* Pipeline execution
* Source control integration
* Build scheduling
* Credential handling
* Agent provisioning
* Deployment control

---

# Docker Host VM

| Property         | Value         |
| ---------------- | ------------- |
| Hostname         | docker-host   |
| IP Address       | 192.168.56.11 |
| Operating System | Ubuntu 20.04  |
| Main Service     | Docker Engine |

### Installed Components

* Docker CE
* Docker CLI
* Docker Buildx
* Docker Compose Plugin
* OpenSSH Server

### Docker API Configuration

Docker exposes a remote API:

```text
tcp://192.168.56.11:2375
```

This allows Jenkins to dynamically create temporary build agents.

Example agent:

```text
custom-jenkins-agent:latest
```

---

# Production VM

| Property         | Value           |
| ---------------- | --------------- |
| Hostname         | production-node |
| IP Address       | 192.168.56.12   |
| Operating System | Ubuntu 20.04    |
| Main Service     | Docker          |

### Installed Components

Only production runtime requirements are installed:

* Docker Engine
* Docker CLI
* OpenSSH Server

---

## Production Environment Restrictions

The production VM intentionally does NOT contain:

* Node.js
* npm
* Mocha
* Git
* Jenkins
* Build tools

The production server never compiles or tests code.

All development operations happen inside Jenkins-controlled Docker agents.

This ensures:

* Smaller attack surface
* Cleaner production environment
* Reproducible deployments
* Separation between CI and runtime

---

# Prerequisites

Before deploying the cluster, install the following software on the host machine.

## Required Software

### VirtualBox

Required for running virtual machines.

Verify installation:

```bash
vboxmanage --version
```

---

### Vagrant

Required for infrastructure provisioning.

Verify:

```bash
vagrant --version
```

---

### Git

Required for retrieving the repository.

Verify:

```bash
git --version
```

---

# Infrastructure Deployment

Clone the project:

```bash
git clone <repository-url>

cd <project-directory>
```

---

Start all virtual machines:

```bash
vagrant up
```

Vagrant will automatically:

* Create all three VMs
* Configure private networking
* Install required packages
* Configure services
* Prepare the CI/CD environment

---

Check VM status:

```bash
vagrant status
```

Expected output:

```text
jenkins-master     running
docker-host        running
production-node    running
```

---

# Network Configuration

All nodes communicate through the private Vagrant network.

| Node            | IP            |
| --------------- | ------------- |
| Jenkins Master  | 192.168.56.10 |
| Docker Host     | 192.168.56.11 |
| Production Node | 192.168.56.12 |

Required communication:

| Source  | Destination    | Port |
| ------- | -------------- | ---- |
| Jenkins | Docker Host    | 2375 |
| Jenkins | Production     | 22   |
| Browser | Production App | 3000 |

---


# Jenkins Master Node Installation and Configuration

## Jenkins Installation Overview

The Jenkins Master Node (`192.168.56.10`) acts as the central CI/CD controller.

The Jenkins installation process performs the following:

* Installs Java 21 runtime
* Adds the official Jenkins package repository
* Installs Jenkins LTS
* Enables Jenkins as a system service
* Starts the Jenkins web interface
* Installs required CI/CD plugins

Jenkins does not perform application builds directly.

Instead, Jenkins delegates workload execution to temporary Docker agents running on the Docker Host VM.

---

# Installing Java 21

Jenkins requires Java as its execution runtime.

Install OpenJDK 21:

```bash
sudo apt update

sudo apt install -y openjdk-21-jdk
```

Verify Java:

```bash
java -version
```

Expected output:

```text
openjdk version "21.x.x"
```

Configure Java environment:

```bash
sudo update-alternatives --config java
```

---

# Installing Jenkins LTS

## Import Jenkins Repository Key

```bash
curl -fsSL https://pkg.jenkins.io/debian-stable/jenkins.io-2023.key \
| sudo tee \
/usr/share/keyrings/jenkins-keyring.asc > /dev/null
```

---

## Add Jenkins Repository

```bash
echo deb [signed-by=/usr/share/keyrings/jenkins-keyring.asc] \
https://pkg.jenkins.io/debian-stable binary/ \
| sudo tee /etc/apt/sources.list.d/jenkins.list
```

---

## Install Jenkins

Update package information:

```bash
sudo apt update
```

Install Jenkins:

```bash
sudo apt install -y jenkins
```

---

# Jenkins Service Management

Enable Jenkins during system startup:

```bash
sudo systemctl enable jenkins
```

Start Jenkins:

```bash
sudo systemctl start jenkins
```

Check status:

```bash
sudo systemctl status jenkins
```

Expected:

```text
Active: active (running)
```

---

# Jenkins Initial Configuration

Access Jenkins from the host browser:

```
http://192.168.56.10:8080
```

Retrieve the administrator password:

```bash
sudo cat /var/lib/jenkins/secrets/initialAdminPassword
```

Paste the password into the Jenkins setup wizard.

---

# Jenkins Plugin Installation

During setup, select:

```
Install suggested plugins
```

After Jenkins starts, install the following additional plugins:

## Required Plugins

| Plugin                | Purpose                       |
| --------------------- | ----------------------------- |
| Git Plugin            | GitHub repository integration |
| Pipeline Plugin       | Jenkins Pipeline support      |
| Pipeline Stage View   | Pipeline visualization        |
| Docker Plugin         | Docker cloud integration      |
| Docker Pipeline       | Docker build commands         |
| SSH Agent Plugin      | SSH deployment                |
| Credentials Binding   | Secret management             |
| Blue Ocean (optional) | Pipeline UI                   |

Install plugins from:

```
Manage Jenkins
        |
        +-- Plugins
        |
        +-- Available Plugins
```

Restart Jenkins after installation.

---

# Docker Host Configuration

## Docker Host Responsibilities

The Docker Host VM (`192.168.56.11`) is responsible for:

* Running Jenkins build containers
* Creating temporary agents
* Building application images
* Running automated tests

No Jenkins service runs on this machine.

---

# Installing Docker Engine

Update packages:

```bash
sudo apt update
```

Install dependencies:

```bash
sudo apt install -y \
ca-certificates \
curl \
gnupg \
lsb-release
```

Add Docker repository key:

```bash
curl -fsSL https://download.docker.com/linux/ubuntu/gpg \
| sudo gpg --dearmor \
-o /usr/share/keyrings/docker.gpg
```

Add Docker repository:

```bash
echo \
"deb [arch=$(dpkg --print-architecture) \
signed-by=/usr/share/keyrings/docker.gpg] \
https://download.docker.com/linux/ubuntu \
$(lsb_release -cs) stable" \
| sudo tee /etc/apt/sources.list.d/docker.list
```

Install Docker:

```bash
sudo apt update

sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

---

# Enable Docker Service

Start Docker:

```bash
sudo systemctl start docker
```

Enable startup:

```bash
sudo systemctl enable docker
```

Verify:

```bash
docker version
```

---

# Docker Remote API Configuration

Jenkins communicates with Docker through the Docker API.

The API is exposed only inside the private Vagrant network.

Edit Docker service configuration:

```bash
sudo mkdir -p /etc/systemd/system/docker.service.d
```

Create configuration:

```bash
sudo nano /etc/systemd/system/docker.service.d/override.conf
```

Add:

```ini
[Service]

ExecStart=

ExecStart=/usr/bin/dockerd \
-H unix:///var/run/docker.sock \
-H tcp://0.0.0.0:2375
```

---

Reload system services:

```bash
sudo systemctl daemon-reload
```

Restart Docker:

```bash
sudo systemctl restart docker
```

---

Verify Docker API:

From Jenkins VM:

```bash
curl http://192.168.56.11:2375/version
```

Expected response:

```json
{
 "Version": "xx.xx.xx"
}
```

---

# Jenkins Docker Cloud Configuration

Jenkins connects to the Docker Host to dynamically create build agents.

Navigate:

```
Manage Jenkins
        |
        +-- Clouds
        |
        +-- New Cloud
        |
        +-- Docker
```

Configure:

## Docker Host URI

```
tcp://192.168.56.11:2375
```

---

## Agent Image

```
custom-jenkins-agent:latest
```

---

## Agent Configuration

Example:

| Setting         | Value                       |
| --------------- | --------------------------- |
| Image           | custom-jenkins-agent:latest |
| Remote FS Root  | /home/jenkins               |
| Labels          | docker-agent                |
| Connection Type | Attach Docker Container     |

---

# Jenkins Credentials Configuration

Credentials are stored securely inside Jenkins.

Navigate:

```
Manage Jenkins

Credentials

System

Global Credentials
```

---

# SSH Deployment Credential

Used for Production deployment.

Create:

```
Add Credentials
```

Type:

```
SSH Username with Private Key
```

Configuration:

| Field       | Value           |
| ----------- | --------------- |
| ID          | vm-ssh-key      |
| Username    | vagrant         |
| Private Key | SSH private key |

Purpose:

Allows Jenkins to connect securely to:

```
192.168.56.12
```

---

# Discord Webhook Credential

Used for build notifications.

Create:

```
Add Credentials
```

Type:

```
Secret Text
```

Configuration:

| Field  | Value               |
| ------ | ------------------- |
| ID     | discord-webhook-url |
| Secret | Discord webhook URL |

The pipeline accesses this credential securely without exposing it in logs.

---

# Production Node Configuration

## Production Philosophy

The production VM is intentionally minimal.

It only runs:

* Docker Engine
* Application containers

The production server does not contain:

* Source code
* Build tools
* Test frameworks
* Dependency managers

---

# Installing Docker on Production

Install Docker CE:

```bash
sudo apt update

sudo apt install -y docker.io
```

Enable Docker:

```bash
sudo systemctl enable docker

sudo systemctl start docker
```

Verify:

```bash
docker version
```

---

# SSH Configuration

Jenkins connects to Production using SSH.

Verify SSH service:

```bash
sudo systemctl status ssh
```

Allow Jenkins deployment key:

```bash
mkdir -p ~/.ssh

chmod 700 ~/.ssh
```

Add authorized key:

```bash
nano ~/.ssh/authorized_keys
```

Set permissions:

```bash
chmod 600 ~/.ssh/authorized_keys
```

---

# Jenkins Agent Image Preparation

The Docker Host requires a custom Jenkins agent image.

The image contains:

* Java runtime
* Jenkins agent binary
* Node.js
* npm
* Git
* Docker CLI

Example Dockerfile:

```dockerfile
FROM ubuntu:20.04

RUN apt update && \
    apt install -y \
    openjdk-21-jdk \
    nodejs \
    npm \
    git \
    curl

RUN useradd -m jenkins

USER jenkins
```

Build:

```bash
docker build \
-t custom-jenkins-agent:latest .
```

Verify:

```bash
docker images
```

Expected:

```
custom-jenkins-agent latest
```

---

# Environment Separation Summary

| Task                | Location               |
| ------------------- | ---------------------- |
| Git checkout        | Jenkins Docker Agent   |
| npm install         | Jenkins Docker Agent   |
| Mocha tests         | Jenkins Docker Agent   |
| Docker build        | Jenkins Docker Agent   |
| Image packaging     | Jenkins Docker Agent   |
| Deployment          | Production Docker Host |
| Application runtime | Production Container   |

This separation ensures production remains clean, stable, and focused only on running validated application containers.

---


