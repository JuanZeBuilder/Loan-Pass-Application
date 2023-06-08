package g2t1.corppass.services;

import g2t1.corppass.models.OutstandingFee;
import java.util.*;

public interface OutstandingFeeService {
    // create outstanding fee
    OutstandingFee saveOutstandingFee(OutstandingFee outstandingFee);

    // get all outstanding fee
    List<OutstandingFee> fetchOutstandingFeeList();

    // get all outstanding fee by username
    List<OutstandingFee> fetchOutstandingFeeListByUsername(String username);

    // get specific outstanding fee
    Optional<OutstandingFee> fetchSpecificOutstandingFee(int outstandingFeeId);

    // update specific outstanding fee
    OutstandingFee updateOutstandingFee(OutstandingFee outstandingFee, int outstandingFeeId);

    // delete specific outstanding fee
    void deleteOutstandingFeeById(int outstandingFeeId);

    // get all the outstanding fee that are not cleared
    List<OutstandingFee> fetchOutstandingFeeListNotCleared();

    // update outstanding fee date cleared to today
    OutstandingFee updateOutstandingFeeDateCleared(Date dateCleared, int outstandingFeeId);

    // process outstanding fee
    OutstandingFee processReportLost(OutstandingFee outstandingFee) throws Exception;
}
