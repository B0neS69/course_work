package com.example.demo.controller;

import com.example.demo.dto.AppointmentDto;
import com.example.demo.dto.PatientRegistrationDto;
import com.example.demo.model.Appointment;
import com.example.demo.model.MedicalRecord;
import com.example.demo.model.Patient;
import com.example.demo.repository.PatientRepository;
import com.example.demo.service.PatientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/patient")
@CrossOrigin(origins = "http://localhost:3000")
public class PatientController {
    private final PatientService patientService;
    private final PatientRepository patientRepository;
    private final PasswordEncoder passwordEncoder;
    @Autowired
    public PatientController(PatientService patientService, PatientRepository patientRepository,PasswordEncoder passwordEncoder) {
        this.patientService = patientService;
        this.patientRepository = patientRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/patient")
    public ResponseEntity<Map<String, String>> registerPatient(@RequestBody PatientRegistrationDto registrationDto) {
        System.out.println("Received Registration Data: " + registrationDto.toString());
        if (patientRepository.existsByLogin(registrationDto.getLogin())) {
            Map<String, String> responseMap = new HashMap<>();
            responseMap.put("error", "Login already taken");
            return ResponseEntity.status(400).body(responseMap);
        }

        patientService.registerPatient(registrationDto);
        Map<String, String> responseMap = new HashMap<>();
        responseMap.put("message", "Registration successful");
        return ResponseEntity.ok(responseMap);
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> loginPatient(@RequestBody PatientRegistrationDto registrationDto) {

        Patient patient = patientRepository.findByLogin(registrationDto.getLogin());

        if (patient != null && passwordEncoder.matches(registrationDto.getPassword(), patient.getPassword())) {

            Map<String, String> responseMap = new HashMap<>();
            responseMap.put("message", "Login successful");
            return ResponseEntity.ok(responseMap);
        } else {

            Map<String, String> responseMap = new HashMap<>();
            responseMap.put("error", "Invalid login credentials");
            return ResponseEntity.status(401).body(responseMap);
        }
    }
    @GetMapping("/get-patient-id")
    public ResponseEntity<Long> getPatientId(@RequestParam String username) {
        Patient patient = patientRepository.findByLogin(username);

        if (patient != null) {
            return ResponseEntity.ok(patient.getPatientId());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/get-fullname")
    public ResponseEntity<String> getFullNameByUsername(@RequestParam String username) {
        Optional<Patient> patientOptional = Optional.ofNullable(patientRepository.findByLogin(username));

        return patientOptional
                .map(patient -> ResponseEntity.ok(patient.getFullName()))
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
    @GetMapping("/{patientId}/medical-records")
    public ResponseEntity<List<MedicalRecord>> getMedicalRecords(@PathVariable String patientId) {
        List<MedicalRecord> medicalRecords = patientService.getMedicalRecords(Long.valueOf(patientId));
        System.out.println(medicalRecords.toString());
        return ResponseEntity.ok(medicalRecords);
    }

    @PostMapping("/{patientId}/schedule-appointment")
    public ResponseEntity<String> scheduleAppointment(
            @PathVariable String patientId,
            @RequestBody AppointmentDto appointmentDto) {
        try {
                patientService.scheduleAppointment(patientId, appointmentDto);
                return ResponseEntity.ok("Appointment scheduled successfully");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error scheduling appointment");
        }
    }

    @GetMapping("/{patientId}")
    public ResponseEntity<Patient> getPatientById(@PathVariable Long patientId) {
        Patient patient = patientService.getPatientById(patientId);
        if (patient != null) {
            return ResponseEntity.ok(patient);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/{patientId}/appointments")
    public ResponseEntity<List<Appointment>> getAppointments(@PathVariable String patientId) {
        try {
            List<Appointment> appointments = patientService.getAppointments(Long.valueOf(patientId));
            return ResponseEntity.ok(appointments);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(null);
        }
    }

    @GetMapping("/{patientId}/appointment/{appointmentId}/is-free")
    public ResponseEntity<Boolean> isAppointmentFree(
            @PathVariable String patientId,
            @PathVariable String appointmentId) {
        try {
            boolean isFree = patientService.isAppointmentFree(Long.valueOf(patientId), Long.valueOf(appointmentId));
            return ResponseEntity.ok(isFree);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(null);
        }
    }

}
