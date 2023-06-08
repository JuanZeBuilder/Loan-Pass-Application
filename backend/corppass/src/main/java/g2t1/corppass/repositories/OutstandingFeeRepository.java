package g2t1.corppass.repositories;

import org.springframework.stereotype.Repository;

import g2t1.corppass.models.*;

import org.springframework.data.repository.CrudRepository;

@Repository
public interface OutstandingFeeRepository extends CrudRepository<OutstandingFee, Integer> {

}
