export const RESPONSE_SUCCESS_MESSAGE = {
    8001: "success",
    8002: "mail sent successfully to register user",
    8003: "user registerd successfully",
    8004: "user logged in successfully",
    8005: "user logged out successfully",
    8006: "user found",
    8007: "problem created successfully"
};

export const RESPONSE_ERROR_MESSAGE = {
    1001: "failure",
    1002: "Validation Error",
    1003: "User already exists",
    1004: "Failed to send Email",
    1005: "User does not exists",
    1006: "Invalid Credentials",
    1007: "Token not available",
    1008: "Token Expired",
    1009: "User not authorised",
    1010: "Language not found",
    1011: "Error in Sample Solution"
};

export const COOKIE_OPTIONS = {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV !== "dev",
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
};
