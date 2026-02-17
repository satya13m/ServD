//apply the similar style in both sign-in and sign-up page
import React from "react";

const AuthLayout = ({ children }) => {
  return <div className="flex justify-center pt-40">{children}</div>;
};

export default AuthLayout;
