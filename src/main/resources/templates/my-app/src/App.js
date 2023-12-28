import React, {useCallback, useEffect, useRef, useState} from 'react';
import {HashRouter as Router, Route, Routes} from 'react-router-dom';
import { Navigate } from "react-router-dom";
import { loginUser } from './Auth/auth';
import { registerUser } from './Auth/register';
import AdditionalInfoForm from './Auth/AdditionalInfoForm';
import LoggedInPage from './Log/LoggedInPage';
import LoginComponent from "./LoginComponent";
import './styles.css';
import axios from "axios";


const App = () => {
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [age, setAge] = useState('');
    const [gender, setGender] = useState('Male'); // Default gender set to 'Male'
    const [hasInsurance, setHasInsurance] = useState(true); // Default insurance set to 'true'
    const [loggedIn, setLoggedIn] = useState(false);
    const [loginError, setLoginError] = useState(null);
    const [registrationStep, setRegistrationStep] = useState(1); // Default registration step is 1
    const [patientId, setPatientId] = useState(null);
    const [registrationError, setRegistrationError] = useState(null);


    const handleLogin = async () => {
        try {
            await loginUser(login, password);
            setLoggedIn(true);
            setLoginError(false);
            window.location.href = 'http://localhost:3000/#/account';
        } catch (error) {
            setLoginError(true);
            console.error('Login failed', error);
            if (error.response && error.response.status === 401) {
                setLoginError('Invalid login credentials');
            } else {
                setLoginError('Login failed. Please try again later.');
            }
        }
    };


    const fetchFullName = useCallback(async () => {
        try {
            const response = await axios.get(`http://localhost:8080/patient/get-fullname?username=${login}`);
            if (response.data) {
                setFullName(response.data);
            }
        } catch (error) {
            console.error('Error fetching fullName', error);
        }
    }, [login]);

    useEffect(() => {
        if (loggedIn) {
            fetchFullName();
        }
    }, [loggedIn, fetchFullName]);


    const handleRegister = async () => {
        if (registrationStep === 1) {
            window.location.href = 'http://localhost:3000/#/register';
            setRegistrationStep(2);
        } else {
            try {
                const registrationData = { login, password, fullName, age, gender, hasInsurance };
                console.log("Registration Data:", registrationData);

                const response = await registerUser(registrationData);
                console.log(response.message);
                if (response.message === 'Registration successful') {
                    const { patientId } = response;
                    setPatientId(patientId);
                    setLoggedIn(true);
                    window.location.href = 'http://localhost:3000/#/account';
                } else {
                    console.error('Registration failed');
                    setRegistrationError('Даний логін зайнятий');
                }
            } catch (error) {
                console.error('Registration failed', error);
                setRegistrationError('Даний логін зайнятий');
            }
        }
    };

    const handleLogout = () => {
        setLoggedIn(false);
        setLogin('');
        setPassword('');
        setFullName('');
        setAge('');
        setGender('Male');
        setHasInsurance('true');
        setLoginError(null);
        setRegistrationStep(1);
        window.location.href = 'http://localhost:3000/#/login';
    };


    return (
        <Router>
                <Routes>
                    <Route path="/login" element={ <LoginComponent
                        login={login}
                        setLogin={setLogin}
                        password={password}
                        setPassword={setPassword}
                        loginError={loginError}
                        handleLogin={handleLogin}
                        handleRegister={handleRegister}
                    />} />
                    <Route path="/register" element={<AdditionalInfoForm
                        login={login}
                        setLogin={setLogin}
                        password={password}
                        setPassword={setPassword}
                        fullName={fullName}
                        setFullName={setFullName}
                        age={age}
                        setAge={setAge}
                        gender={gender}
                        setGender={setGender}
                        hasInsurance={hasInsurance}
                        setHasInsurance={setHasInsurance}
                        registrationError={registrationError}
                        setRegistrationError={setRegistrationError}
                        onSubmit={handleRegister}
                    />} />
                    <Route path="/account" element={<LoggedInPage username={login} role="user" onLogout={handleLogout} fullName={fullName} />} />
                    <Route index element={<Navigate to="/login" />} />
                </Routes>
        </Router>
    );
}

export default App;