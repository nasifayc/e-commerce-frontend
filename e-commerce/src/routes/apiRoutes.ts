// apiRoutes.ts
export const API_BASE_URL = "http://localhost:3000";

export const SIGN_UP_ROUTE = `${API_BASE_URL}/api/user/auth/sign-up`;
export const LOGIN_ROUTE = `${API_BASE_URL}/api/user/auth/sign-in`;
export const VERIFY_OTP = `${API_BASE_URL}/api/user/auth/validate-otp`;
export const VERIFY_TOKEN = `${API_BASE_URL}/api/user/auth//verify-token`;

// Add any other routes you need
