import React, { useEffect, useState } from 'react';
import '../styles.css';
import logo from '../Logo-v1.0.png';

const AdditionalInfoForm = ({
                                login,
                                setLogin,
                                password,
                                setPassword,
                                fullName,
                                setFullName,
                                age,
                                setAge,
                                gender,
                                setGender,
                                hasInsurance,
                                setHasInsurance,
                                onSubmit,
                                registrationError,
                                setRegistrationError,
                            }) => {
    const [isButtonDisabled, setIsButtonDisabled] = useState(true);
    const [isLoginEmpty, setIsLoginEmpty] = useState(false);
    const [isPasswordEmpty, setIsPasswordEmpty] = useState(false);
    const [isFullNameEmpty, setIsFullNameEmpty] = useState(false);
    const [isAgeEmpty, setIsAgeEmpty] = useState(false);

    const validateForm = () => {
        const isFormValid =
            login.trim() !== '' &&
            password.trim() !== '' &&
            fullName.trim() !== '' &&
            age !== '';

        setIsButtonDisabled(!isFormValid);
    };

    const handleSubmit = async () => {
        setRegistrationError('');

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

        if (fullName.trim() === '') {
            setIsFullNameEmpty(true);
        } else {
            setIsFullNameEmpty(false);
        }

        if (age === '') {
            setIsAgeEmpty(true);
        } else {
            setIsAgeEmpty(false);
        }

        if (login.trim() === '' || password.trim() === '' || fullName.trim() === '' || age === '') {
            setRegistrationError('Заповніть всі поля');
            return;
        }

        try {
            const registrationData = { login, password, fullName, age, gender, hasInsurance };
            console.log('Registration Data:', registrationData);

            await onSubmit();
        } catch (error) {
            console.error('Даний логін зайнятий', error);

            if (error.message) {
                setRegistrationError(error.message);
            } else {
                setRegistrationError('Registration failed. Please try again later.');
            }
        }
    };

    return (
        <div>
            <div className="logo-login-page">
                <img src={logo} alt="" />
            </div>
            <div className="additional-info-form">
                {registrationError && <p style={{ color: 'red' }}>{registrationError}</p>}
                <label>
                    Логін:
                    {isLoginEmpty && <p style={{ color: 'red' }}>Введіть логін.</p>}
                    <input

                        type="text"
                        value={login}
                        onChange={(e) => {
                            setLogin(e.target.value);
                            setIsLoginEmpty(false);
                            validateForm();
                        }}
                    />

                </label>
                <br />
                <label>
                    Пароль:
                    {isPasswordEmpty && <p style={{ color: 'red' }}>Введіть пароль</p>}
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value);
                            setIsPasswordEmpty(false);
                            validateForm();
                        }}
                    />

                </label>
                <br />
                <label>
                    ПІБ:
                    {isFullNameEmpty && <p style={{ color: 'red' }}>Введіть ваше повне ім'я</p>}
                    <input
                        type="text"
                        value={fullName}
                        onChange={(e) => {
                            setFullName(e.target.value);
                            setIsFullNameEmpty(false);
                            validateForm();
                        }}
                    />

                </label>
                <br />
                <label>
                    Вік:
                    {isAgeEmpty && <p style={{ color: 'red' }}>Введіть ваш вік</p>}
                    <input
                        type="number"
                        value={age}
                        onChange={(e) => {
                            setAge(e.target.value);
                            setIsAgeEmpty(false);
                            validateForm();
                        }}
                        min={0}
                    />

                </label>
                <br />
                <label>
                    Стать:
                    <select
                        value={gender}
                        onChange={(e) => {
                            setGender(e.target.value);
                        }}
                    >
                        <option value="Male">Чоловік</option>
                        <option value="Female">Жінка</option>
                    </select>
                </label>
                <br />
                <label>
                    Страховка:
                    <select
                        value={hasInsurance}
                        onChange={(e) => {
                            setHasInsurance(e.target.value === 'true');
                        }}
                    >
                        <option value={true}>Є</option>
                        <option value={false}>Немає</option>
                    </select>
                </label>
                <br />
                <button onClick={handleSubmit} >
                    Зареєструватися
                </button>
            </div>
        </div>
    );
};

export default AdditionalInfoForm;
