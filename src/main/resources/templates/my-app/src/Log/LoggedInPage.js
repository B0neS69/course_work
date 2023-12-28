import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TableComponent from '../Table/TableComponent';
import DoctorAppointmentsTable from '../Table/DoctorAppointmentsTable';
import './styles_loggedin.css';
import Header from './Header';
import Sidebar from './Sidebar';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';


const LoggedInPage = ({ username, role, onLogout, fullName }) => {
    const [users, setUsers] = useState([]);
    const [medicalRecords, setMedicalRecords] = useState([]);
    const [selectedDoctorId, setSelectedDoctorId] = useState('');
    const [selectedDoctorName, setSelectedDoctorName] = useState('');
    const [selectedDoctorType, setSelectedDoctorType] = useState('');
    const [appointmentDateTime, setAppointmentDateTime] = useState('');
    const [isFree, setIsFree] = useState(false);
    const [patientId, setPatientId] = useState(null);
    const [doctorAppointments, setDoctorAppointments] = useState([]);
    const [showDoctorAppointments, setShowDoctorAppointments] = useState(false);
    const [selectedDoctor, setSelectedDoctor] = useState(null);

    const fetchUsers = async () => {
        try {
            const response = await axios.get('http://localhost:8080/user/all');
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching users', error);
        }
    };
    const [showMedicalRecords, setShowMedicalRecords] = useState(false);
    const [showScheduleAppointment, setShowScheduleAppointment] = useState(false);

    useEffect(() => {
        const fetchPatientId = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/patient/get-patient-id?username=${username}`);
                setPatientId(response.data);
            } catch (error) {
                console.error('Error fetching patientId', error);
            }
        };

        fetchPatientId();
    }, [username]);

    useEffect(() => {
        const fetchPatientData = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/patient/${patientId}`);
                const patientData = response.data;
                setIsFree(patientData.hasInsurance);
            } catch (error) {
                console.error('Error fetching patient data', error);
            }
        };

        fetchPatientData();
    }, [patientId]);

    const fetchMedicalRecords = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/patient/${username}/medical-records`);
            const mappedMedicalRecords = response.data.map(record => ({
                id: record.id,
                appointment_date_time: record.appointmentDateTime,
                doctor_id: record.doctorId,
                doctor_name: record.doctorName,
                doctor_type: record.doctorType,
                diagnosis: record.diagnosis,
                treatment: record.treatment,
            }));
            setMedicalRecords(mappedMedicalRecords);
        } catch (error) {
            console.error('Error fetching medical records', error);
        }
    };

    const handleLogout = () => {
        onLogout();
    };

    const handleScheduleAppointment = async () => {
        try {
            // Check if patientId is available
            if (patientId === null) {
                console.error('PatientId is not available');
                return;
            }

            if (!selectedDoctorName || !appointmentDateTime) {
                console.error('Doctor and date/time must be selected');
                return;
            }
            const formattedDateTime = new Date(appointmentDateTime).toLocaleString('en-GB', {
                day: 'numeric',
                month: 'numeric',
                year: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
                hour12: false,
            });

            const appointmentData = {
                doctorId: selectedDoctorId,
                doctorName: selectedDoctorName,
                doctorType: selectedDoctorType,
                appointmentDateTime: formattedDateTime,

            };
            console.log(appointmentDateTime)
            const response = await axios.post(`http://localhost:8080/patient/${patientId}/schedule-appointment`, appointmentData);

            console.log(patientId);
            console.log(appointmentData);
            if (response.status === 200) {
                console.log('Appointment scheduled successfully');

                await handleViewDoctorAppointments();
            } else {
                console.error('Error scheduling appointment');
            }
        } catch (error) {
            console.error('Error scheduling appointment', error);
        }
    };
    const handleViewMedicalRecords = async () => {
        try {
            await fetchMedicalRecords();
            setShowMedicalRecords(true);
            setShowScheduleAppointment(false);
            setShowDoctorAppointments(false);
        } catch (error) {
            console.error('Error fetching medical records', error);
        }
    };
    const handleViewScheduleAppointment = () => {
        setShowScheduleAppointment(true);
        setShowMedicalRecords(false);
        setShowDoctorAppointments(false);
    };

    const handleViewDoctorAppointments = async () => {
        try {
            setShowScheduleAppointment(false);
            setShowMedicalRecords(false);
            setShowDoctorAppointments(true);

            const response = await axios.get(`http://localhost:8080/patient/${patientId}/appointments`);

            const mappedDoctorAppointments = response.data.map(appointment => ({
                id: appointment.id,
                appointment_date_time: appointment.appointmentDateTime,
                doctor: appointment.doctor,
                isFree: appointment.free,
            }));

            setDoctorAppointments(mappedDoctorAppointments);
            console.log(doctorAppointments);
        } catch (error) {
            console.error('Error fetching doctor appointments', error);
        }
    };

    const [isSidebarOpen, setSidebarOpen] = useState(false);

    const handleToggleSidebar = () => {
        setSidebarOpen(!isSidebarOpen);
    };


    return (
        <div className="logged-in-page">
            <Header
                username={fullName}
                hasInsurance={isFree}
                handleToggleSidebar={handleToggleSidebar}
                handleLogout={onLogout}
            />
            <div className="main-content-centered">
                    {showMedicalRecords && (
                        <div className="main-content-form">
                            <h2>Медична історія</h2>
                            <TableComponent data={medicalRecords} />
                        </div>
                    )}
                    {showDoctorAppointments && (
                        <div className="main-content-form">
                            <div>
                                <h2>Записи на прийом</h2>
                            </div>
                            <div>
                                <DoctorAppointmentsTable data={Object.values(doctorAppointments)} />
                            </div>
                        </div>
                    )}
                    {showScheduleAppointment && (
                        <div className="main-content-form-schedule">
                            <h2>Записатися на прийом</h2>
                            <label>Лікарі :</label>
                            <select
                                name="doctor"
                                onChange={(e) => {
                                    const selectedOption = e.target.options[e.target.selectedIndex];
                                    const doctorId = selectedOption.getAttribute('data-doctor-id');
                                    const doctorName = selectedOption.getAttribute('data-doctor-name');
                                    const doctorType = selectedOption.getAttribute('data-doctor-type');

                                    setSelectedDoctorId(doctorId);
                                    setSelectedDoctorName(doctorName);
                                    setSelectedDoctorType(doctorType);
                                    setSelectedDoctor({ id: doctorId, name: doctorName, type: doctorType });
                                }}
                                value={selectedDoctorName}
                            >
                                <option value="">Виберіть лікаря</option>
                                <option value="Dr. Сміт" data-doctor-id="1" data-doctor-name="Dr. Сміт" data-doctor-type="Терапевт">
                                    Dr. Сміт - Терапевт
                                </option>
                                <option value="Dr. Джонсон" data-doctor-id="2" data-doctor-name="Dr. Джонсон" data-doctor-type="Кардіолог">
                                    Dr. Джонсон - Кардіолог
                                </option>
                                <option value="Dr. Девіс" data-doctor-id="3" data-doctor-name="Dr. Девіс" data-doctor-type="Дерматолог">
                                    Dr. Девіс - Дерматолог
                                </option>
                                <option value="Dr. Іваненко" data-doctor-id="4" data-doctor-name="Dr. Іваненко" data-doctor-type="Гінеколог">
                                    Dr. Іваненко - Гінеколог
                                </option>
                                <option value="Dr. Коваль" data-doctor-id="5" data-doctor-name="Dr. Коваль" data-doctor-type="Проктолог">
                                    Dr. Коваль - Проктолог
                                </option>
                            </select>
                            <label  >Дата і час:</label>
                            <div className="DatePicker"> <DatePicker
                                selected={appointmentDateTime}
                                onChange={(date) => setAppointmentDateTime(date)}
                                showTimeSelect
                                timeFormat="HH:mm"
                                timeIntervals={15}
                                dateFormat="MMMM d, yyyy HH:mm"
                                minDate={new Date()}
                                minTime={new Date(0, 0, 0, 8, 0)} // Початок дня
                                maxTime={new Date(0, 0, 0, 14, 0)} // 14:00
                            /></div>

                            <br/>
                            <button onClick={handleScheduleAppointment}>Записатись</button>
                        </div>
                    )}
                {isSidebarOpen && (
                    <Sidebar
                        handleViewMedicalRecords={handleViewMedicalRecords}
                        handleViewScheduleAppointment={handleViewScheduleAppointment}
                        handleViewDoctorAppointments={handleViewDoctorAppointments}
                    />
                )}
            </div>
        </div>
    );
};

export default LoggedInPage;





