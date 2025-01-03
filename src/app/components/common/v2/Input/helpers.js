export const getHelperText = (error) => {
    const excludedErrors = [
        'At least 8 characters are required in the password',
        'At least one number is required in the password',
        'At least one uppercase letter is required in the password',
        'At least one lowercase letter is required in the password',
        'At least one special character is required in the password',
    ];

    if (excludedErrors.includes(error)) {
        return null;
    }

    return error || null;
};