package g2t1.corppass.payloads.request;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;

public class SetUserEnabledRequest {
	@NotBlank(message = "Please provide a username.")
	@Email(message = "Username must be a valid email.")
	private String username;

	private boolean enabled;

	public boolean isEnabled() {
		return enabled;
	}

	public void setEnabled(boolean enabled) {
		this.enabled = enabled;
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}
}
