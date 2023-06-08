package g2t1.corppass.services;

import g2t1.corppass.models.*;
import g2t1.corppass.repositories.CorporatePassRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

import javax.transaction.Transactional;

import g2t1.corppass.payloads.request.*;
 
import java.time.LocalDate;  

@Service
public class CorporatePassServiceImpl implements CorporatePassService {
    @Autowired
    private CorporatePassRepository corporatePassRepository;
    @Autowired
    private LoanService loanService;

    // create corporate pass
    @Override
    public CorporatePass saveCorporatePass(CorporatePass corporatePass){
        return corporatePassRepository.save(corporatePass);
    }

    // create multiple passes with similar details
    @Override
    public List<CorporatePass> massCreateCorporatePasses(CorporatePassMassRequest corporatePassesDetails){
        List<CorporatePass> output = new ArrayList<CorporatePass>();
        String[] ids = corporatePassesDetails.getIds();
        String membershipName = corporatePassesDetails.getMembershipName();
        String attraction = corporatePassesDetails.getAttraction();
        String[] types = corporatePassesDetails.getTypes();
        String status = corporatePassesDetails.getStatus();
        Boolean active = Boolean.parseBoolean(corporatePassesDetails.getActive());
        Double replacementFee = Double.parseDouble(corporatePassesDetails.getReplacementFee());
        Long[] barcodeIds = corporatePassesDetails.getBarcodeIds();
        String address = corporatePassesDetails.getAddress();
        String postalCode = corporatePassesDetails.getPostalCode();
        String membershipType = corporatePassesDetails.getMembershipType();
        
        for (int i=0; i<ids.length; i++){
            String id = ids[i];
            if (corporatePassRepository.existsById(id)) {
                output.add(null);
                continue;
            }
            if (!types[i].equals("physical")) {
                replacementFee = 0.0;
            }
            CorporatePass corpPass = new CorporatePass(id, membershipName, attraction, types[i], status, active, replacementFee, barcodeIds[i], address, postalCode, membershipType);
            corporatePassRepository.save(corpPass);
            output.add(corpPass);
        }
        return output;
    };

    // get all corporate pass
    @Override
    public List<CorporatePass> fetchCorporatePassList(){
        return (List<CorporatePass>)corporatePassRepository.findAll();
    }

    // get specific corporate pass by id
    @Override
    public CorporatePass fetchSpecificCorporatePassById(String corporatePassId){
        Optional<CorporatePass> pass = corporatePassRepository.findById(corporatePassId);
        return pass.orElse(null);
    };

    @Override
    // get all corporate pass by attraction
    public List<CorporatePass> fetchSpecificCorporatePassByMembershipName(String membershipName){
        return corporatePassRepository.findByMembershipName(membershipName);
    };

    //update specific corporate pass
    @Override
    public CorporatePass updateCorporatePass(CorporatePass corporatePass, String corporatePassId){
        CorporatePass existingCorporatePass = fetchSpecificCorporatePassById(corporatePassId);
        if (existingCorporatePass == null){
            return null;
        }
        if (Objects.nonNull(corporatePass.getMembershipName()) && !"".equalsIgnoreCase(corporatePass.getMembershipName())){
            existingCorporatePass.setMembershipName(corporatePass.getMembershipName());
        }
        if (Objects.nonNull(corporatePass.getAttraction()) && !"".equalsIgnoreCase(corporatePass.getAttraction())){
            existingCorporatePass.setAttraction(corporatePass.getAttraction());
        }
        if (Objects.nonNull(corporatePass.getType()) && !"".equalsIgnoreCase(corporatePass.getType())){
            existingCorporatePass.setType(corporatePass.getType());
        }
        if (Objects.nonNull(corporatePass.getStatus()) && !"".equalsIgnoreCase(corporatePass.getStatus())){
            existingCorporatePass.setStatus(corporatePass.getStatus());
        }
        if (Objects.nonNull(corporatePass.getActive())){
            System.out.println(corporatePass.getActive());
            existingCorporatePass.setActive(corporatePass.getActive());
        }
        if (Objects.nonNull(corporatePass.getReplacementFee())){
            existingCorporatePass.setReplacementFee(corporatePass.getReplacementFee());
        }
        if (Objects.nonNull(corporatePass.getBarcodeId())){
            existingCorporatePass.setBarcodeId(corporatePass.getBarcodeId());
        }
        if (Objects.nonNull(corporatePass.getAddress()) && !"".equalsIgnoreCase(corporatePass.getAddress())){
            existingCorporatePass.setAddress(corporatePass.getAddress());
        }
        if (Objects.nonNull(corporatePass.getPostalCode()) && !"".equalsIgnoreCase(corporatePass.getPostalCode())){
            existingCorporatePass.setPostalCode(corporatePass.getPostalCode());
        }
        if (Objects.nonNull(corporatePass.getMembershipType()) && !"".equalsIgnoreCase(corporatePass.getMembershipType())){
            existingCorporatePass.setMembershipType(corporatePass.getMembershipType());
        }

        return corporatePassRepository.save(existingCorporatePass);
    }

