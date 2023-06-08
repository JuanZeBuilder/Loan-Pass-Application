package g2t1.corppass.repositories;

import java.util.*;

import org.springframework.data.repository.CrudRepository;

import g2t1.corppass.models.Role;
import g2t1.corppass.models.User;
import g2t1.corppass.projections.UserInfo;

public interface UserRepository extends CrudRepository<User, Integer> {

	void deleteByUsername(String username);

	List<UserInfo> findAllProjectedBy();

	List<User> findByRolesContaining(Role role);

	Optional<User> findByUsername(String username);

	Optional<User> findByVerificationToken(String verificationToken);

	boolean existsByUsername(String username);
}
