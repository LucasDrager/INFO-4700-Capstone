# Lectern
## Information Science Capstone

A combined **Django (Python)** back end and **React** front end, orchestrated via **Docker**.

This document provides a basic overview for individuals to set up and run the project locally. No advanced coding knowledge is required—however it will help.

**Note**: By default, we recommend using Docker so you **do not** have to install Python or Node.js directly on your machine. However, if you prefer local development without Docker (or want to run certain commands outside containers), You will need to install **Node.js / npm** and **Django**.

---

## 1. Project Overview

- **Django** provides the back-end functionality, database logic, and REST API.  
- **React** handles the front-end user interface.  
- **PostgreSQL** hosts project Database
- **Docker** allows you to run the entire stack—Django, React, and Postgres—in separate containers without installing Python or Node locally.
- **OpenWebUI** manages LLM intergration into the website.

---

## 2. Dependencies & Requirements

Below are the **required** tools you may need depending on your workflow.

### 2.1 Installing Docker

1. **Docker**  
   - **Windows/Mac**: Install **Docker Desktop** from the [Docker website](https://www.docker.com/products/docker-desktop). Ensure it’s running.  
   - **Linux**: Install **Docker Engine** using the [official docs](https://docs.docker.com/get-docker/).  

2. **Docker Compose**  
   - Usually included with Docker Desktop on Windows/Mac.  
   - On Linux, you may need to install `docker-compose` separately via your package manager or [Compose install docs](https://docs.docker.com/compose/install/).

With Docker installed, you can run `docker -v` and `docker-compose -v` (or `docker compose version` for newer versions) to verify a completed install.

### 2.2 GNU Make

**You need this to develop or run commands to build the project.**  
This project uses Docker as its foundation but requires make tools to support docker.

1. **What is Make?**  
   `make` is a build automation tool used to run tasks defined in a `Makefile`. It's commonly used in Unix-like environments and is essential for running certain local scripts or development workflows.

2. **Install `make` on Various Systems**

   - **Ubuntu / Debian (Linux)**  
     ```bash
     sudo apt update
     sudo apt install -y build-essential
     ```
     `build-essential` includes `make`, `gcc`, and other tools needed for compilation and development.

   - **Fedora / RHEL / CentOS**  
     ```bash
     sudo dnf install -y make
     # or for older systems using yum
     sudo yum install -y make
     ```

   - **Arch Linux / Manjaro**  
     ```bash
     sudo pacman -S make
     ```

   - **macOS**  
     - Install Xcode Command Line Tools:
       ```bash
       xcode-select --install
       ```
     - This includes `make` and other essential build tools.

   - **Windows**  
     - Option 1: Install via [Gow](https://github.com/bmatzelle/gow) or [GnuWin](http://gnuwin32.sourceforge.net/packages/make.htm)  
     - Option 2 (Recommended): Install **Make for Windows** through [Chocolatey](https://chocolatey.org/):
       ```powershell
       choco install make
       ```
     - Option 3: Install **Git for Windows**, which includes `make` if installed with Unix tools option.

3. **Verify Installation**  
   ```bash
   make --version
### 2.3 Required Environment Variables (.env File)

**You must create a `.env` file in the project’s parent directory.**  
This file contains essential environment variables used by Docker, Django, PostgreSQL, React, and other services. Without this file, the project will fail to initialize correctly in both local and containerized environments.

1. **Creating the `.env` File**  
   - Create a file named `.env` at the **root of the project’s parent directory** (same level as your Docker Compose or project root).
   - Copy and paste the following contents into the `.env` file:

     ```dotenv
     # Database Environment Variables
     POSTGRES_DB=UserDataBase
     POSTGRES_USER=SysAdminAccount
     POSTGRES_PASSWORD=Temp
     POSTGRES_HOST=db

     # Django Environment Variables
     SECRET_KEY='django-insecure-0-&b93las!#p=32rh7d_p7d+o24f8*^-5%s66!b&5bcs%)&g_-'
     DEBUG=False
     DATABASE_URL=postgres://postgres:postgres@db:5432/mydatabase
     ALLOWED_HOSTS=*
     OLLAMA_APP_API_URL=http://ollama:11434 

     # React Environment Variables
     REACT_APP_API_URL=http://localhost:8000
     REACT_APP_API_BASE=http://localhost:8000/api/

     # Ollama/Open WebUI Environment Variables
     WEBUI_AUTH=false
     WEBUI_ADMIN_EMAIL=admin@example.com
     WEBUI_ADMIN_PASSWORD=SuperSecurePassword
     OLLAMA_BASE_URL=http://localhost:11434
2. **Important Notes**
   - **Do not commit this file to version control.** Add `.env` to your `.gitignore` file to avoid exposing sensitive credentials.
   - Customize the values (especially passwords and secret keys) for your environment if needed.
   - These variables are consumed by Docker Compose, Django settings, and frontend configuration.

Having this `.env` file in place ensures that all services can access the required configuration and run properly during development or deployment.


---
## 3. Getting Started (Quick Setup with Docker + Make)

This project uses `make` to simplify Docker operations. All key Docker Compose commands are wrapped in easy-to-remember `make` targets, compatible with Windows, macOS, and Linux.

### 1. **Clone the Repository**
```bash
git clone https://github.com/LucasDrager/INFO-4700-Capstone.git
cd INFO-4700-Capstone
```

### 2. **Ensure Prerequisites are Installed**
- You must have [Docker](https://docs.docker.com/get-docker/) and [`make`](#22-optional-local-installs-gnu-make) installed on your system.
- Ensure your `.env` file is present in the project’s parent directory. See [Section 2.3](#23-required-environment-variables-env-file).

### 3. **Start Docker**
- On **Windows/macOS**: Launch **Docker Desktop**.  
- On **Linux**: Make sure Docker Engine is running (e.g. `sudo systemctl start docker`).

### 4. **Build and Launch with Make**
From the project root (where the `Makefile` and `docker-compose.yml` are located), run:
```bash
make start
```

This will:
1. Detect your GPU and load the appropriate Docker Compose overlay (if available).
2. Build all necessary Docker images (Django, Node/React, PostgreSQL).
3. Start all containers in detached mode.
4. Run Django migrations automatically.

---

### Additional Commands

- **Stop the project (but keep volumes/data)**  
  ```bash
  make stop
  ```

- **Rebuild containers and re-run migrations**  
  ```bash
  make restart
  ```

- **Tear down containers and remove volumes (fresh start)**  
  ```bash
  make teardown
  ```

- **Manually run Django migrations**  
  ```bash
  make migrations
  ```

- **Wipe Django migration files inside the container, rebuild, and re-apply migrations**  
  ```bash
  make clean-migrations
  ```

These `make` commands ensure a consistent developer experience across platforms, simplifying the Docker workflow into clear, reproducible tasks.


4. **Access the Application**  
   - **Django**: [http://localhost:8000](http://localhost:8000)  
   - **React**: [http://localhost:3000](http://localhost:3000)

That’s it! You now have a local instance running via Docker.

---

## 4. Troubleshooting

1. **Docker Not Running**  
   - Ensure Docker Desktop or Docker Engine is active. Otherwise, you may see “Cannot connect to Docker daemon.”

2. **Port Conflicts**  
   - If something else uses port 8000 or 3000, adjust the ports in `docker-compose.yml`.

3. **Slow Builds**  
   - The first build may take a while to pull base images. Subsequent builds should be faster.

4. **File Permissions (Linux)**  
   - If you get permission errors, try `sudo docker-compose up` or add your user to the `docker` group.
---

## 5. Further Reading

- **Docker**: [https://docs.docker.com/](https://docs.docker.com/)  
- **Django**: [https://docs.djangoproject.com/](https://docs.djangoproject.com/)  
- **React**: [https://reactjs.org/docs/getting-started.html](https://reactjs.org/docs/getting-started.html)  
- **Node.js**: [https://nodejs.org/en/docs/](https://nodejs.org/en/docs/)
- **OpenWebUI**: [https://github.com/open-webui/open-webui](https://github.com/open-webui/open-webui)
---
