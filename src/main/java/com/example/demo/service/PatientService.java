package com.example.demo.service;

import com.example.demo.dto.AppointmentDto;
import com.example.demo.dto.PatientRegistrationDto;
import com.example.demo.model.Appointment;
import com.example.demo.model.MedicalRecord;
import com.example.demo.model.Patient;

import java.util.List;

public interface PatientService {
    Patient registerPatient(PatientRegistrationDto patientRegistrationDto);
    List<MedicalRecord> getMedicalRecords(Long  patientId);
    void scheduleAppointment(String patientId, AppointmentDto appointmentDto);
    Patient getPatientById(Long patientId);
    public boolean isAppointmentFree(Long patientId, Long appointmentId);
    List<Appointment> getAppointments(Long patientId);
    void deductFreeAppointment(Long patientId);

}