const registerEmail = ({ userName, token }) => {
    return {
        body: {
            name: userName,
            intro: `Welcome to Paperless Code! 🎉`,
            table: {
                data: [
                    {
                        "Your Username": userName,
                        "Verification Status": "Pending",
                    },
                ],
                columns: {
                    // Optionally define custom widths or alignments
                    customWidth: {
                        "Your Username": "50%",
                        "Verification Status": "50%",
                    },
                    customAlignment: {
                        "Your Username": "left",
                        "Verification Status": "right",
                    },
                },
            },
            action: {
                instructions: "Click the button below to verify your account:",
                button: {
                    color: "#22BC66",
                    text: "Verify My Email",
                    link: `${process.env.BACKEND_URL}auth/verifyEmail/${token}/`,
                },
            },
            outro: "If you did not create an account with Paperless Code, you can safely ignore this email. Otherwise, we’re excited to have you!",
        },
    };
};

const forgotPasswordEmail = ({ userName = "Paperless Coder", token }) => {
    return {
        body: {
            name: userName,
            intro: `Forgot your password? Don't worry, we've got you covered.`,

            table: {
                data: [
                    {
                        "Your Username": userName,
                        "Reset Status": "Requested",
                    },
                ],
                columns: {
                    customWidth: {
                        "Your Username": "50%",
                        "Reset Status": "50%",
                    },
                    customAlignment: {
                        "Your Username": "left",
                        "Reset Status": "right",
                    },
                },
            },

            action: {
                instructions: "Click the button below to reset your password:",
                button: {
                    color: "#1D4ED8",
                    text: "Reset My Password",
                    link: `${process.env.FRONTEND_URL}/auth/resetPassword/${token}/`,
                },
            },

            outro: "If you did not request a password reset, you can safely ignore this email. Otherwise, follow the link above to securely reset your password.",
        },
    };
};

const registerEmailSubject = "Register your account with Paperless Code";
const forgotPasswordSubject = "Reset your password for Paperless Code";

export {
    registerEmail,
    registerEmailSubject,
    forgotPasswordSubject,
    forgotPasswordEmail,
};
