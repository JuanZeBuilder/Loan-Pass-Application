package g2t1.corppass.models;

import java.util.*;

import javax.persistence.*;
import javax.validation.constraints.*;

@Entity
@Table(name = "users", uniqueConstraints = {
		@UniqueConstraint(columnNames = "username")
})
public class User {
	@TableGenerator(name = "User_Gen", initialValue = 2)
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO, generator = "User_Gen")
	private int id;

	@NotBlank
	@Email
	private String username;

	@NotBlank
	private String password;

	@NotBlank
	private String firstName;

	private String lastName;

	@Pattern(regexp = "(^$|[0-9]{8})")
	private String contactNumber;

	// true if User has been activated via Email link
	private boolean enabled;

	private String verificationToken;

	@ManyToMany(fetch = FetchType.LAZY)
	@JoinTable(name = "user_roles", joinColumns = @JoinColumn(name = "user_id"), inverseJoinColumns = @JoinColumn(name = "role_id"))
	private Set<Role> roles = new HashSet<>();

	protected User() {
	}

	private User(String username, String password, String firstName, String lastName, String contactNumber) {
		this.username = username;
		this.password = password;
		this.firstName = firstName;
		this.lastName = lastName;
		this.contactNumber = contactNumber;
		this.enabled = false;
	}

	@Override
	public String toString() {
		return "User [username=" + username + ", id=" + id + ", contactNumber=" + contactNumber + "]";
	}

	public int getId() {
		return id;
	}

	public String getUsername() {
		return username;
	}

	public String getPassword() {
		return password;
	}

	public Set<Role> getRoles() {
		return roles;
	}

	public void setRoles(Set<Role> roles) {
		this.roles = roles;
	}

	public String getFirstName() {
		return firstName;
	}

	public String getLastName() {
		return lastName;
	}

	public String getContactNumber() {
		return contactNumber;
	}

	public String getVerificationToken() {
		return verificationToken;
	}

	public void setVerificationToken(String verificationToken) {
		this.verificationToken = verificationToken;
	}

	public boolean getEnabled() {
		return enabled;
	}

	public void setEnabled(boolean enabled) {
		this.enabled = enabled;
	}

	public static UserBuilder builder() {
		return new UserBuilder();
	}

	public static class UserBuilder {
		@NotBlank
		@Email
		private String username;

		@NotBlank
		private String password;

		@NotBlank
		private String firstName;

		private String lastName;

		@NotBlank
		@Pattern(regexp = "(^$|[0-9]{10})")
		private String contactNumber;

		public UserBuilder setUsername(String username) {
			this.username = username;
			return this;
		}

		public UserBuilder setPassword(String password) {
			this.password = password;
			return this;
		}

		public UserBuilder setFirstName(String firstName) {
			this.firstName = firstName;
			return this;
		}

		public UserBuilder setLastName(String lastName) {
			this.lastName = lastName;
			return this;
		}

		public UserBuilder setContactNumber(String contactNumber) {
			this.contactNumber = contactNumber;
			return this;
		}

		public User build() {
			return new User(username, password, firstName, lastName, contactNumber);
		}
	}
}
