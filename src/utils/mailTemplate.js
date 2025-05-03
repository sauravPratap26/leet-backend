const registerEmail = ({userName, token}) => {
    return {
      body: {
        name: userName,
        intro: `Welcome to Leet Lab! 🎉`,
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
        outro:
          "If you did not create an account with Leet Lab, you can safely ignore this email. Otherwise, we’re excited to have you!",
      },
    };
  };

  const registerEmailSubject = "Register your account with LeetLab"
  
  export { registerEmail,registerEmailSubject };
  