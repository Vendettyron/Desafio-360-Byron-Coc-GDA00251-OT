import React from "react";

const FormLayout = ({ children,title  }) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "50vh",
        padding: "2rem",
        justifyContent: "center", 
      }}
      className='shadow-lg bg-slate-200 rounded-lg'
    >
      <h2 className="text-center text-2xl">{title}</h2>
      {children}
    </div>
  );
};

export default FormLayout;