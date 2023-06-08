package g2t1.corppass.repositories;

import java.util.Optional;

import org.springframework.data.repository.CrudRepository;

import g2t1.corppass.models.*;

public interface RoleRepository extends CrudRepository<Role, Long> {
	Optional<Role> findByName(Role.ERole name);
}