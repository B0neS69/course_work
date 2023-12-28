package com.example.demo.service.impl;

import com.example.demo.dto.AppointmentDto;
import com.example.demo.dto.PatientRegistrationDto;
import com.example.demo.model.Appointment;
import com.example.demo.model.MedicalRecord;
import com.example.demo.model.Patient;
import com.example.demo.repository.AppointmentRepository;
import com.example.demo.repository.MedicalRecordRepository;
import com.example.demo.repository.PatientRepository;
import com.example.demo.service.PatientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class PatientServiceImpl implements PatientService {

    private final PatientRepository patientRepository;
    private final MedicalRecordRepository medicalRecordRepository;
    private final PasswordEncoder passwordEncoder;

    private final AppointmentRepository appointmentRepository;

    @Autowired
    public PatientServiceImpl(
            PatientRepository patientRepository,
            MedicalRecordRepository medicalRecordRepository,
            PasswordEncoder passwordEncoder,
             AppointmentRepository appointmentRepository) {
        this.patientRepository = patientRepository;
        this.medicalRecordRepository = medicalRecordRepository;
        this.passwordEncoder = passwordEncoder;
        this.appointmentRepository = appointmentRepository;
    }

    public Patient registerPatient(PatientRegistrationDto patientRegistrationDto) {
        Patient patient = new Patient();
        patient.setLogin(patientRegistrationDto.getLogin());
        patient.setPassword(patientRegistrationDto.getPassword());
        patient.setFullName(patientRegistrationDto.getFullName());
        patient.setAge(patientRegistrationDto.getAge());
        patient.setGender(patientRegistrationDto.getGender());
        patient.setHasInsurance(patientRegistrationDto.isHasInsurance());

        return patientRepository.save(patient);
    }

    @Override
    public List<MedicalRecord> getMedicalRecords(Long patientId) {
        return medicalRecordRepository.findByPatientId(Long.valueOf(patientId));
    }

    @Override
    public void scheduleAppointment(String patientId, AppointmentDto appointmentDto) {
        try {
            Patient patient = patientRepository.findById(Long.valueOf(patientId)).orElseThrow(() -> new IllegalArgumentException("Patient not found"));

            Appointment appointment = new Appointment();
            appointment.setDoctor(appointmentDto.getDoctorName());
            appointment.setPatient(patient);
            appointment.setAppointmentDateTime(appointmentDto.getAppointmentDateTime());

            appointment.setFree(patient.getFreeAppointments() > 0);
            System.out.println("scheduleAppointment"+patient.getFreeAppointments());
            appointmentRepository.save(appointment);

            if (appointment.isFree()) {
                deductFreeAppointment(Long.valueOf(patientId));
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Override
    public Patient getPatientById(Long patientId) {
        return patientRepository.findById(patientId).orElse(null);
    }

    @Override
    public List<Appointment> getAppointments(Long patientId) {
        return appointmentRepository.findByPatient_PatientId(patientId);
    }

    @Override
    public boolean isAppointmentFree(Long patientId, Long appointmentId) {
        Patient patient = patientRepository.findById(Long.valueOf(patientId)).orElseThrow(() -> new IllegalArgumentException("Patient not found"));

        // Check if the patient has free appointments
        return patient.getFreeAppointments() > 0;
    }

    @Override
    public void deductFreeAppointment(Long patientId) {
        Patient patient = patientRepository.findById(Long.valueOf(patientId)).orElseThrow(() -> new IllegalArgumentException("Patient not found"));

        // Deduct one free appointment
        if (patient.getFreeAppointments() > 0) {
            System.out.println(patient.getFreeAppointments() - 1);
            patient.setFreeAppointments(patient.getFreeAppointments() - 1);
        }

        // Save the updated patient entity
        patientRepository.save(patient);
    }


}
