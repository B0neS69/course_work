package com.example.demo.service;

import com.example.demo.dto.PatientRegistrationDto;
import com.example.demo.model.Patient;
import com.example.demo.repository.PatientRepository;
import com.example.demo.service.impl.PatientServiceImpl;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.anyString;

@SpringBootTest
public class PatientServiceTest {

    @InjectMocks
    private PatientServiceImpl patientService;

    @Mock
    private PatientRepository patientRepository;

    @Test
    public void testRegisterPatient() {
        // Mocking
        PatientRegistrationDto registrationDto = new PatientRegistrationDto("testUser", "testPassword", "Test User", 25, "Male", true);
        Mockito.when(patientRepository.existsByLogin(anyString())).thenReturn(false);
        Mockito.when(patientRepository.save(Mockito.any())).thenReturn(new Patient()); // Mock the save operation

        // Testing the registration service method
        Patient registeredPatient = patientService.registerPatient(registrationDto);

        // Assertions
        assertEquals("testUser", registeredPatient.getLogin());
        assertEquals("Test User", registeredPatient.getFullName());
        // Add more assertions based on your requirements

        System.out.println("Test successful");  // Print success message to console
    }

    // Add more test methods for other service methods
}
