import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

import davidImg from "../assets/personal-photos/david.png";
import jacksonImg from "../assets/personal-photos/Jackson.jpg";
import kyaImg from "../assets/personal-photos/Kya.JPG";
import lucasImg from "../assets/personal-photos/Lucas.jpg";
import michaelImg from "../assets/personal-photos/Michael.jpg";
import roryImg from "../assets/personal-photos/Rory.png";

const contacts = [
  { name: "David Lapaglia", role: "", email: "David.Lapaglia@colorado.edu", image: davidImg },
  { name: "Jackson Meyer", role: "Research and ", email: "Jackson.Meyer@colorado.edu", image: jacksonImg },
  { name: "Kya Lini", role: "UX/UI Designer", email: "kyli3612@colorado.edu", image: kyaImg },
  { name: "Lucas Drager", role: "Full Stack Development", email: "Lucas.Drager@colorado.edu", image: lucasImg },
  { name: "Michael Drozd", role: "Backend AI Development", email: "mikedrozd8@gmail.com", image: michaelImg },
  { name: "Rory O'Flynn", role: "UX/UI Designer and Researcher", email: "Rory.OFlynn@colorado.edu", image: roryImg },
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
                <img
                  src={person.image}
                  alt={person.name}
                  className="rounded-circle mb-3"
                  style={{ width: "250px", height: "250px", objectFit: "cover" }}
                  />
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
