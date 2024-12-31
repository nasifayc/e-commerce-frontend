import axios from "axios";
import { useDispatch } from "react-redux";
import { setAuthData } from "../store/auth/authSlice";
import { API_BASE_URL, SIGN_UP_ROUTE, LOGIN_ROUTE } from "../routes/apiRoutes";
import { SignUpFormData, LoginFormData } from "./useAuthForm";
import { toast } from "react-toastify";

const useApiCall = (isSignUp: boolean) => {
  const dispatch = useDispatch();
  const notify = (message: string) => toast(message);
  const apiCall = async (data: SignUpFormData | LoginFormData) => {
    let response;
    if (isSignUp) {
      response = await axios.post(`${API_BASE_URL}${SIGN_UP_ROUTE}`, data);
      notify("OTP sent to your email for verification.");
      // navigate("/verify-otp");
    } else {
      response = await axios.post(`${API_BASE_URL}${LOGIN_ROUTE}`, data);
      const { accessToken, user } = response.data;
      console.log(response.data);

      dispatch(setAuthData({ user, accessToken }));
      localStorage.setItem("accessToken", accessToken);

      notify("Login successful!");
    }
  };

  return { apiCall };
};

export default useApiCall;
