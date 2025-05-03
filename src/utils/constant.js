export const RESPONSE_SUCCESS_MESSAGE = {
    8001: "success",
    8002: "mail sent successfully to register user",
    8003: "user registerd successfully",
    8004: "user logged in successfully",
    8005: "user logged out successfully"
};

export const RESPONSE_ERROR_MESSAGE = {
    1001: "failure",
    1002: "Validation Error",
    1003: "User already exists",
    1004: "Failed to send Email",
    1005: "User does not exists",
    1006: "Invalid Credentials",
};

export const COOKIE_OPTIONS = {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV !== "dev",
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
  };
  