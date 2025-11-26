package com.gasiuu.backend.services;

import com.gasiuu.backend.domain.dto.UserDto;
import com.gasiuu.backend.domain.entities.UserEntity;
import com.gasiuu.backend.repositories.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTests {

    @Mock
    private UserRepository userRepository;

    @Mock
    private JWTUtils jwtUtils;

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UserService userService;

    private UserEntity testUser;
    private UserDto testUserDto;

    @BeforeEach
    void setUp() {
        testUser = new UserEntity();
        testUser.setId(1);
        testUser.setEmail("test@example.com");
        testUser.setFirstName("Jan");
        testUser.setLastName("Kowalski");
        testUser.setCity("Warsaw");
        testUser.setRole("USER");
        testUser.setPassword("encodedPassword");

        testUserDto = new UserDto();
        testUserDto.setEmail("test@example.com");
        testUserDto.setFirstName("Jan");
        testUserDto.setLastName("Kowalski");
        testUserDto.setCity("Warsaw");
        testUserDto.setPassword("password123");
    }

    @Test
    void register_ShouldReturnSuccessResponse_WhenUserIsRegisteredSuccessfully() {
        // Given
        when(passwordEncoder.encode(anyString())).thenReturn("encodedPassword");
        when(userRepository.save(any(UserEntity.class))).thenReturn(testUser);

        // When
        UserDto result = userService.register(testUserDto);

        // Then
        assertEquals(200, result.getStatusCode());
        assertEquals("User Saved Successfully", result.getMessage());
        assertNotNull(result.getUserEntity());
        verify(passwordEncoder).encode("password123");
        verify(userRepository).save(any(UserEntity.class));
    }

    @Test
    void register_ShouldReturnErrorResponse_WhenExceptionOccurs() {
        // Given
        when(passwordEncoder.encode(anyString())).thenReturn("encodedPassword");
        when(userRepository.save(any(UserEntity.class))).thenThrow(new RuntimeException("Database error"));

        // When
        UserDto result = userService.register(testUserDto);

        // Then
        assertEquals(500, result.getStatusCode());
        assertNotNull(result.getError());
    }

    @Test
    void login_ShouldReturnSuccessResponse_WhenCredentialsAreValid() {
        // Given
        String token = "jwt-token";
        String refreshToken = "refresh-token";

        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenReturn(null);
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.of(testUser));
        when(jwtUtils.generateToken(any(UserEntity.class))).thenReturn(token);
        when(jwtUtils.generateRefreshToken(any(HashMap.class), any(UserEntity.class))).thenReturn(refreshToken);

        // When
        UserDto result = userService.login(testUserDto);

        // Then
        assertEquals(200, result.getStatusCode());
        assertEquals("Successfully Logged In", result.getMessage());
        assertEquals(token, result.getToken());
        assertEquals(refreshToken, result.getRefreshToken());
        assertEquals("USER", result.getRole());
        assertEquals("24Hrs", result.getExpirationTime());
    }

    @Test
    void login_ShouldReturnErrorResponse_WhenAuthenticationFails() {
        // Given
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenThrow(new RuntimeException("Invalid credentials"));

        // When
        UserDto result = userService.login(testUserDto);

        // Then
        assertEquals(500, result.getStatusCode());
        assertNotNull(result.getMessage());
    }

    @Test
    void refreshToken_ShouldReturnNewToken_WhenRefreshTokenIsValid() {
        // Given
        String newToken = "new-jwt-token";
        testUserDto.setToken("valid-refresh-token");

        when(jwtUtils.extractUsername(anyString())).thenReturn("test@example.com");
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.of(testUser));
        when(jwtUtils.isTokenValid(anyString(), any(UserEntity.class))).thenReturn(true);
        when(jwtUtils.generateToken(any(UserEntity.class))).thenReturn(newToken);

        // When
        UserDto result = userService.refreshToken(testUserDto);

        // Then
        assertEquals(200, result.getStatusCode());
        assertEquals(newToken, result.getToken());
        assertEquals("Successfully Refreshed Token", result.getMessage());
    }

    @Test
    void refreshToken_ShouldReturnErrorResponse_WhenExceptionOccurs() {
        // Given
        testUserDto.setToken("invalid-token");
        when(jwtUtils.extractUsername(anyString())).thenThrow(new RuntimeException("Invalid token"));

        // When
        UserDto result = userService.refreshToken(testUserDto);

        // Then
        assertEquals(500, result.getStatusCode());
        assertNotNull(result.getMessage());
    }

    @Test
    void getAllUsers_ShouldReturnUserList_WhenUsersExist() {
        // Given
        List<UserEntity> users = Arrays.asList(testUser);
        when(userRepository.findAll()).thenReturn(users);

        // When
        UserDto result = userService.getAllUsers();

        // Then
        assertEquals(200, result.getStatusCode());
        assertEquals("Successful", result.getMessage());
        assertNotNull(result.getUserEntityList());
        assertEquals(1, result.getUserEntityList().size());
    }

    @Test
    void getAllUsers_ShouldReturnNotFound_WhenNoUsersExist() {
        // Given
        when(userRepository.findAll()).thenReturn(Collections.emptyList());

        // When
        UserDto result = userService.getAllUsers();

        // Then
        assertEquals(404, result.getStatusCode());
        assertEquals("No users found", result.getMessage());
    }

    @Test
    void getUserById_ShouldReturnUser_WhenUserExists() {
        // Given
        when(userRepository.findById(1)).thenReturn(Optional.of(testUser));

        // When
        UserDto result = userService.getUserById(1);

        // Then
        assertEquals(200, result.getStatusCode());
        assertNotNull(result.getUserEntity());
        assertTrue(result.getMessage().contains("found successfully"));
    }

    @Test
    void getUserById_ShouldReturnError_WhenUserNotFound() {
        // Given
        when(userRepository.findById(1)).thenReturn(Optional.empty());

        // When
        UserDto result = userService.getUserById(1);

        // Then
        assertEquals(500, result.getStatusCode());
        assertTrue(result.getMessage().contains("Error occurred"));
    }

    @Test
    void deleteUser_ShouldReturnSuccess_WhenUserIsDeleted() {
        // Given
        when(userRepository.findById(1)).thenReturn(Optional.of(testUser));
        doNothing().when(userRepository).deleteById(1);

        // When
        UserDto result = userService.deleteUser(1);

        // Then
        assertEquals(200, result.getStatusCode());
        assertEquals("User deleted successfully", result.getMessage());
        verify(userRepository).deleteById(1);
    }

    @Test
    void deleteUser_ShouldReturnNotFound_WhenUserDoesNotExist() {
        // Given
        when(userRepository.findById(1)).thenReturn(Optional.empty());

        // When
        UserDto result = userService.deleteUser(1);

        // Then
        assertEquals(404, result.getStatusCode());
        assertEquals("User not found to deletion", result.getMessage());
        verify(userRepository, never()).deleteById(any());
    }

    @Test
    void updateUser_ShouldUpdateUser_WhenUserExists() {
        // Given
        UserEntity updatedUser = new UserEntity();
        updatedUser.setEmail("updated@example.com");
        updatedUser.setFirstName("Anna");
        updatedUser.setLastName("Nowak");
        updatedUser.setCity("Krakow");
        updatedUser.setRole("ADMIN");

        when(userRepository.findById(1)).thenReturn(Optional.of(testUser));
        when(userRepository.save(any(UserEntity.class))).thenReturn(testUser);

        // When
        UserDto result = userService.updateUser(1, updatedUser);

        // Then
        assertEquals(200, result.getStatusCode());
        assertEquals("User updated successfully", result.getMessage());
        verify(userRepository).save(any(UserEntity.class));
    }

    @Test
    void updateUser_ShouldEncodePassword_WhenPasswordIsProvided() {
        // Given
        UserEntity updatedUser = new UserEntity();
        updatedUser.setEmail("test@example.com");
        updatedUser.setFirstName("Jan");
        updatedUser.setLastName("Kowalski");
        updatedUser.setCity("Warsaw");
        updatedUser.setRole("USER");
        updatedUser.setPassword("newPassword");

        when(userRepository.findById(1)).thenReturn(Optional.of(testUser));
        when(passwordEncoder.encode("newPassword")).thenReturn("encodedNewPassword");
        when(userRepository.save(any(UserEntity.class))).thenReturn(testUser);

        // When
        UserDto result = userService.updateUser(1, updatedUser);

        // Then
        assertEquals(200, result.getStatusCode());
        verify(passwordEncoder).encode("newPassword");
        verify(userRepository).save(any(UserEntity.class));
    }

    @Test
    void updateUser_ShouldReturnNotFound_WhenUserDoesNotExist() {
        // Given
        UserEntity updatedUser = new UserEntity();
        when(userRepository.findById(1)).thenReturn(Optional.empty());

        // When
        UserDto result = userService.updateUser(1, updatedUser);

        // Then
        assertEquals(404, result.getStatusCode());
        assertEquals("User not found for update", result.getMessage());
        verify(userRepository, never()).save(any());
    }

    @Test
    void getMyInfo_ShouldReturnUserInfo_WhenUserExists() {
        // Given
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(testUser));

        // When
        UserDto result = userService.getMyInfo("test@example.com");

        // Then
        assertEquals(200, result.getStatusCode());
        assertEquals("successful", result.getMessage());
        assertNotNull(result.getUserEntity());
    }

    @Test
    void getMyInfo_ShouldReturnNotFound_WhenUserDoesNotExist() {
        // Given
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.empty());

        // When
        UserDto result = userService.getMyInfo("test@example.com");

        // Then
        assertEquals(404, result.getStatusCode());
        assertEquals("User not found for update", result.getMessage());
    }

    @Test
    void getMyInfo_ShouldReturnError_WhenExceptionOccurs() {
        // Given
        when(userRepository.findByEmail("test@example.com"))
                .thenThrow(new RuntimeException("Database error"));

        // When
        UserDto result = userService.getMyInfo("test@example.com");

        // Then
        assertEquals(500, result.getStatusCode());
        assertTrue(result.getMessage().contains("Error occurred"));
    }
}
