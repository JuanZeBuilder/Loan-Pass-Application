package g2t1.corppass.services;

import java.util.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import g2t1.corppass.models.*;
import g2t1.corppass.models.User.UserBuilder;
import g2t1.corppass.payloads.request.SignupRequest;
import g2t1.corppass.projections.UserInfo;
import g2t1.corppass.repositories.*;

@Service
@Transactional
public class UserServiceImpl implements UserService {
	@Autowired
	UserRepository userRepository;

	@Autowired
	RoleRepository roleRepository;

	@Autowired
	PasswordEncoder passwordEncoder;

	@Override
	public List<UserInfo> fetchUserList() {
		return userRepository.findAllProjectedBy();
	}

	@Override
	public List<String> fetchAdminEmails() {
		Role adminRole = roleRepository.findByName(Role.ERole.ROLE_ADMIN)
				.orElseThrow(() -> new RuntimeException("Error: Admin Role is not found."));
		List<User> admins = userRepository.findByRolesContaining(adminRole);
		List<String> adminEmails = new ArrayList<>();

		for (User user : admins) {
			adminEmails.add(user.getUsername());
		}

		return adminEmails;
	}

	@Override
	public boolean userExists(String username) {
		return userRepository.existsByUsername(username);
	}

	@Override
	public boolean userEnabled(String username) throws UsernameNotFoundException {
		return this.loadUserByUsername(username).getEnabled();
	}

	@Override
	public User loadUserByUsername(String username) throws UsernameNotFoundException {
		return userRepository.findByUsername(username)
				.orElseThrow(() -> new UsernameNotFoundException("User Not Found with username: " + username));
	}

	@Override
	public User createNewUser(SignupRequest signupRequest) {
		UserBuilder userBuilder = User.builder();
		User user = userBuilder.setUsername(signupRequest.getUsername())
				.setPassword(passwordEncoder.encode(signupRequest.getPassword()))
				.setFirstName(signupRequest.getFirstName())
				.setLastName(signupRequest.getLastName())
				.setContactNumber(signupRequest.getContactNumber())
				.build();

		Set<Role> roles = new HashSet<>();

		// set all new sign ups as a Borrower by default
		Role userRole = roleRepository.findByName(Role.ERole.ROLE_BORROWER)
				.orElseThrow(() -> new RuntimeException("Error: Role is not found."));
		roles.add(userRole);

		user.setRoles(roles);
		return userRepository.save(user);
	}

	@Override
	public void verifyUserByToken(String verificationToken) throws Exception {
		if (verificationToken == null) {
			throw new Exception("No Verification Token provided.");
		}

		User user = userRepository.findByVerificationToken(verificationToken)
				.orElseThrow(() -> new Exception("Verification Token invalid or already used."));

		user.setEnabled(true);
		user.setVerificationToken(null);
		userRepository.save(user);
	}

	@Override
	public void setUserRoles(String username, Set<String> strRoles) throws UsernameNotFoundException {
		User user = this.loadUserByUsername(username);

		Set<Role> roles = new HashSet<>();

		if (strRoles != null) {
			strRoles.forEach(role -> {
				switch (role) {
					case "admin":
						Role adminRole = roleRepository.findByName(Role.ERole.ROLE_ADMIN)
								.orElseThrow(() -> new RuntimeException("Error: Role is not found."));
						roles.add(adminRole);
						break;
					case "gop":
						Role gopRole = roleRepository.findByName(Role.ERole.ROLE_GOP)
								.orElseThrow(() -> new RuntimeException("Error: Role is not found."));
						roles.add(gopRole);
						break;
					case "borrower":
						Role borrowerRole = roleRepository.findByName(Role.ERole.ROLE_BORROWER)
								.orElseThrow(() -> new RuntimeException("Error: Role is not found."));
						roles.add(borrowerRole);
				}
			});
		}

		user.setRoles(roles);
	}

	@Override
	public void setEnabled(String username, boolean enabled) throws UsernameNotFoundException {
		User user = this.loadUserByUsername(username);

		user.setEnabled(enabled);
	}

	@Override
	public void deleteUser(String username) {
		userRepository.deleteByUsername(username);
	}
}
