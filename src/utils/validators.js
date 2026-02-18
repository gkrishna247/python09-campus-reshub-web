
export function validatePassword(password) {
    return {
        hasMinLength: password.length >= 8,
        hasUppercase: /[A-Z]/.test(password),
        hasLowercase: /[a-z]/.test(password),
        hasDigit: /[0-9]/.test(password),
        hasSpecialChar: /[!@#$%^&*()\-_+=\[\]{}|;:,.<>?/~]/.test(password),
    };
}

export function isPasswordValid(password) {
    const checks = validatePassword(password);
    return Object.values(checks).every((check) => check);
}
