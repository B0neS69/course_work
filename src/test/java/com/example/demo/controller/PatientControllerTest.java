package com.example.demo.controller;

import com.example.demo.config.SecurityConfig;
import com.example.demo.dto.PatientRegistrationDto;
import com.example.demo.model.Patient;
import com.example.demo.repository.PatientRepository;
import com.example.demo.service.PatientService;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInfo;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import static org.mockito.ArgumentMatchers.anyString;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
@ExtendWith(SpringExtension.class)
@DisplayName("PatientController Tests")
@AutoConfigureMockMvc
@WebMvcTest(PatientController.class)
@Import(SecurityConfig.class)
public class PatientControllerTest {


    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private PatientService patientService;

    @MockBean
    private PatientRepository patientRepository;

    @Test
    void testLoginPatient_Success() throws Exception {
        String login = "testUser";
        String password = "testPassword";

        mockMvc.perform(post("/patient/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"login\":\"" + login + "\",\"password\":\"" + password + "\"}"))
                .andExpect(status().isUnauthorized()) // Очікуємо статус 401 (Unauthorized)
                .andExpect(content().json("{\"error\":\"Invalid login credentials\"}"));
    }

    @Test
    public void testLoginPatient_Failure() throws Exception {
        Mockito.when(patientRepository.findByLogin(anyString())).thenReturn(null);

        mockMvc.perform(MockMvcRequestBuilders.post("/patient/login")
                        .content("{\"login\":\"nonExistentUser\",\"password\":\"invalidPassword\"}")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.error").value("Invalid login credentials"));
    }

    @Test
    void testGetFullNameByUsername_Success() throws Exception {
        Patient patient = new Patient();
        patient.setLogin("testUser");
        patient.setFullName("Test User");

        Mockito.when(patientRepository.findByLogin(anyString())).thenReturn(patient);

        mockMvc.perform(MockMvcRequestBuilders.get("/patient/get-fullname")
                        .param("username", "testUser"))
                .andExpect(status().isOk())
                .andExpect(content().string("Test User"));  // Update this line with the decrypted full name
    }

    @Test
    public void testGetFullNameByUsername_NotFound() throws Exception {
        Mockito.when(patientRepository.findByLogin(anyString())).thenReturn(null);

        mockMvc.perform(MockMvcRequestBuilders.get("/patient/get-fullname")
                        .param("username", "nonExistentUser"))
                .andExpect(status().isNotFound());
    }

    @Test
    public void testGetPatientById_Success() throws Exception {
        Patient patient = new Patient();
        patient.setLogin("testUser");

        Mockito.when(patientService.getPatientById(Mockito.anyLong())).thenReturn(patient);

        mockMvc.perform(MockMvcRequestBuilders.get("/patient/123"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.login").value("testUser"));
    }

    @Test
    public void testGetPatientById_NotFound() throws Exception {
        Mockito.when(patientService.getPatientById(Mockito.anyLong())).thenReturn(null);

        mockMvc.perform(MockMvcRequestBuilders.get("/patient/456"))
                .andExpect(status().isNotFound());
    }

    @AfterEach
    public void afterEach(TestInfo testInfo) {
        System.out.println("Test execution for " + testInfo.getDisplayName() + " completed.");
    }

}

