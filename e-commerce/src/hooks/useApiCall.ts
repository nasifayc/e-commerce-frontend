import axios from "axios";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setAuthData } from "../store/auth/authSlice";
import { SIGN_UP_ROUTE, LOGIN_ROUTE } from "../routes/apiRoutes";
import { SignUpFormData, LoginFormData } from "./useAuthForm";
import { notify } from "../components/Toast";

const useApiCall = (isSignUp: boolean) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const apiCall = async (data: SignUpFormData | LoginFormData) => {
    let response;
    if (isSignUp) {
      response = await axios.post(SIGN_UP_ROUTE, data);
      const { user } = response.data;
      dispatch(setAuthData({ accessToken: null, user }));
      // localStorage.setItem("user", user);
      notify("OTP sent to your email for verification.");
      navigate("/verify-otp");
    } else {
      response = await axios.post(LOGIN_ROUTE, data);
      const { accessToken, user } = response.data;
      console.log(response.data);

      dispatch(setAuthData({ user, accessToken }));
      // localStorage.setItem("accessToken", accessToken);

      notify("Login successful!");
      navigate("/");
    }
  };

  return { apiCall };
};

export default useApiCall;
