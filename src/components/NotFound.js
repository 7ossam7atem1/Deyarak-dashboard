import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import '../css/NotFound.css';

const NotFound = () => {
  return (
    <div className='container'>
      <div className='row justify-content-center'>
        <div className='col-md-8 text-center'>
          <div className='not-found'>
            <FontAwesomeIcon icon={faExclamationCircle} className='icon' />
            <h1 className='title'>404 Not Found</h1>
            <p className='message'>
              Oops! The page you're looking for does not exist.
            </p>
            <Link to='/' className='btn btn-primary mt-3'>
              Go Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
