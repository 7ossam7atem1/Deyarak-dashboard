import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import '../css/Contact.css';

const Contacts = () => {
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const token = Cookies.get('token');
        const response = await axios.get(
          'https://deyarak-app.onrender.com/api/v1/contacts/getcontacts',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(response.data);

        if (response.data.status === 'Success') {
          setContacts(response.data.data || []);
        } else {
          console.error('Failed to fetch contacts:', response.data.message);
        }
      } catch (error) {
        console.error('Error fetching contacts:', error);
      }
    };
    fetchContacts();
  }, []);

  return (
    <div className='contacts-container'>
      <h2>Contact Users</h2>
      <ul>
        {contacts.map((contact) => {
          const sender = contact.sender || {};
          const photoUrl = sender.photo ? sender.photo.url : 'defaultPhotoUrl'; // Provide a default photo URL if photo is not available

          return (
            <li key={contact._id} className='contact-item'>
              <div className='contact-info'>
                <img src={photoUrl} alt={sender.name || 'No Name'} />
                <span>
                  {sender.name || 'No Name'} - {sender.email || 'No Email'}
                </span>
              </div>
              <div className='contact-message'>
                <p>{contact.messageTitle}</p>
                <p>{contact.message}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Contacts;
