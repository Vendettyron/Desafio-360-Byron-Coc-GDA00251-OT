import React from 'react';
import { cn } from "@/lib/utils"

const FormInput = ({
  label,
  id,
  type = 'text',
  register,
  error,
  className,
  ...props
}) => {
  return (
    <div  className='mb-4'>
      {label && <label className='mb-3' htmlFor={id}>{label} </label>}
      <input
        id={id}
        type={type}
        {...register}
        {...props}
        className={cn(
                "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
                className
        )}
      />
      {error && (
        <span style={{ color: 'red', fontSize: '0.9rem' }}>{error}</span>
      )}
    </div>
  );
};

export default FormInput;
