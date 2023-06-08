package g2t1.corppass.models;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.TableGenerator;
import javax.persistence.UniqueConstraint;
import javax.validation.constraints.NotBlank;

@Entity
@Table(name = "system_settings", uniqueConstraints = {
		@UniqueConstraint(columnNames = "settingName")
})
public class SystemSetting {
	@TableGenerator(name = "System_Settings_Gen", initialValue = 2)
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO, generator = "System_Settings_Gen")
	private int id;

	@NotBlank
	private String settingName;
	private String value;

	protected SystemSetting() {
	}

	public SystemSetting(String settingName, String value) {
		this.settingName = settingName;
		this.value = value;
	}

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getValue() {
		return value;
	}

	public void setValue(String value) {
		this.value = value;
	}

	public String getSettingName() {
		return settingName;
	}

	public void setSettingName(String settingName) {
		this.settingName = settingName;
	}
}
