import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import "../css/Contact.css";

const Contacts = () => {
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const token = Cookies.get("token");
        const response = await axios.get(
          "https://deyarak-app.onrender.com/api/v1/contacts/getcontacts",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(response.data); // Log the response data

        if (response.data.status === "Success") {
          setContacts(response.data.data || []);
        } else {
          console.error("Failed to fetch contacts:", response.data.message);
        }
      } catch (error) {
        console.error("Error fetching contacts:", error);
      }
    };
    fetchContacts();
  }, []);

  return (
    <div className="contacts-container">
      <h2>Contact Users</h2>
      <ul>
        {contacts.map((contact) => (
          <li key={contact._id} className="contact-item">
            <div className="contact-info">
              <img src={contact.sender.photo.url} alt={contact.sender.name} />
              <span>
                {contact.sender.name} - {contact.sender.email}
              </span>
            </div>
            <div className="contact-message">
              <p>{contact.messageTitle}</p>
              <p>{contact.message}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Contacts;
