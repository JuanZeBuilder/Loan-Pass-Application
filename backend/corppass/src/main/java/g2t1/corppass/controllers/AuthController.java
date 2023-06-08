package g2t1.corppass.controllers;

import java.util.*;
import java.util.stream.Collectors;

import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.context.request.WebRequest;

import g2t1.corppass.events.OnSignupEvent;
import g2t1.corppass.models.*;
import g2t1.corppass.payloads.request.*;
import g2t1.corppass.payloads.response.*;
import g2t1.corppass.security.jwt.JwtUtils;
import g2t1.corppass.security.services.UserDetailsImpl;
import g2t1.corppass.services.*;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
public class AuthController {

  @Autowired
  AuthenticationManager authenticationManager;

  @Autowired
  JwtUtils jwtUtils;

  @Autowired
  UserServiceImpl userService;

  @PostMapping("/signin")
  public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
    String username = loginRequest.getUsername();

    try {
      if (!userService.userEnabled(username)) {
        return ResponseEntity
            .badRequest()
            .body(new ApiResponse<>(400,
                "Error: User with username: " + username
                    + " is not enabled. Check if you have activated your account via the Email link, or speak to an Admin staff member."));
      }
    } catch (UsernameNotFoundException e) {
      ResponseEntity
          .badRequest()
          .body(new ApiResponse<>(400, "Error: No User found with username: " + username));
    }

    Authentication authentication = authenticationManager.authenticate(
        new UsernamePasswordAuthenticationToken(username, loginRequest.getPassword()));

    SecurityContextHolder.getContext().setAuthentication(authentication);
    String jwt = jwtUtils.generateJwtToken(authentication);

    UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
    List<String> roles = userDetails.getAuthorities().stream()
        .map(item -> item.getAuthority())
        .collect(Collectors.toList());

    User user = userService.loadUserByUsername(userDetails.getUsername());

    return ResponseEntity.ok(new JwtResponse(jwt, user.getId(), user.getFirstName(), user.getLastName(), userDetails.getUsername(), roles));
  }

  @Autowired
  ApplicationEventPublisher eventPublisher;

  @PostMapping("/signup")
  public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signupRequest, HttpServletRequest request) {
    if (userService.userExists(signupRequest.getUsername())) {
      return ResponseEntity
          .badRequest()
          .body(new ApiResponse<>(400, "Error: Username is already taken!"));
    }

    User newUser = userService.createNewUser(signupRequest);

    String appUrl = "http://" + request.getServerName() + ":" + request.getServerPort();
    eventPublisher.publishEvent(new OnSignupEvent(newUser, appUrl));

    return ResponseEntity.ok(new ApiResponse<>(200, "User registered, confirmation email sent."));
  }

  @GetMapping("/verify")
  public ResponseEntity<?> verifyUser(WebRequest request, @RequestParam("token") String verificationToken) {
    try {
      userService.verifyUserByToken(verificationToken);
      return ResponseEntity.ok(new ApiResponse<>(200, "User successfully enabled."));
    } catch (Exception e) {
      return ResponseEntity
          .badRequest()
          .body(new ApiResponse<>(400, "Error: Invalid verification token: " + e));
    }
  }
}
