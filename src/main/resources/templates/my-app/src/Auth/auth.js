import axios from 'axios';

const loginUser = async (login, password) => {
    try {
        const response = await axios.post('http://localhost:8080/patient/login', {
            login: login,
            password: password
        });

        console.log(response.data);
        return response;
    } catch (error) {
        console.error('Login failed', error);
        throw error;
    }
};

export { loginUser };