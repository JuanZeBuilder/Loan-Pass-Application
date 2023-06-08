package g2t1.corppass.payloads.request;

import javax.validation.constraints.NotBlank;

public class DeleteUserRequest {
	@NotBlank
	private String username;

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

}
