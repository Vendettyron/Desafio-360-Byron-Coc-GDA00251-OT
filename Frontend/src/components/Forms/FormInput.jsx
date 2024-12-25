import React from 'react';

const FormInput = ({
  label,
  id,
  type = 'text',
  register,
  error,
  ...props
}) => {
  return (
    <div style={{ marginBottom: '1rem' }}>
      {label && <label htmlFor={id}>{label}</label>}
      <input
        id={id}
        type={type}
        {...register}
        {...props}
        style={{ display: 'block', width: '100%', marginTop: '0.5rem' }}
      />
      {error && (
        <span style={{ color: 'red', fontSize: '0.9rem' }}>{error}</span>
      )}
    </div>
  );
};

export default FormInput;
