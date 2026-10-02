import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserDetails } from "../calls/users";
import { Spin } from "antd";

function ProtectedRoute({ children }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const callForUserDetails = async () => {
    const response = await getUserDetails();
    console.log(response)
    if (response.success) {
      setUser(response.data);
    } else {
      navigate("/");
    }
    setLoading(false);
  };

  useEffect(() => {
    const isTokenAvailable = localStorage.getItem("token");
    if (!isTokenAvailable) {
      navigate("/");
    } else {
      callForUserDetails();
    }
  }, [navigate]);


  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (user) {
    return (
      <>
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child, { userDetails: user });
          }
          return child;
        })}
      </>
    );
  }

  return null; 
}

export default ProtectedRoute;