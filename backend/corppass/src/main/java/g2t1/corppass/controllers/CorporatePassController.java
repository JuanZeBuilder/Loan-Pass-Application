package g2t1.corppass.controllers;

import java.util.*;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import g2t1.corppass.models.*;
import g2t1.corppass.payloads.request.*;
import g2t1.corppass.payloads.response.*;
import g2t1.corppass.services.CorporatePassService;


@CrossOrigin(origins="*", maxAge=3600)
@RestController
public class CorporatePassController {

    @Autowired
    CorporatePassService corporatePassService;

    //get all corporate passes
    @GetMapping("/api/pass/corporatepass")
    public ResponseEntity<?> fetchCorporatePassList(){
        List<CorporatePass> result = corporatePassService.fetchCorporatePassList();
        if (result.size() == 0){
            return ResponseEntity
            .badRequest()
            .body(new ApiResponse<>(404, "There are no corporate passes"));
        }
        else{
            return ResponseEntity.ok(new ApiResponse<>(200, "Retrieved all corporate passes", result));
        }
        
    }

    //get specific corporate pass by id
    @GetMapping("/api/pass/corporatepass/getbyid/{id}")
    public ResponseEntity<?> getbyid(@PathVariable String id){
        String corporatePassId = id;
        CorporatePass target = corporatePassService.fetchSpecificCorporatePassById(corporatePassId);
        if (target == null){
            return ResponseEntity
            .badRequest()
            .body(new ApiResponse<>(404, "Corporate pass does not exists"));
        }
        else{
            return ResponseEntity.ok(new ApiResponse<>(200, "Retrieved corporate pass with id: " + corporatePassId, target));
        }
 
    }

    //get all corporate pass by attraction
    @GetMapping("/api/pass/corporatepass/getallbymembershipname/{membershipName}")
    public ResponseEntity<?> getallbyattraction(@PathVariable String membershipName){
        List<CorporatePass> result = corporatePassService.fetchSpecificCorporatePassByMembershipName(membershipName);
        if (result.size()==0){
            return ResponseEntity
            .badRequest()
            .body(new ApiResponse<>(404, "There are no passes from " + membershipName));
        }
        else{
            return ResponseEntity.ok(new ApiResponse<>(200, "Retrieved all corporate pass for attraction: " + membershipName, result));
            
        }
 
    }
    
    //create corporate pass
    @PostMapping("/admin/api/pass/corporatepass")
    public ResponseEntity<?> create(@Valid @RequestBody CorporatePassRequest corporatePassesDetails){
        CorporatePass duplicatePass = corporatePassService.fetchSpecificCorporatePassById(corporatePassesDetails.getId());
        if (duplicatePass != null){
            return ResponseEntity
            .badRequest()
            .body(new ApiResponse<>(403, "Corporate Pass already exists!"));
        }
        try{
            CorporatePass temp = new CorporatePass( corporatePassesDetails.getId(),
                                                    corporatePassesDetails.getMembershipName(), 
                                                    corporatePassesDetails.getAttraction(), 
                                                    corporatePassesDetails.getType(),
                                                    corporatePassesDetails.getStatus(), 
                                                    Boolean.parseBoolean(corporatePassesDetails.getActive()), 
                                                    Double.parseDouble(corporatePassesDetails.getReplacementFee()), 
                                                    Long.parseLong(corporatePassesDetails.getBarcodeId()), 
                                                    corporatePassesDetails.getAddress(), 
                                                    corporatePassesDetails.getPostalCode(), 
                                                    corporatePassesDetails.getMembershipType());
            CorporatePass result = corporatePassService.saveCorporatePass(temp);
            return ResponseEntity.ok(new ApiResponse<>(200,"Corporate pass with id: " + temp.getId() + " created successfully", result));
        }
        catch(Exception e){
            return ResponseEntity
            .badRequest()
            .body(new ApiResponse<>(400, "Something went wrong, error: " +e.getMessage()));
        }
    }

    //create multiple corporate pass with similar details
    @PostMapping("/admin/api/pass/corporatepass/mass")
    public ResponseEntity<?> createMassCorporatePass(@Valid @RequestBody CorporatePassMassRequest corporatePassesDetails){
        try{
            List<CorporatePass> result = corporatePassService.massCreateCorporatePasses(corporatePassesDetails);
            return ResponseEntity.ok(new ApiResponse<>(200,"Mass creation of corporate passes complete", result));
        }
        catch(Exception e){
            return ResponseEntity
            .badRequest()
            .body(new ApiResponse<>(400, "Something went wrong, error: " +e.getMessage()));
        }
    }

