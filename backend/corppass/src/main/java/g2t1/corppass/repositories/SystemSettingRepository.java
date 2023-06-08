package g2t1.corppass.repositories;

import java.util.*;

import org.springframework.data.repository.CrudRepository;

import g2t1.corppass.models.*;

public interface SystemSettingRepository extends CrudRepository<SystemSetting, Integer> {
	List<SystemSetting> findAll();

	Optional<SystemSetting> findBySettingName(String settingName);
}
