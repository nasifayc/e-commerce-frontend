import React, { useState } from "react";

// import { useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import useAuthForm from "../hooks/useAuthForm";

const AuthForm: React.FC = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const { register, handleSubmit, errors, loading, onSubmit } =
    useAuthForm(isSignUp);

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
                {...register("username")}
                className="w-full px-3 py-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {/* Type-safe access of errors.name */}
              {"username" in errors && errors.username && (
                <p className="text-sm text-red-600">
                  {errors.username.message}
                </p>
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
          {loading ? (
            <div className="flex justify-center items-center">
              <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <button
              type="submit"
              className={`w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 `}
              disabled={loading}
            >
              {isSignUp ? "Sign Up" : "Login"}
            </button>
          )}
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
      <ToastContainer />
    </div>
  );
};

export default AuthForm;
