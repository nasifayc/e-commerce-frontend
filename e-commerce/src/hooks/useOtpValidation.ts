import { useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setAuthData } from "../store/auth/authSlice";
import { RootState } from "../store/store";
import { notify } from "../components/Toast";
import { AxiosError } from "axios";
// import { toast } from "react-toastify";
import { VERIFY_OTP } from "../routes/apiRoutes";
import { User, ValidationError } from "../interface/User";
import { useNavigate } from "react-router-dom";

interface OtpResponse {
  user: User;
  accessToken: string;
}

export const useOtpValidation = (length: number) => {
  const [otp, setOtp] = useState<string[]>(Array(length).fill(""));
  const [isLoading, setIsLoading] = useState(false);
  const curUser = useSelector((state: RootState) => state.auth.user);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const { value } = e.target;
    if (/^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value.slice(-1);
      setOtp(newOtp);

      if (value && index < length - 1) {
        const nextInput = document.querySelector<HTMLInputElement>(
          `input:nth-child(${index + 2})`
        );

        nextInput?.focus();
      }
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.querySelector<HTMLInputElement>(
        `input:nth-child(${index})`
      );
      prevInput?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const enteredOtp = otp.join("");
    console.log("Submitted otp: ", enteredOtp);

    try {
      const email = curUser?.email;
      const response = await axios.post<OtpResponse>(VERIFY_OTP, {
        email,
        otp,
      });
      const { user, accessToken } = response.data;

      dispatch(setAuthData({ accessToken, user }));
      console.log("Otp Verified Succesdfully");
      notify("OTP Verfied.");
      navigate("/");
    } catch (e: unknown) {
      notify("Error Occured");
      if (axios.isAxiosError(e)) {
        const axiosError = e as AxiosError<{
          errors: ValidationError[];
          message: string;
        }>;

        if (axiosError.response?.data?.message) {
          console.log(axiosError.response?.data?.message);
          notify(`${axiosError.response?.data?.message}`);
          return;
        }
      } else {
        console.log(`${e}`);
        notify("Failed to verify OTP. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return {
    otp,
    handleInputChange,
    handleKeyDown,
    handleSubmit,
    isLoading,
  };
};

export default useOtpValidation;
