package com.example.santhuongmai.service;

import com.example.santhuongmai.entity.User;
import com.example.santhuongmai.model.request.ChangePasswordRequest;
import com.example.santhuongmai.model.request.CreateUserRequest;
import com.example.santhuongmai.model.request.UpdateProfileRequest;

public interface UserService {
    
    void register(CreateUserRequest request);


    User getUserByUsername(String username);

    User updateUser(UpdateProfileRequest request);

    void changePassword(ChangePasswordRequest request);
    String verifyAccount(String email, String otp); 
    String regenerateOtp(String email); // Add this method to the interface

}
