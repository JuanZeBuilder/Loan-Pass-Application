package g2t1.corppass.payloads.request;

import javax.validation.constraints.*;

public class SignupRequest {
	@NotBlank(message = "Please provide a username.")
	@Email(message = "Username must be a valid email.")
	private String username;

	@NotBlank(message = "Please provide a password.")
	private String password;

	@NotBlank(message = "Please provide a first name.")
	private String firstName;

	private String lastName;

	@NotBlank(message = "Please provide a contact number.")
	private String contactNumber;

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public String getFirstName() {
		return firstName;
	}

	public void setFirstName(String firstName) {
		this.firstName = firstName;
	}

	public String getLastName() {
		return lastName;
	}

	public void setLastName(String lastName) {
		this.lastName = lastName;
	}

	public String getContactNumber() {
		return contactNumber;
	}

	public void setContactNumber(String contactNumber) {
		this.contactNumber = contactNumber;
	}
}
