# Lectern
## Information Science Capstone

A combined **Django (Python)** back end and **React** front end, orchestrated via **Docker**.

This document provides a basic overview for individuals to set up and run the project locally. No advanced coding knowledge is required—just however it will help.

**Note**: By default, we recommend using Docker so you **do not** have to install Python or Node.js directly on your machine. However, if you prefer local development without Docker (or want to run certain commands outside containers), we’ve included optional instructions on installing **Node.js / npm** and **Django**.

---

## 1. Project Overview

- **Django** provides the back-end functionality, database logic, and REST API.  
- **React** handles the front-end user interface.  
- **PostgreSQL** (example database) is used here, but you can switch to another DB if needed.  
- **Docker** allows you to run the entire stack—Django, React, and Postgres—in separate containers without installing Python or Node locally.

---

## 2. Dependencies & Requirements

Below are the **required** and **optional** tools you may need depending on your workflow.

### 2.1 Installing Docker

1. **Docker**  
   - **Windows/Mac**: Install **Docker Desktop** from the [Docker website](https://www.docker.com/products/docker-desktop). Ensure it’s running.  
   - **Linux**: Install **Docker Engine** using the [official docs](https://docs.docker.com/get-docker/).  

2. **Docker Compose**  
   - Usually included with Docker Desktop on Windows/Mac.  
   - On Linux, you may need to install `docker-compose` separately via your package manager or [Compose install docs](https://docs.docker.com/compose/install/).

With Docker installed, you can run `docker -v` and `docker-compose -v` (or `docker compose version` for newer versions) to verify.

### 2.2 Optional Local Installs (Node.js / npm / Django)

**You only need these if you plan to develop or run commands outside of Docker.** If you will rely entirely on Docker, skip this section.

1. **Node.js & npm**  (We're using NPM for backend)
   - Download the latest LTS (Long-Term Support) version from [https://nodejs.org](https://nodejs.org).  
   - Run the installer (Windows/Mac). On Linux, use your distro’s package manager:  
     ```bash
     # Example for Ubuntu/Debian
     sudo apt update
     sudo apt install -y nodejs npm
     ```
   - Verify installation:  
     ```bash
     node -v
     npm -v
     ```

2. **Python & Django**  
   - Check if Python is installed:  
     ```bash
     python3 --version
     ```
     or on Windows:
     ```powershell
     python --version
     ```
   - If not, download Python 3.9+ from [https://www.python.org/downloads/](https://www.python.org/downloads/).  
   - Once Python is installed, install Django (and possibly a virtual environment tool, e.g. `venv`). Example:
     ```bash
     python -m pip install --upgrade pip
     pip install Django
     ```
   - Verify Django:  
     ```bash
     python -m django --version
     ```
   - *Note:* If you want a local environment for Django outside Docker, you’ll also need a database or run one in Docker.  

With these installed locally, you can run React’s dev server or Django commands without Docker. However, the recommended approach for this project is to use Docker for consistency.

---

## 3. Directory Structure
INFO-4700-Capstone/\
├─ docker-compose.yml # Defines Docker services (backend, db, frontend) \
├─ backend/ \
│ ├─ Dockerfile # Builds the Django container \
│ ├─ requirements.txt # Python dependencies \
│ ├─ manage.py # Django's main management script \
│ └─ Application/ # Django code (settings, urls, etc.) \
├─ Dockerfile # Builds the React container \
├─ package.json # React project dependencies \
├─ public/ # Static/public files \
└─ src/ # React components & logic \

**Key Points**:
- **backend/**: Contains our Django project and a `Dockerfile` that installs Python dependencies.  
- **frontend/**: Contains our React app and a `Dockerfile` that handles Node.js dependencies.  
- **docker-compose.yml**: Orchestrates the build/run process for all containers: Django, React, and the database.

## 4. Getting Started (Quick Setup with Docker)

1. **Clone the Repository**  
   ```bash
   git clone https://github.com/LucasDrager/INFO-4700-Capstone.git
   cd your-project
   ```

2. **Start Docker**  
   - On Windows/Mac, launch **Docker Desktop**. On Linux, ensure Docker Engine is running.

3. **Build and Launch**  
   - From the project folder (where `docker-compose.yml` is located), run:
     ```bash
     docker-compose up --build
     ```
   - Docker will:
     1. Pull or build the necessary images (Python, Node, Postgres).  
     2. Install dependencies from `requirements.txt` and `package.json`.  
     3. Spin up containers for the **database**, **Django** back end, and **React** front end.

4. **Access the Application**  
   - **Django**: [http://localhost:8000](http://localhost:8000)  
   - **React**: [http://localhost:3000](http://localhost:3000)

That’s it! You now have a local instance running via Docker.

---

## 5. Common Docker Commands

- **Start (Foreground)**  
  ```bash
  docker-compose up
  ```
  Runs containers in your terminal. Press `CTRL + C` to stop.

- **Start (Background)**  
  ```bash
  docker-compose up -d
  ```
  Runs containers in “detached” mode (in the background). You can check logs with `docker-compose logs -f`.

- **Stop the Containers**  
  ```bash
  docker-compose down
  ```
  Shuts down and removes containers (but **not** named volumes).

- **Rebuild Containers**  
  ```bash
  docker-compose up --build
  ```
  Rebuilds the images if dependencies changed.

- **List Running Containers**  
  ```bash
  docker ps
  ```

---

## 6. Troubleshooting

1. **Docker Not Running**  
   - Ensure Docker Desktop or Docker Engine is active. Otherwise, you may see “Cannot connect to Docker daemon.”

2. **Port Conflicts**  
   - If something else uses port 8000 or 3000, adjust the ports in `docker-compose.yml`.

3. **Slow Builds**  
   - The first build may take a while to pull base images. Subsequent builds should be faster.

4. **File Permissions (Linux)**  
   - If you get permission errors, try `sudo docker-compose up` or add your user to the `docker` group.

5. **Dependencies**  
   - If you manually edit `requirements.txt` or `package.json`, rerun:
     ```bash
     docker-compose up --build
     ```
     to ensure the containers have updated dependencies.

---

## 7. Further Reading

- **Docker**: [https://docs.docker.com/](https://docs.docker.com/)  
- **Django**: [https://docs.djangoproject.com/](https://docs.djangoproject.com/)  
- **React**: [https://reactjs.org/docs/getting-started.html](https://reactjs.org/docs/getting-started.html)  
- **Node.js**: [https://nodejs.org/en/docs/](https://nodejs.org/en/docs/)

---
