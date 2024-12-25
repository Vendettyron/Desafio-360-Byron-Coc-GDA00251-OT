import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const AdminHomeButton = ({ title, text, link, bgColor }) => {
  return (
    <div className="col-md-4 mb-3">
      <Link to={link} className="text-decoration-none">
        <div className={`card text-white bg-${bgColor} h-100`}>
          <div className="card-body">
            <h5 className="card-title">{title}</h5>
            <p className="card-text">{text}</p>
          </div>
        </div>
      </Link>
    </div>
  );
};

// Definir las validaciones de las props
AdminHomeButton.propTypes = {
  title: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  link: PropTypes.string.isRequired,
  bgColor: PropTypes.oneOf([
    'primary',
    'secondary',
    'success',
    'danger',
    'warning',
    'info',
    'light',
    'dark'
  ]).isRequired,
};

export default AdminHomeButton;
