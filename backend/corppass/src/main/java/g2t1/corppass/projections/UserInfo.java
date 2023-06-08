package g2t1.corppass.projections;

import java.util.Set;

import g2t1.corppass.models.Role;

// filters sensitive/unnecessary details of User eg. password
public interface UserInfo {
	int getId();

	String getUsername();

	String getFirstName();

	String getLastName();

	String getContactNumber();

	boolean getEnabled();

	Set<Role> getRoles();
}
