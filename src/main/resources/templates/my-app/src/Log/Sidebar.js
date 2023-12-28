// Sidebar.js
import React from 'react';
import './Sidebar.css';
const Sidebar = ({
                     handleViewMedicalRecords,
                     handleViewScheduleAppointment,
                     handleViewDoctorAppointments,
                   }) => {
    return (
        <div className="sidebar-container">
            <button onClick={handleViewMedicalRecords}>Переглянути медичну історію</button>
            <button onClick={handleViewScheduleAppointment}>Записатися на прийом</button>
            <button onClick={handleViewDoctorAppointments}>Перегляд записів до Лікаря</button>
       </div>
    );
};

export default Sidebar;
