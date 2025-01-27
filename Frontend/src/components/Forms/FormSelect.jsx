import React from 'react';

const FormSelect = ({
  label,
  id,
  register,
  error,
  options = [],
  ...props
}) => {
  return (
    <div style={{ marginBottom: '1rem' }}>
      {label && <label htmlFor={id}>{label}</label>}
      <select
        id={id}
        {...register}
        {...props}
        style={{ display: 'block', width: '100%', marginTop: '0.5rem', padding: '0.5rem', borderRadius: '0.25rem', border: '1px solid #ccc' }}
        className='form-select bg-gray-300'
      >
        {options.map(({ label, value }) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
      {error && (
        <span style={{ color: 'red', fontSize: '0.9rem' }}>{error}</span>
      )}
    </div>
  );
};

export default FormSelect;
