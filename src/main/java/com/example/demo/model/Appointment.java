package com.example.demo.model;

import jakarta.persistence.*;
import java.util.Base64;

@Entity
@Table(name = "appointments")
public class Appointment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String doctor;
    @ManyToOne
    @JoinColumn(name = "patient_id")
    private Patient patient;
    @Column(nullable = false, columnDefinition = "text")
    private String encryptedAppointmentDateTime;
    @Column(nullable = false)
    private boolean isFree;
    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public String getDoctor() {
        return doctor;
    }
    public void setDoctor(String doctor) {
        this.doctor = doctor;
    }
    public Patient getPatient() {
        return patient;
    }
    public void setPatient(Patient patient) {
        this.patient = patient;
    }
    public String getAppointmentDateTime() {
        return decryptAppointmentDateTime();
    }
    public void setAppointmentDateTime(String appointmentDateTime) {
        this.encryptedAppointmentDateTime = encryptAppointmentDateTime(appointmentDateTime);
    }
    private String encryptAppointmentDateTime(String appointmentDateTime) {
        return Base64.getEncoder().encodeToString(appointmentDateTime.getBytes());
    }
    private String decryptAppointmentDateTime() {
        return new String(Base64.getDecoder().decode(encryptedAppointmentDateTime));
    }
    public boolean isFree() {
        return isFree;
    }
    public void setFree(boolean free) {
        isFree = free;
    }
}