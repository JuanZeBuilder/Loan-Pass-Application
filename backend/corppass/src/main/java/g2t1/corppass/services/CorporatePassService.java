package g2t1.corppass.services;

import g2t1.corppass.models.CorporatePass;
import java.util.*;
import g2t1.corppass.payloads.request.*;

public interface CorporatePassService {
	
	/**
		* Create corporate pass
		* @param corporatePass takes in CorporatePass object
	*/
	CorporatePass saveCorporatePass(CorporatePass corporatePass);

	/**
		* create multiple passes with similar details
		* @param corporatePassesDetails takes in CorporatePassMassRequest object
	*/
	List<CorporatePass> massCreateCorporatePasses(CorporatePassMassRequest corporatePassesDetails);

	/**
		* get all corporate pass
	*/
	List<CorporatePass> fetchCorporatePassList();

	/**
		* get specific corporate pass by id
		* @param corporatePassId takes in corporate pass id in String
	*/
	CorporatePass fetchSpecificCorporatePassById(String corporatePassId);

	/**
		* get all corporate pass by membership name
		* @param membershipName takes in membership name in String
	*/
	List<CorporatePass> fetchSpecificCorporatePassByMembershipName(String membershipName);

	/**
		* update specific corporate pass
		* @param corporatePass takes in corporatePass object
		* @param corporatePassId takes in corporate pass id as String
	*/
	CorporatePass updateCorporatePass(CorporatePass corporatePass, String corporatePassId);

	/**
		* change corporate pass status to on loan
		* @param corporatePassId takes in corporate pass id as String
	*/
	CorporatePass updateCorporatePassToLoan(String corporatePassId);

	/**
		* change corporate pass status to available
		* @param corporatePassId takes in corporate pass id as String
	*/
	CorporatePass updateCorporatePassToAvailable(String corporatePassId);

	/**
		* change corporate pass status to on loan
		* @param corporatePassId takes in corporate pass id as String
		* @throws Exception
	*/
	CorporatePass updateCorporatePassToNonActive(String corporatePassId) throws Exception;

	/**
		* change corporate pass status to active
		* @param corporatePassId takes in corporate pass id as String
	*/
	CorporatePass updateCorporatePassToActive(String corporatePassId);

	/**
		* update multiple passes with same membership name
		* @param corporatePassId takes in corporate pass id as String
	*/
	List<CorporatePass> massUpdateCorporatePasses(String membershipName, Map<String, Object> newDetails);

	/**
		* delete specific corporate pass
		* @param corporatePassId takes in corporate pass id as String
	*/
	void deleteCorporatePassById(String corporatePassId);

	/**
		* delete all corporate pass by membership name
		* @param membershipName takes in membership name as String
	*/
	void deleteCorporatePassByMembershipName(String membershipName);

	/**
		* delete all corporate pass
	*/
	void deleteAllCorporatePass();

}
