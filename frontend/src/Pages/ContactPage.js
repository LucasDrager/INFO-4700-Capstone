import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const contacts = [
  { name: "David", role: "[insert title]", email: "[Insert Email]", icon: "person-circle" },
  { name: "Jackson", role: "[insert title]", email: "[Insert Email]", icon: "laptop" },
  { name: "Kya", role: "[insert title]", email: "[Insert Email]", icon: "server" },
  { name: "Lucas", role: "[insert title]", email: "[Insert Email]", icon: "palette" },
  { name: "Micheal", role: "[insert title]", email: "[Insert Email]", icon: "cpu" },
  { name: "Rory", role: "[insert title]", email: "[Insert Email]", icon: "clipboard-data" }
];

const ContactPage = () => {
  return (
    <div className="bg-light min-vh-100 py-5">
      <h1 className="text-center mb-5 fw-bold">Meet the Lectern Team</h1>
      <div className="container">
        <div className="row g-4">
          {contacts.map((person, idx) => (
            <div className="col-md-4" key={idx}>
              <div className="card h-100 shadow-sm border-0">
                <div className="card-body text-center">
                  <i className={`bi bi-${person.icon} display-4 text-primary mb-3`}></i>
                  <h5 className="card-title fw-semibold">{person.name}</h5>
                  <p className="text-muted mb-1">{person.role}</p>
                  <a href={`mailto:${person.email}`} className="text-decoration-none text-dark">
                    <i className="bi bi-envelope-fill me-2"></i>{person.email}
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