    //update specific corporate pass
    @PutMapping("/admin/api/pass/corporatepass")
    public ResponseEntity<?> update(@RequestBody CorporatePassRequest corporatePassesDetails){
       
        CorporatePass existingPass = corporatePassService.fetchSpecificCorporatePassById(corporatePassesDetails.getId());
        if (existingPass == null){
            return ResponseEntity
            .badRequest()
            .body(new ApiResponse<>(404, "Corporate Pass does not exists!"));
        }
        try{
            String id = (Objects.nonNull(corporatePassesDetails.getId()) && !"".equalsIgnoreCase(corporatePassesDetails.getId()))? corporatePassesDetails.getId(): null;
            String membershipName = (Objects.nonNull(corporatePassesDetails.getMembershipName()) && !"".equalsIgnoreCase(corporatePassesDetails.getMembershipName()))? corporatePassesDetails.getMembershipName(): null;
            String attraction = (Objects.nonNull(corporatePassesDetails.getAttraction()) && !"".equalsIgnoreCase(corporatePassesDetails.getAttraction()))? corporatePassesDetails.getAttraction(): null;
            String type = (Objects.nonNull(corporatePassesDetails.getType()) && !"".equalsIgnoreCase(corporatePassesDetails.getType()))? corporatePassesDetails.getType(): null;
            String status = (Objects.nonNull(corporatePassesDetails.getStatus()) && !"".equalsIgnoreCase(corporatePassesDetails.getStatus()))? corporatePassesDetails.getStatus(): null;
            String active = (Objects.nonNull(corporatePassesDetails.getActive()) && !"".equalsIgnoreCase(corporatePassesDetails.getActive()))? corporatePassesDetails.getActive(): null;
            String replacementFee = (Objects.nonNull(corporatePassesDetails.getReplacementFee()) && !"".equalsIgnoreCase(corporatePassesDetails.getReplacementFee()))? corporatePassesDetails.getReplacementFee(): null;
            String barcodeId = (Objects.nonNull(corporatePassesDetails.getBarcodeId()) && !"".equalsIgnoreCase(corporatePassesDetails.getBarcodeId()))? corporatePassesDetails.getBarcodeId(): null;
            String address = (Objects.nonNull(corporatePassesDetails.getAddress()) && !"".equalsIgnoreCase(corporatePassesDetails.getAddress()))? corporatePassesDetails.getAddress(): null;
            String postalCode = (Objects.nonNull(corporatePassesDetails.getPostalCode()) && !"".equalsIgnoreCase(corporatePassesDetails.getPostalCode()))? corporatePassesDetails.getPostalCode(): null;
            String membershipType = (Objects.nonNull(corporatePassesDetails.getMembershipType()) && !"".equalsIgnoreCase(corporatePassesDetails.getMembershipType()))? corporatePassesDetails.getMembershipType(): null;

            CorporatePass temp = new CorporatePass( id,
                                                    membershipName, 
                                                    attraction, 
                                                    type,
                                                    status, 
                                                    Boolean.parseBoolean(active), 
                                                    Double.parseDouble(replacementFee), 
                                                    Long.parseLong(barcodeId), 
                                                    address, 
                                                    postalCode, 
                                                    membershipType
                                                    );
            CorporatePass result = corporatePassService.updateCorporatePass(temp, corporatePassesDetails.getId());
            return ResponseEntity.ok(new ApiResponse<>(200, "Corporate pass with id: " + corporatePassesDetails.getId()+ " updated successfully", result));
        }
        catch(Exception e){
            return ResponseEntity
            .badRequest()
            .body(new ApiResponse<>(400, "Something went wrong, error: " +e.getMessage()));
        }
        
    }

    //change corporate pass status to on loan
    @PutMapping("/api/pass/corporatepass/updatetoloan")
    // public ResponseEntity<?> updateToLoan(@RequestBody Map<String,String> object){
    public ResponseEntity<?> updateToLoan(@RequestBody CorporatePassRequest object){
       
        CorporatePass existingPass = corporatePassService.fetchSpecificCorporatePassById(object.getId());
        if (existingPass == null){
            return ResponseEntity
            .badRequest()
            .body(new ApiResponse<>(404, "Corporate Pass does not exists!"));
        }
        try{
            CorporatePass result = corporatePassService.updateCorporatePassToLoan(object.getId());
            return ResponseEntity.ok(new ApiResponse<>(200, "Corporate pass with id: " + object.getId() + " updated successfully", result));
        }
        catch(Exception e){
            return ResponseEntity
            .badRequest()
            .body(new ApiResponse<>(400, "Something went wrong, error: " +e.getMessage()));
        }
        
    }

    //change corporate pass status to available
    @PutMapping("/api/pass/corporatepass/updatetoavailable")
    public ResponseEntity<?> updateToAvailable(@RequestBody CorporatePassRequest object){
       
        CorporatePass existingPass = corporatePassService.fetchSpecificCorporatePassById(object.getId());
        if (existingPass == null){
            return ResponseEntity
            .badRequest()
            .body(new ApiResponse<>(404, "Corporate Pass does not exists!"));
        }
        try{
            CorporatePass result = corporatePassService.updateCorporatePassToAvailable(object.getId());
            return ResponseEntity.ok(new ApiResponse<>(200, "Corporate pass with id: " + object.getId() + " updated successfully", result));
        }
        catch(Exception e){
            return ResponseEntity
            .badRequest()
            .body(new ApiResponse<>(400, "Something went wrong, error: " + e.getMessage()));
        }
        
    }

