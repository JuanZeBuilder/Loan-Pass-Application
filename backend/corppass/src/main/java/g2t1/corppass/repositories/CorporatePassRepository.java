package g2t1.corppass.repositories;

import java.util.*;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.*;
import g2t1.corppass.models.*;

@Repository
public interface CorporatePassRepository extends CrudRepository<CorporatePass, String> {
    Optional<CorporatePass> findById(String id);

    List<CorporatePass> findByAttraction(String attraction);

    List<CorporatePass> findByMembershipName(String membershipName);

    boolean existsById(String id);

    long deleteByMembershipName(String membershipName);
}
