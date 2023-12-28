package com.example.demo.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.util.Base64;
import java.util.List;

@Entity
@Table(name = "patients")
public class Patient {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "patient_id")
    private Long patientId;

    @Column(unique = true)
    private String login;
    private String password;

    @Column(columnDefinition = "text")
    private String encryptedFullName;
    private int age;
    private String gender;
    private boolean hasInsurance;
    @Column(name = "free_appointments")
    private int freeAppointments = 10;
    public int getFreeAppointments() {
        return freeAppointments;
    }

    public void setFreeAppointments(int freeAppointments) {
        this.freeAppointments = freeAppointments;
    }

    @Transient
    private static final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
    @OneToMany(mappedBy = "patient", cascade = CascadeType.ALL)
    @JsonManagedReference
    private List<MedicalRecord> medicalRecords;

    public List<MedicalRecord> getMedicalRecords() {
        return medicalRecords;
    }


    public String getFullName() {
        if (this.encryptedFullName != null) {
            return decryptFullName();
        } else {
            return null;
        }
    }

    public void setFullName(String fullName) {
        this.encryptedFullName = encryptFullName(fullName);
    }

    private String encryptFullName(String fullName) {
        return Base64.getEncoder().encodeToString(fullName.getBytes());
    }

    private String decryptFullName() {
        return new String(Base64.getDecoder().decode(encryptedFullName));
    }
    public void setMedicalRecords(List<MedicalRecord> medicalRecords) {
        this.medicalRecords = medicalRecords;
    }

    public Long getPatientId() {
        return patientId;
    }

    public void setPatientId(Long patientId) {
        this.patientId = patientId;
    }

    public String getLogin() {
        return login;
    }

    public void setLogin(String login) {
        this.login = login;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = passwordEncoder.encode(password);
    }

    public int getAge() {
        return age;
    }

    public void setAge(int age) {
        this.age = age;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public boolean isHasInsurance() {
        return hasInsurance;
    }

    public void setHasInsurance(boolean hasInsurance) {
        this.hasInsurance = hasInsurance;
    }
}
