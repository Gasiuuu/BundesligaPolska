package com.gasiuu.backend.services;

import com.gasiuu.backend.domain.dto.UserDto;
import com.gasiuu.backend.domain.entities.UserEntity;
import com.gasiuu.backend.repositories.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Optional;

@AllArgsConstructor
@Service
public class UserService {

    private UserRepository userRepository;

    private JWTUtils jwtUtils;

    private AuthenticationManager authenticationManager;

    private PasswordEncoder passwordEncoder;


    public UserDto register(UserDto registrationRequest) {
        UserDto resp = new UserDto();

        try {
            UserEntity userEntity = new UserEntity();
            userEntity.setEmail(registrationRequest.getEmail());
            userEntity.setCity(registrationRequest.getCity());
//            userEntity.setRole(registrationRequest.getRole());
            userEntity.setRole("USER");
            userEntity.setFirstName(registrationRequest.getFirstName());
            userEntity.setLastName(registrationRequest.getLastName());
            userEntity.setPassword(passwordEncoder.encode(registrationRequest.getPassword()));
            UserEntity userEntityResult = userRepository.save(userEntity);
            if (userEntityResult.getId() > 0) {
                resp.setUserEntity((userEntityResult));
                resp.setMessage("User Saved Successfully");
                resp.setStatusCode(200);
            }

        } catch (Exception e) {
            resp.setStatusCode(500);
            resp.setError(e.getMessage());
        }
        return resp;
    }

    public UserDto login(UserDto loginRequest) {

        UserDto response = new UserDto();
        try {
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));
            var user = userRepository.findByEmail(loginRequest.getEmail()).orElseThrow();
            var jwt = jwtUtils.generateToken(user);
            var refreshToken = jwtUtils.generateRefreshToken(new HashMap<>(), user);
            response.setStatusCode(200);
            response.setToken(jwt);
            response.setRole(user.getRole());
            response.setRefreshToken(refreshToken);
            response.setExpirationTime("24Hrs");
            response.setMessage("Successfully Logged In");
        } catch(Exception e) {
            response.setStatusCode(500);
            response.setMessage(e.getMessage());
        }
        return response;
    }

    public UserDto refreshToken(UserDto refreshTokenReqiest) {
        UserDto response = new UserDto();
        try {
            String email = jwtUtils.extractUsername(refreshTokenReqiest.getToken());
            UserEntity users = userRepository.findByEmail(email).orElseThrow();
            if (jwtUtils.isTokenValid(refreshTokenReqiest.getToken(), users)) {
                var jwt = jwtUtils.generateToken(users);
                response.setStatusCode(200);
                response.setToken(jwt);
                response.setRefreshToken(refreshTokenReqiest.getToken());
                response.setExpirationTime("24Hr");
                response.setMessage("Successfully Refreshed Token");
            }
            response.setStatusCode(200);
            return response;

        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage(e.getMessage());
            return response;
        }
    }

    public UserDto getAllUsers() {
        UserDto userDto = new UserDto();

        try {
            List<UserEntity> result = userRepository.findAll();
            if (!result.isEmpty()) {
                userDto.setUserEntityList(result);
                userDto.setStatusCode(200);
                userDto.setMessage("Successful");
            } else {
                userDto.setStatusCode(404);
                userDto.setMessage("No users found");
            }
            return userDto;
        } catch (Exception e) {
            userDto.setStatusCode(500);
            userDto.setMessage("Error occurred: " + e.getMessage());
            return userDto;
        }
    }

    public UserDto getUserById(Integer userId) {
        UserDto userDto = new UserDto();
        try {
            UserEntity usersById = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
            userDto.setUserEntity(usersById);
            userDto.setStatusCode(200);
            userDto.setMessage("Users with id '" + userId + "' found successfully");
        } catch(Exception e) {
            userDto.setStatusCode(500);
            userDto.setMessage("Error occurred: " + e.getMessage());
        }
        return userDto;
    }

    public UserDto deleteUser(Integer userId) {

        UserDto userDto = new UserDto();
        try {
            Optional<UserEntity> userOptional = userRepository.findById(userId);
            if(userOptional.isPresent()) {
                userRepository.deleteById(userId);
                userDto.setStatusCode(200);
                userDto.setMessage("User deleted successfully");
            } else {
                userDto.setStatusCode(404);
                userDto.setMessage("User not found to deletion");
            }
        } catch (Exception e) {
            userDto.setStatusCode(500);
            userDto.setMessage("Error occured while deleting user: " + e.getMessage());
        }
        return userDto;
    }

    public UserDto updateUser(Integer userId, UserEntity updatedUser) {
        UserDto userDto = new UserDto();
        try {
            Optional<UserEntity> userOptional = userRepository.findById(userId);
            if (userOptional.isPresent()) {
                UserEntity existingUser = userOptional.get();
                existingUser.setEmail(updatedUser.getEmail());
                existingUser.setFirstName(updatedUser.getFirstName());
                existingUser.setLastName(updatedUser.getLastName());
                existingUser.setCity(updatedUser.getCity());
                existingUser.setRole(updatedUser.getRole());

                // Check if password is present in the request
                if (updatedUser.getPassword() != null && !updatedUser.getPassword().isEmpty()) {
                    // Encode the password and update it
                    existingUser.setPassword(passwordEncoder.encode(updatedUser.getPassword()));
                }

                UserEntity savedUser = userRepository.save(existingUser);
                userDto.setUserEntity(savedUser);
                userDto.setStatusCode(200);
                userDto.setMessage("User updated successfully");
            } else {
                userDto.setStatusCode(404);
                userDto.setMessage("User not found for update");
            }
        } catch (Exception e) {
            userDto.setStatusCode(500);
            userDto.setMessage("Error occurred while updating user: " + e.getMessage());
        }
        return userDto;
    }

    public UserDto getMyInfo(String email) {
        UserDto userDto = new UserDto();
        try {
            Optional<UserEntity> userOptional = userRepository.findByEmail(email);
            if (userOptional.isPresent()) {
                userDto.setUserEntity(userOptional.get());
                userDto.setStatusCode(200);
                userDto.setMessage("successful");
            } else {
                userDto.setStatusCode(404);
                userDto.setMessage("User not found for update");
            }

        } catch (Exception e) {
            userDto.setStatusCode(500);
            userDto.setMessage("Error occurred while getting user info: " + e.getMessage());
        }
        return userDto;

    }

}