    //change corporate pass status to available
    @PutMapping("/api/pass/corporatepass/updatetononactive")
    public ResponseEntity<?> updateCorporatePassToNonActive(@RequestBody CorporatePassRequest object){
       
        CorporatePass existingPass = corporatePassService.fetchSpecificCorporatePassById(object.getId());
        if (existingPass == null){
            return ResponseEntity
            .badRequest()
            .body(new ApiResponse<>(404, "Corporate Pass does not exists!"));
        }
        try{
            CorporatePass result = corporatePassService.updateCorporatePassToNonActive(object.getId());
            return ResponseEntity.ok(new ApiResponse<>(200, "Corporate pass with id: " + object.getId() + " updated successfully", result));
        }
        catch(Exception e){
            return ResponseEntity
            .badRequest()
            .body(new ApiResponse<>(400, "Something went wrong, error: " + e.getMessage()));
        }
        
    }

    //change corporate pass status to available
    @PutMapping("/api/pass/corporatepass/updatetoactive")
    public ResponseEntity<?> updateToActive(@RequestBody CorporatePassRequest object){
       
        CorporatePass existingPass = corporatePassService.fetchSpecificCorporatePassById(object.getId());
        if (existingPass == null){
            return ResponseEntity
            .badRequest()
            .body(new ApiResponse<>(404, "Corporate Pass does not exists!"));
        }
        try{
            CorporatePass result = corporatePassService.updateCorporatePassToActive(object.getId());
            return ResponseEntity.ok(new ApiResponse<>(200, "Corporate pass with id: " + object.getId() + " updated successfully", result));
        }
        catch(Exception e){
            return ResponseEntity
            .badRequest()
            .body(new ApiResponse<>(400, "Something went wrong, error: " + e.getMessage()));
        }
        
    }

    // update multiple passes with same membership name
    @PutMapping("/admin/api/pass/corporatepass/massupdatebymembershipname")
    public ResponseEntity<?> massUpdateByMembershipName(@RequestBody CorporatePassMassRequest object){
        String membershipName = (String)object.getMembershipName();
        Map<String,Object> newDetails = (Map<String,Object>)object.getNewDetails();
        try{
            List<CorporatePass> result = corporatePassService.massUpdateCorporatePasses(membershipName, newDetails);
            return ResponseEntity.ok(new ApiResponse<>(200, "Corporate passes with membership name: " + membershipName + " updated successfully", result));
        }
        catch(Exception e){
            return ResponseEntity
            .badRequest()
            .body(new ApiResponse<>(404, "Something went wrong, error: " + e.getMessage()));
        }
        
    }

    //delete specific corporate pass by id
    @DeleteMapping("/admin/api/pass/corporatepass/byid/{id}")
    public ResponseEntity<?> deleteById(@PathVariable String id){
        String corporatePassId = id; 
        CorporatePass existingPass = corporatePassService.fetchSpecificCorporatePassById(corporatePassId);
        if (existingPass == null){
            return ResponseEntity
            .badRequest()
            .body(new ApiResponse<>(404, "Corporate Pass does not exists!"));
        }
        try{
            corporatePassService.deleteCorporatePassById(corporatePassId);
            return ResponseEntity.ok(new ApiResponse<>(200, "Corporate pass with id: " + corporatePassId + " deleted successfully"));
        }
        catch(Exception e){
            return ResponseEntity
            .badRequest()
            .body(new ApiResponse<>(400, "Something went wrong, error: " +e.getMessage()));
        }
        
    }

    //delete all corporate pass by membership name
    @DeleteMapping("/admin/api/pass/corporatepass/bymembershipname/{membershipName}")
    public ResponseEntity<?> deleteByMembershipName(@PathVariable String membershipName){
        try{
            corporatePassService.deleteCorporatePassByMembershipName(membershipName);
            return ResponseEntity.ok(new ApiResponse<>(200, "Corporate passses with membership name: " + membershipName + " have been deleted successfully"));
        }
        catch(Exception e){
            return ResponseEntity
            .badRequest()
            .body(new ApiResponse<>(400, "Something went wrong, error: " + e.getMessage()));
        } 
    }

    //delete all corporate pass by membership name
    @DeleteMapping("/admin/api/pass/corporatepass/all")
    public ResponseEntity<?> deleteAllCorporatePass(){
        try{
            corporatePassService.deleteAllCorporatePass();
            return ResponseEntity.ok(new ApiResponse<>(200, "All corporate passses deleted successfully"));
        }
        catch(Exception e){
            return ResponseEntity
            .badRequest()
            .body(new ApiResponse<>(400, "Something went wrong, error: " +e.getMessage()));
        } 
    }
}
