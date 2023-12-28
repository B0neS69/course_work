package com.example.demo.repository;

import com.example.demo.model.Patient;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PatientRepository extends JpaRepository<Patient, Long> {
    Patient findByLoginAndPassword(String login, String password);
    Patient findByLogin(String login);
    boolean existsByLogin(String login);
}
