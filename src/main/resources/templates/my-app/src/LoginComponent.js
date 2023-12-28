import React, { useEffect, useState } from 'react';
import logo from './Logo-v1.0.png';
import { loginUser } from './Auth/auth';

const LoginComponent = ({ login, setLogin, password, setPassword, loginError, handleLogin, handleRegister }) => {
    const [isButtonDisabled, setIsButtonDisabled] = useState(true);
    const [inputError, setInputError] = useState('');
    const [isLoginEmpty, setIsLoginEmpty] = useState(false);
    const [isPasswordEmpty, setIsPasswordEmpty] = useState(false);

    useEffect(() => {
        validateForm();
    }, [login, password, loginError]);

    const validateForm = () => {
        const isFormValid = login.trim() !== '' && password.trim() !== '' && !loginError;
        setIsButtonDisabled(!isFormValid);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setInputError('');

        if (login.trim() === '') {
            setIsLoginEmpty(true);
        } else {
            setIsLoginEmpty(false);
        }

        if (password.trim() === '') {
            setIsPasswordEmpty(true);
        } else {
            setIsPasswordEmpty(false);
        }

        if (login.trim() === '' || password.trim() === '' ) {
            setInputError('Заповніть всі поля');
            return;
        }
        try {
            const response = await loginUser(login, password);
            console.log(response); // Log the entire response for debugging

            if (response && response.data && response.data.message.toLowerCase() === 'login successful') {
                await Promise.resolve(handleLogin());
            } else if (response && response.data && response.data.error) {
                setInputError(response.data.error); // Display the error message
            } else {
                setInputError('Invalid username or password.');
            }
        } catch (error) {
            console.error('Login failed', error);
            if (error.response && error.response.status === 401) {
                setInputError('Invalid username or password.');
            } else if (error.response && error.response.data && error.response.data.error) {
                setInputError(error.response.data.error);
            } else {
                setInputError('Login failed. Please try again later.');
            }
        }
    };
    return (
        <div>
            <div className="logo-login-page">
                <img src={logo} alt="" />
            </div>
            <div className="login-component">
                {isLoginEmpty && <p style={{ color: 'red' }}>Введіть логін.</p>}
                <input
                    type="text"
                    placeholder="Username"
                    value={login}
                    onChange={(e) => {
                        setLogin(e.target.value);
                        validateForm();
                    }}
                />
                {isPasswordEmpty && <p style={{ color: 'red' }}>Введіть пароль</p>}
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => {
                        setPassword(e.target.value);
                        validateForm();
                    }}
                />

                {inputError && <p style={{ color: 'red' }}>Неправильні дані</p>}
                <button type="button" onClick={handleSubmit} >
                    Login
                </button>
                <button type="button" onClick={handleRegister}>
                    Register
                </button>
            </div>
        </div>
    );
};

export default LoginComponent;
