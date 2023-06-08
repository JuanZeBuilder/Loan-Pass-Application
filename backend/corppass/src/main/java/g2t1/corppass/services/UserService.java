package g2t1.corppass.services;

import java.util.*;

import org.springframework.security.core.userdetails.UsernameNotFoundException;

import g2t1.corppass.models.User;
import g2t1.corppass.payloads.request.SignupRequest;
import g2t1.corppass.projections.UserInfo;

public interface UserService {
	public List<UserInfo> fetchUserList();

	public List<String> fetchAdminEmails();

	public boolean userExists(String username);

	public boolean userEnabled(String username) throws UsernameNotFoundException;

	public User loadUserByUsername(String username) throws UsernameNotFoundException;

	User createNewUser(SignupRequest signupRequest);

	public void verifyUserByToken(String verificationToken) throws Exception;

	public void setUserRoles(String username, Set<String> roles) throws UsernameNotFoundException;

	public void setEnabled(String username, boolean enabled);

	public void deleteUser(String username);
}
