export const generateTimeBasedCode = () => {
    const now = Date.now();
    const base36 = now.toString(36);
    let code = base36.slice(-6).toUpperCase();
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    while (code.length < 6) {
        code = chars.charAt(Math.floor(Math.random() * chars.length)) + code;
    }

    return code;
};
