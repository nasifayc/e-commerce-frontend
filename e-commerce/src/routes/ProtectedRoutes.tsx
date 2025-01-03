import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import axios from "axios";
import { notify } from "../components/Toast";
import { VERIFY_TOKEN, VERIFY_OTP } from "./apiRoutes";

interface ProtectedRouteProps {
  element: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element }) => {
  const [loading, setLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  const accessToken = useSelector((state: RootState) => state.auth.accessToken);
  const user = useSelector((state: RootState) => state.auth.user);
  // const navigate = useNavigate();

  useEffect(() => {
    const verifyAccessToken = async () => {
      try {
        const response = await axios.post(
          `${VERIFY_TOKEN}?token=${accessToken}`
        );

        if (response.status === 200) {
          setIsAuthorized(true);
          notify("Request Aithorized!");
        } else {
          setIsAuthorized(false);
        }
      } catch (error) {
        console.error("Access token verification failed:", error);
        notify("Access token verification failed");
        setIsAuthorized(false);
      } finally {
        setLoading(false);
      }
    };

    const validateOTP = async () => {
      try {
        const response = await axios.post(VERIFY_OTP, {
          email: user?.email,
        });
        if (response.status === 200) {
          setIsAuthorized(true);
          notify("Request Authorized!");
        } else {
          setIsAuthorized(false);
          notify("Request Unauthorized!");
        }
      } catch (error) {
        console.error("OTP validation failed:", error);
        notify(`OTP validation failed: ${error}`);
        setIsAuthorized(false);
      } finally {
        setLoading(false);
      }
    };

    const checkAuthorization = async () => {
      if (accessToken) {
        await verifyAccessToken();
      } else if (user) {
        await validateOTP();
      } else {
        setIsAuthorized(false);
        setLoading(false);
      }
    };

    checkAuthorization();
  }, [accessToken, user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="flex items-center justify-center space-x-2 animate-pulse">
          <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
          <div className="w-4 h-4 bg-green-500 rounded-full"></div>
          <div className="w-4 h-4 bg-red-500 rounded-full"></div>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return <Navigate to="/login" />;
  }

  return <>{element}</>;
};

export default ProtectedRoute;
