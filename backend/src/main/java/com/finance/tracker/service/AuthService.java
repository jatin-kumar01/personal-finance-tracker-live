package com.finance.tracker.service;

import com.finance.tracker.dto.AuthResponse;
import com.finance.tracker.dto.LoginRequest;
import com.finance.tracker.dto.RegisterRequest;
import com.finance.tracker.entity.User;
import com.finance.tracker.repository.UserRepository;
import com.finance.tracker.security.CustomUserDetails;
import com.finance.tracker.security.JwtService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       JwtService jwtService,
                       AuthenticationManager authenticationManager) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
    }

    public AuthResponse register(RegisterRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email is already registered: " + request.getEmail());
        }


        User user = User.builder()
                .name(request.getName().trim())
                .email(request.getEmail().trim().toLowerCase())
                .password(passwordEncoder.encode(request.getPassword()))
                .role("ROLE_USER")
                .build();


        User savedUser = userRepository.save(user);


        CustomUserDetails userDetails = new CustomUserDetails(savedUser);
        String jwtToken = jwtService.generateToken(userDetails);


        return AuthResponse.builder()
                .token(jwtToken)
                .type("Bearer")
                .userId(savedUser.getId())
                .email(savedUser.getEmail())
                .name(savedUser.getName())
                .build();
    }

    public AuthResponse login(LoginRequest request) {

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail().trim().toLowerCase(),
                        request.getPassword()
                )
        );


        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();


        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new BadCredentialsException("Invalid email or password"));


        String jwtToken = jwtService.generateToken(userDetails);


        return AuthResponse.builder()
                .token(jwtToken)
                .type("Bearer")
                .userId(user.getId())
                .email(user.getEmail())
                .name(user.getName())
                .build();
    }
}
