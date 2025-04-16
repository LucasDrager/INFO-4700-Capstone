import React from "react";

const AboutPage = () => {
  return (
    <div className="row justify-content-center">
      <div className="row justify-content-center">
      <div className="col-12 col-md-11 col-lg-10">
      <div className="text-center mb-5">
            <h1 className="display-4 fw-bold">Lectern</h1>
            <h2 className="mb-4">Information Science Capstone</h2>
            <p className="lead">
              A combined Django (Python) back end and React front end, orchestrated via Docker.
            </p>
            <p>
              This document provides a basic overview for individuals to set up and run the project locally.
              No advanced coding knowledge is required—just however it will help.
            </p>
          </div>

          <div className="alert alert-info mb-4">
            <strong>Note:</strong> By default, we recommend using Docker so you do not have to install Python or Node.js directly on your machine. 
            However, if you prefer local development without Docker (or want to run certain commands outside containers), 
            we've included optional instructions on installing Node.js / npm and Django.
          </div>

          <div className="card mb-4">
            <div className="card-header bg-primary text-white">
              <h3 className="mb-0">1. Project Overview</h3>
            </div>
            <div className="card-body">
              <ul className="list-group list-group-flush">
                <li className="list-group-item">Django provides the back-end functionality, database logic, and REST API.</li>
                <li className="list-group-item">React handles the front-end user interface.</li>
                <li className="list-group-item">PostgreSQL (example database) is used here, but you can switch to another DB if needed.</li>
                <li className="list-group-item">Docker allows you to run the entire stack—Django, React, and Postgres—in separate containers without installing Python or Node locally.</li>
              </ul>
            </div>
          </div>

          <div className="card mb-4">
            <div className="card-header bg-primary text-white">
              <h3 className="mb-0">2. Dependencies & Requirements</h3>
            </div>
            <div className="card-body">
              <p>Below are the required and optional tools you may need depending on your workflow.</p>
              
              <h4 className="mt-3">2.1 Installing Docker</h4>
              <h5>Docker</h5>
              <ul>
                <li>Windows/Mac: Install Docker Desktop from the Docker website. Ensure it's running.</li>
                <li>Linux: Install Docker Engine using the official docs.</li>
              </ul>
              
              <h5>Docker Compose</h5>
              <ul>
                <li>Usually included with Docker Desktop on Windows/Mac.</li>
                <li>On Linux, you may need to install docker-compose separately via your package manager or Compose install docs.</li>
              </ul>
              <p>With Docker installed, you can run <code>docker -v</code> and <code>docker-compose -v</code> (or <code>docker compose version</code> for newer versions) to verify.</p>
              
              <h4 className="mt-3">2.2 Optional Local Installs (Node.js / npm / Django)</h4>
              <p>You only need these if you plan to develop or run commands outside of Docker. If you will rely entirely on Docker, skip this section.</p>
              
              <h5>Node.js & npm (We're using NPM for backend)</h5>
              <ul>
                <li>Download the latest LTS (Long-Term Support) version from <a href="https://nodejs.org" target="_blank" rel="noopener noreferrer">https://nodejs.org</a>.</li>
                <li>Run the installer (Windows/Mac). On Linux, use your distro's package manager.</li>
              </ul>
              
              <div className="bg-light p-3 mb-3 border rounded">
                <pre className="mb-0"><code># Example for Ubuntu/Debian
sudo apt update
sudo apt install -y nodejs npm</code></pre>
              </div>
              
              <p>Verify installation:</p>
              <div className="bg-light p-3 mb-3 border rounded">
                <pre className="mb-0"><code>node -v
npm -v</code></pre>
              </div>
              
              <h5>Python & Django</h5>
              <ul>
                <li>Check if Python is installed:</li>
              </ul>
              
              <div className="bg-light p-3 mb-3 border rounded">
                <pre className="mb-0"><code>python3 --version
# or on Windows:
python --version</code></pre>
              </div>
              
              <ul>
                <li>If not, download Python 3.9+ from <a href="https://www.python.org/downloads/" target="_blank" rel="noopener noreferrer">https://www.python.org/downloads/</a>.</li>
                <li>Once Python is installed, install Django (and possibly a virtual environment tool, e.g. venv):</li>
              </ul>
              
              <div className="bg-light p-3 mb-3 border rounded">
                <pre className="mb-0"><code>python -m pip install --upgrade pip
pip install Django</code></pre>
              </div>
              
              <p>Verify Django:</p>
              <div className="bg-light p-3 mb-3 border rounded">
                <pre className="mb-0"><code>python -m django --version</code></pre>
              </div>
              
              <div className="alert alert-secondary">
                <strong>Note:</strong> If you want a local environment for Django outside Docker, you'll also need a database or run one in Docker.
              </div>
              
              <p>With these installed locally, you can run React's dev server or Django commands without Docker. However, the recommended approach for this project is to use Docker for consistency.</p>
            </div>
          </div>

          <div className="card mb-4">
            <div className="card-header bg-primary text-white">
              <h3 className="mb-0">3. Directory Structure</h3>
            </div>
            <div className="card-body">
              <div className="bg-light p-3 border rounded">
                <pre className="mb-0"><code>INFO-4700-Capstone/
├─ docker-compose.yml # Defines Docker services (backend, db, frontend)
├─ backend/
│ ├─ Dockerfile # Builds the Django container
│ ├─ requirements.txt # Python dependencies
│ ├─ manage.py # Django's main management script
│ └─ Application/ # Django code (settings, urls, etc.)
├─ Dockerfile # Builds the React container
├─ package.json # React project dependencies
├─ public/ # Static/public files
└─ src/ # React components & logic</code></pre>
              </div>
              
              <h5 className="mt-4">Key Points:</h5>
              <ul>
                <li><strong>backend/</strong>: Contains our Django project and a Dockerfile that installs Python dependencies.</li>
                <li><strong>frontend/</strong>: Contains our React app and a Dockerfile that handles Node.js dependencies.</li>
                <li><strong>docker-compose.yml</strong>: Orchestrates the build/run process for all containers: Django, React, and the database.</li>
              </ul>
            </div>
          </div>

          <div className="card mb-4">
            <div className="card-header bg-primary text-white">
              <h3 className="mb-0">4. Getting Started (Quick Setup with Docker)</h3>
            </div>
            <div className="card-body">
              <h5>Clone the Repository</h5>
              <div className="bg-light p-3 mb-3 border rounded">
                <pre className="mb-0"><code>git clone https://github.com/LucasDrager/INFO-4700-Capstone.git
cd your-project</code></pre>
              </div>
              
              <h5>Start Docker</h5>
              <p>On Windows/Mac, launch Docker Desktop. On Linux, ensure Docker Engine is running.</p>
              
              <h5>Build and Launch</h5>
              <p>From the project folder (where docker-compose.yml is located), run:</p>
              <div className="bg-light p-3 mb-3 border rounded">
                <pre className="mb-0"><code>docker-compose up --build</code></pre>
              </div>
              
              <p>Docker will:</p>
              <ul>
                <li>Pull or build the necessary images (Python, Node, Postgres).</li>
                <li>Install dependencies from requirements.txt and package.json.</li>
                <li>Spin up containers for the database, Django back end, and React front end.</li>
              </ul>
              
              <h5>Access the Application</h5>
              <ul>
                <li>Django: <a href="http://localhost:8000" target="_blank" rel="noopener noreferrer">http://localhost:8000</a></li>
                <li>React: <a href="http://localhost:3000" target="_blank" rel="noopener noreferrer">http://localhost:3000</a></li>
              </ul>
              
              <p className="alert alert-success">That's it! You now have a local instance running via Docker.</p>
            </div>
          </div>

          <div className="card mb-4">
            <div className="card-header bg-primary text-white">
              <h3 className="mb-0">5. Common Docker Commands</h3>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6 mb-3">
                  <div className="card h-100">
                    <div className="card-header">Start (Foreground)</div>
                    <div className="card-body">
                      <code>docker-compose up</code>
                      <p className="mb-0 mt-2">Runs containers in your terminal. Press CTRL + C to stop.</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-6 mb-3">
                  <div className="card h-100">
                    <div className="card-header">Start (Background)</div>
                    <div className="card-body">
                      <code>docker-compose up -d</code>
                      <p className="mb-0 mt-2">Runs containers in "detached" mode (in the background). You can check logs with <code>docker-compose logs -f</code>.</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-6 mb-3">
                  <div className="card h-100">
                    <div className="card-header">Stop the Containers</div>
                    <div className="card-body">
                      <code>docker-compose down</code>
                      <p className="mb-0 mt-2">Shuts down and removes containers (but not named volumes).</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-6 mb-3">
                  <div className="card h-100">
                    <div className="card-header">Rebuild Containers</div>
                    <div className="card-body">
                      <code>docker-compose up --build</code>
                      <p className="mb-0 mt-2">Rebuilds the images if dependencies changed.</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-6 mb-3">
                  <div className="card h-100">
                    <div className="card-header">List Running Containers</div>
                    <div className="card-body">
                      <code>docker ps</code>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="card mb-4">
            <div className="card-header bg-primary text-white">
              <h3 className="mb-0">6. Troubleshooting</h3>
            </div>
            <div className="card-body">
              <div className="accordion" id="troubleshootingAccordion">
                <div className="accordion-item">
                  <h2 className="accordion-header" id="headingOne">
                    <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                      Docker Not Running
                    </button>
                  </h2>
                  <div id="collapseOne" className="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#troubleshootingAccordion">
                    <div className="accordion-body">
                      Ensure Docker Desktop or Docker Engine is active. Otherwise, you may see "Cannot connect to Docker daemon."
                    </div>
                  </div>
                </div>
                <div className="accordion-item">
                  <h2 className="accordion-header" id="headingTwo">
                    <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                      Port Conflicts
                    </button>
                  </h2>
                  <div id="collapseTwo" className="accordion-collapse collapse" aria-labelledby="headingTwo" data-bs-parent="#troubleshootingAccordion">
                    <div className="accordion-body">
                      If something else uses port 8000 or 3000, adjust the ports in docker-compose.yml.
                    </div>
                  </div>
                </div>
                <div className="accordion-item">
                  <h2 className="accordion-header" id="headingThree">
                    <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
                      Slow Builds
                    </button>
                  </h2>
                  <div id="collapseThree" className="accordion-collapse collapse" aria-labelledby="headingThree" data-bs-parent="#troubleshootingAccordion">
                    <div className="accordion-body">
                      The first build may take a while to pull base images. Subsequent builds should be faster.
                    </div>
                  </div>
                </div>
                <div className="accordion-item">
                  <h2 className="accordion-header" id="headingFour">
                    <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseFour" aria-expanded="false" aria-controls="collapseFour">
                      File Permissions (Linux)
                    </button>
                  </h2>
                  <div id="collapseFour" className="accordion-collapse collapse" aria-labelledby="headingFour" data-bs-parent="#troubleshootingAccordion">
                    <div className="accordion-body">
                      If you get permission errors, try <code>sudo docker-compose up</code> or add your user to the docker group.
                    </div>
                  </div>
                </div>
                <div className="accordion-item">
                  <h2 className="accordion-header" id="headingFive">
                    <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseFive" aria-expanded="false" aria-controls="collapseFive">
                      Dependencies
                    </button>
                  </h2>
                  <div id="collapseFive" className="accordion-collapse collapse" aria-labelledby="headingFive" data-bs-parent="#troubleshootingAccordion">
                    <div className="accordion-body">
                      If you manually edit requirements.txt or package.json, rerun:
                      <div className="bg-light p-2 mt-2 border rounded">
                        <code>docker-compose up --build</code>
                      </div>
                      to ensure the containers have updated dependencies.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header bg-primary text-white">
              <h3 className="mb-0">7. Further Reading</h3>
            </div>
            <div className="card-body">
              <ul className="list-group">
                <li className="list-group-item d-flex justify-content-between align-items-center">
                  Docker
                  <a href="https://docs.docker.com/" target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-outline-primary">Visit Docs</a>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center">
                  Django
                  <a href="https://docs.djangoproject.com/" target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-outline-primary">Visit Docs</a>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center">
                  React
                  <a href="https://reactjs.org/docs/getting-started.html" target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-outline-primary">Visit Docs</a>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center">
                  Node.js
                  <a href="https://nodejs.org/en/docs/" target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-outline-primary">Visit Docs</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;