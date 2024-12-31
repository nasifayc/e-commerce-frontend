import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import axios from "axios";
import { AxiosError } from "axios";
import { toast } from "react-toastify";
import useApiCall from "./useApiCall";

const signUpSchema = z.object({
  name: z.string().min(4, "Name must be at least 4 characters."),
  email: z.string().email("Invalid email address."),
  password: z.string().min(6, "Password must be at least 6 characters."),
});

const loginSchema = z.object({
  email: z.string().email("Invalid email address."),
  password: z.string().min(6, "Password must be at least 6 characters."),
});

export type SignUpFormData = z.infer<typeof signUpSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;

const useAuthForm = (isSignUp: boolean) => {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<SignUpFormData | LoginFormData>({
    resolver: zodResolver(isSignUp ? signUpSchema : loginSchema),
  });

  const { apiCall } = useApiCall(isSignUp);

  interface ValidationError {
    type: string;
    value: string | undefined | null;
    msg: string;
    path: string;
    location: string;
  }
  const notify = (message: string) => toast(message);

  const onSubmit = async (data: SignUpFormData | LoginFormData) => {
    setLoading(true);
    try {
      await apiCall(data);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<{
          errors: ValidationError[];
          message: string;
        }>;

        if (axiosError.response?.data?.message) {
          notify(`${axiosError.response?.data?.message}`);
          return;
        }

        if (axiosError.response?.data?.errors) {
          const validationErrors = axiosError.response.data.errors;

          const fieldErrors: Record<string, string[]> = {};
          validationErrors.forEach((err) => {
            if (!fieldErrors[err.path]) {
              fieldErrors[err.path] = [];
            }
            fieldErrors[err.path].push(err.msg);
          });
          console.log("Field-specific errors:", fieldErrors);

          Object.entries(fieldErrors).forEach(([field, messages]) => {
            setError(field as keyof (SignUpFormData | LoginFormData), {
              type: "manual",
              message: messages.join(", "),
            });
          });
          notify("Please correct the highlighted fields.");
        } else {
          notify("Server Error. Please try again later!");
        }
      } else {
        notify("An unknown error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    register,
    handleSubmit,
    setError,
    errors,
    loading,
    onSubmit,
    notify,
  };
};

export default useAuthForm;
