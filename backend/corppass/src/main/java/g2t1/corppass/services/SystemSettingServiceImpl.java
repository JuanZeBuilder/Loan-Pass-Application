package g2t1.corppass.services;

import java.util.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import g2t1.corppass.models.*;
import g2t1.corppass.repositories.SystemSettingRepository;

@Service
public class SystemSettingServiceImpl implements SystemSettingService {
	@Autowired
	SystemSettingRepository systemSettingsRepository;

	public List<SystemSetting> fetchSystemSettingsList() {
		return systemSettingsRepository.findAll();
	};

	public void setSystemSetting(String settingName, String value) {
		Optional<SystemSetting> result = systemSettingsRepository.findBySettingName(settingName);

		if (result.isPresent()) {
			SystemSetting setting = result.get();
			setting.setValue(value);
			systemSettingsRepository.save(setting);
		} else {
			systemSettingsRepository.save(new SystemSetting(settingName, value));
		}
	};
}
