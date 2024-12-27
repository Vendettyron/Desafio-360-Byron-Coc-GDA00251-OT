import React from "react";

const FormLayout = ({ children,title  }) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "50vh",
        marginTop: "100px",
        padding: "2rem",
        backgroundColor: "#e4e4e7",
        justifyContent: "center", 
        borderRadius: "1rem",
        boxShadow: "0px 0px 10px 0px rgba(0,0,0,0.5)",
      }}
      className='space-y-12'
    >
      <h2 className="text-center text-2xl">{title}</h2>
      {children}
    </div>
  );
};

export default FormLayout;