package g2t1.corppass.controllers;

import java.util.*;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

import g2t1.corppass.payloads.request.*;
import g2t1.corppass.payloads.response.ApiResponse;
import g2t1.corppass.services.UserServiceImpl;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/admin/api/user")
public class UserController {
	@Autowired
	UserServiceImpl userService;

	@GetMapping
	public ResponseEntity<?> getUserList() {
		return ResponseEntity.ok(new ApiResponse<>(200, userService.fetchUserList()));
	}

	@DeleteMapping
	public ResponseEntity<?> deleteUser(@Valid @RequestBody DeleteUserRequest deleteUserRequest) {
		String username = deleteUserRequest.getUsername();
		userService.deleteUser(username);
		return ResponseEntity.ok(new ApiResponse<>(200, "User with username " + username + " deleted."));
	}

	@PutMapping("/enabled")
	public ResponseEntity<?> setUserEnabled(@Valid @RequestBody SetUserEnabledRequest setUserEnabledRequest) {
		String username = setUserEnabledRequest.getUsername();
		boolean enabled = setUserEnabledRequest.isEnabled();

		try {
			userService.setEnabled(username, enabled);
		} catch (UsernameNotFoundException e) {
			return ResponseEntity
					.badRequest()
					.body(new ApiResponse<>(400, "Error: User not found"));
		}

		return ResponseEntity
				.ok(new ApiResponse<>(200, "Enabled status for user " + username + " updated to: " + enabled));
	}

	@PutMapping("/role")
	public ResponseEntity<?> setUserRoles(@Valid @RequestBody SetRolesRequest setRolesRequest) {
		String username = setRolesRequest.getUsername();
		Set<String> roles = setRolesRequest.getRoles();

		try {
			userService.setUserRoles(username, roles);
		} catch (UsernameNotFoundException e) {
			return ResponseEntity
					.badRequest()
					.body(new ApiResponse<>(400, "Error: User not found"));
		}

		return ResponseEntity.ok(new ApiResponse<>(200, "Roles for user " + username + " updated to: " + roles));
	}
}
