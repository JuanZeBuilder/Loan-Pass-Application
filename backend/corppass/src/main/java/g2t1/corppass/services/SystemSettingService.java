package g2t1.corppass.services;

import java.util.List;

import g2t1.corppass.models.SystemSetting;

public interface SystemSettingService {
	public List<SystemSetting> fetchSystemSettingsList();

	public void setSystemSetting(String settingName, String value);
}