    // update multiple passes with same membership name
    @Override
    public List<CorporatePass> massUpdateCorporatePasses(String membershipName, Map<String,Object> newDetails){
        List<CorporatePass> passes = fetchSpecificCorporatePassByMembershipName(membershipName);
        for (CorporatePass pass: passes){
            for(String attr : newDetails.keySet()){
                if (attr.equals("membershipName")){
                    pass.setMembershipName((String)newDetails.get(attr));
                }
                else if (attr.equals("attraction")){
                    pass.setAttraction((String)newDetails.get(attr));
                }
                else if (attr.equals("type")){
                    pass.setType((String)newDetails.get(attr));
                }
                else if (attr.equals("status")){
                    pass.setStatus((String)newDetails.get(attr));
                }
                else if (attr.equals("active")){
                    pass.setActive(Boolean.parseBoolean((String)newDetails.get(attr)));
                }
                else if (attr.equals("replacementFee")){
                    pass.setReplacementFee(Double.parseDouble((String)newDetails.get(attr)));
                }
                else if (attr.equals("barcodeId")){
                    pass.setBarcodeId((Long)newDetails.get(attr));
                }
                else if (attr.equals("address")){
                    pass.setAddress((String)newDetails.get(attr));
                }
                else if (attr.equals("postalCode")){
                    pass.setPostalCode((String)newDetails.get(attr));
                }
                else if (attr.equals("membershipType")){
                    pass.setMembershipType((String)newDetails.get(attr));
                }
            }
            corporatePassRepository.save(pass);
        }
        return passes;
    };

    //change corporate pass status to on loan
    @Override
    public CorporatePass updateCorporatePassToLoan(String corporatePassId){
        CorporatePass existingCorporatePass = fetchSpecificCorporatePassById(corporatePassId);
        if(existingCorporatePass.getStatus().equals("on loan")){
            throw new RuntimeException("Corporate pass with id "+ corporatePassId + " is already on loan");

        }         
        existingCorporatePass.setStatus("on loan");
        return corporatePassRepository.save(existingCorporatePass);
        
    };

    //change corporate pass status to available
    @Override
    public CorporatePass updateCorporatePassToAvailable(String corporatePassId){
        CorporatePass existingCorporatePass = fetchSpecificCorporatePassById(corporatePassId);
        if(existingCorporatePass.getStatus().equals("available")){
            throw new RuntimeException("Corporate pass with id "+ corporatePassId + " is already available");

        }         
        existingCorporatePass.setStatus("available");
        return corporatePassRepository.save(existingCorporatePass);
        
    };

    //change corporate pass status to on loan
    @Override
    public CorporatePass updateCorporatePassToNonActive(String corporatePassId) throws Exception{
        List<Loan> allLoans =  loanService.getAllLoans();
        LocalDate today = LocalDate.now();
        for (Loan loan: allLoans){
            Set<CorporatePass> passes = loan.getCorppassList();
            boolean affected = false;
            for (CorporatePass pass : passes){
                if (pass.getId().equals(corporatePassId)){
                    affected = true;
                }
            }
            if (affected){
                LocalDate date = loan.getLoanPassDate();
                if (date.isAfter(today)){
                    throw new Exception("There is an existing loan going on.");
                }
            }
            
        }
        CorporatePass target = fetchSpecificCorporatePassById(corporatePassId);
        target.setActive(false);
        return corporatePassRepository.save(target);
    };

    //change corporate pass status to on loan
    @Override
    public CorporatePass updateCorporatePassToActive(String corporatePassId){
        CorporatePass existingCorporatePass = fetchSpecificCorporatePassById(corporatePassId);
        if(existingCorporatePass.getActive() == true){
            throw new RuntimeException("Corporate pass with id "+ corporatePassId + " is already active");

        }         
        existingCorporatePass.setActive(true);;
        return corporatePassRepository.save(existingCorporatePass);
    };

    // delete specific corporate pass
    @Override
    public void deleteCorporatePassById(String corporatePassId){
        corporatePassRepository.deleteById(corporatePassId);
    }

    //delete all corporate pass by membership name
    @Override
    @Transactional
    public void deleteCorporatePassByMembershipName(String membershipName){
        corporatePassRepository.deleteByMembershipName(membershipName);
    };

    //delete all corporate pass
    @Override
    public void deleteAllCorporatePass(){
        corporatePassRepository.deleteAll();
    };
}
