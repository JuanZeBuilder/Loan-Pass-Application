package g2t1.corppass.payloads.request;

import javax.validation.constraints.NotBlank;

public class UpdateSystemSettingRequest {
	@NotBlank
	private String settingName;
	private String value;

	public String getSettingName() {
		return settingName;
	}

	public void setSettingName(String settingName) {
		this.settingName = settingName;
	}

	public String getValue() {
		return value;
	}

	public void setValue(String value) {
		this.value = value;
	}
}
