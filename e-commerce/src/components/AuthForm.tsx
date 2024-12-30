import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch } from "react-redux";
import { setAuthData } from "../store/auth/authSlice";
import axios from "axios";
import { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/ReactToastify.css";
import { API_BASE_URL, SIGN_UP_ROUTE, LOGIN_ROUTE } from "../routes/apiRoutes";

// Validation schemas
const signUpSchema = z.object({
  name: z.string().min(4, "Name must be at least 4 characters."),
  email: z.string().email("Invalid email address."),
  password: z.string().min(6, "Password must be at least 6 characters."),
});

const loginSchema = z.object({
  email: z.string().email("Invalid email address."),
  password: z.string().min(6, "Password must be at least 6 characters."),
});

type SignUpFormData = z.infer<typeof signUpSchema>;
type LoginFormData = z.infer<typeof loginSchema>;

const AuthForm: React.FC = () => {
  const [isSignUp, setIsSignUp] = useState(true);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormData | LoginFormData>({
    resolver: zodResolver(isSignUp ? signUpSchema : loginSchema),
  });

  interface ErrorResponse {
    message: string;
  }

  const onSubmit = async (data: SignUpFormData | LoginFormData) => {
    setLoading(true);
    try {
      let response;
      if (isSignUp) {
        response = await axios.post(`${API_BASE_URL}${SIGN_UP_ROUTE}`, data);
        toast.success("OTP sent to your email for verification.", {
          position: "top-center",
          autoClose: 3000,
        });

        navigate("/verify-otp");
      } else {
        response = await axios.post(`${API_BASE_URL}${LOGIN_ROUTE}`, data);
        const { accessToken, user } = response.data;

        dispatch(setAuthData({ user, accessToken }));
        localStorage.setItem("accessToken", accessToken);

        toast.success("Login successful!", {
          position: "top-center",
          autoClose: 3000,
        });

        navigate("/");

        // Optionally, store the token in a cookie or session storage
        // document.cookie = `accessToken=${accessToken}; path=/; max-age=3600`; // Store access token in cookie for the session
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<ErrorResponse>;
        console.log(
          "axios error",
          axiosError.response?.data?.message ||
            "An error occurred. Please try again."
        );

        toast.error(
          axiosError.response?.data?.message ||
            "An error occurred. Please try again.",
          {
            position: "top-center",
            autoClose: 3000,
          }
        );
      } else {
        console.log("An error occurred 2. Please try again.");
        toast.error("An unknown error occurred. Please try again.", {
          position: "top-center",
          autoClose: 3000,
        });
      }
    } finally {
      setLoading(false); // Set loading to false when the request is finished
    }
    // console.log("Form Data:", data);
    // alert(JSON.stringify(data, null, 2));
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white rounded shadow">
        <h2 className="text-2xl font-semibold mb-4 text-center">
          {isSignUp ? "Sign Up" : "Login"}
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {isSignUp && (
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <input
                type="text"
                {...register("name")}
                className="w-full px-3 py-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {/* Type-safe access of errors.name */}
              {"name" in errors && errors.name && (
                <p className="text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              // type="email"
              {...register("email")}
              className="w-full px-3 py-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.email && (
              <p className="text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              {...register("password")}
              className="w-full px-3 py-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.password && (
              <p className="text-sm text-red-600">{errors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            className={`w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loading}
            // className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {loading ? (
              <div className="flex justify-center items-center">
                <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-white"></div>
              </div>
            ) : isSignUp ? (
              "Sign Up"
            ) : (
              "Login"
            )}
          </button>
        </form>

        <div className="mt-4 text-center">
          <button
            className="text-sm text-blue-500 hover:underline"
            onClick={() => setIsSignUp(!isSignUp)}
          >
            {isSignUp
              ? "Already have an account? Login"
              : "Don't have an account? Sign Up"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
