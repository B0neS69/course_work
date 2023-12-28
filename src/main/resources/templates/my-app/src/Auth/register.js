export const registerUser = async (registrationData) => {
    try {
        const response = await fetch('http://localhost:8080/patient/patient', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(registrationData),
        });

        if (!response.ok) {
            throw new Error('Registration failed');
        }

        return await response.json();
    } catch (error) {
        throw new Error('Registration failed');
    }
};