package com.example.demo.dto;

public class PatientRegistrationDto {
    private String login;
    private String password;
    private String fullName;
    private int age;
    private String gender;
    private boolean hasInsurance;

    public PatientRegistrationDto() {}

    public PatientRegistrationDto(String login, String password, String fullName, int age, String gender, boolean hasInsurance) {
        this.login = login;
        this.password = password;
        this.fullName = fullName;
        this.age = age;
        this.gender = gender;
        this.hasInsurance = hasInsurance;
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
        this.password = password;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
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
