import React from "react";
import "./contact.css";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";




const Contact = () => {
  return (
    <div className="contact-page">
      
      <div className="contact-card">
        <h2>Contact Us</h2>
        <p>We’d love to hear from you. Please fill out the form below.</p>

        <form className="contact-form">
           

          {/* Name */}
          <div className="input-icon">
            <PersonIcon className="icon" />
            <input type="text" placeholder="Your Name" required />
          </div>

          {/* Email */}
          <div className="input-icon">
            <EmailIcon className="icon" />
            <input type="email" placeholder="Your Email" required />
          </div>

          {/* Phone */}
          <div className="input-icon">
            <PhoneIcon className="icon" />
            <input type="text" placeholder="Phone Number" />
          </div>

          
          <textarea placeholder="Your Message" rows="4"></textarea>

        </form>
        <button type="submit" style={{marginLeft:"10px"}}>Send Message</button>
      </div>
    </div>
  );
};

export default Contact;
