package g2t1.corppass.controllers;

import java.util.*;
import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import g2t1.corppass.models.*;
import g2t1.corppass.services.*;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
public class OutstandingFeeController {

    @Autowired
    OutstandingFeeService outstandingFeeService;
    @Autowired
    LoanService loanService;
    @Autowired
    UserService userService;
    @Autowired
    CorporatePassService corpassService;
    @Autowired
    EmailService outstandingFeeEmailService;
    @Autowired
    EmailLetterTemplateService emailTemplateService;

    // get all outstanding fee
    @GetMapping("/admin/outstandingfee/fetchOutstandingFeeList")
    public ResponseEntity<?> fetchOutstandingFeeList() {
        List<OutstandingFee> result = outstandingFeeService.fetchOutstandingFeeList();
        if (result.size() == 0) {
            Map<String, Object> map = new HashMap<String, Object>();
            map.put("message", "There are no outstanding fee");
            map.put("code", "404 error");
            return ResponseEntity
                    .badRequest()
                    .body(map);
        } else {
            for (int i = 0; i < result.size(); i++) {
                if (result.get(i) != null) {
                    Loan tmploan = loanService.getLoanByLoanID(result.get(i).getLoanId()).get();
                    User tmpUser = userService.loadUserByUsername(result.get(i).getUsername());
                    CorporatePass tmpCorpass = corpassService
                            .fetchSpecificCorporatePassById(result.get(i).getCorporatePassId());

                    result.get(i).setCorpass(tmpCorpass);
                    result.get(i).setLoan(tmploan);
                    result.get(i).setUser(tmpUser);
                }

            }

            Map<String, Object> map = new HashMap<String, Object>();
            map.put("data", result);
            map.put("message", "Retrieved all outstanding fee");
            map.put("code", "200 ok");
            return ResponseEntity.ok(map);
        }
    }

    // get all outstanding fee not cleared(dateCleared == null)
    @GetMapping("/admin/outstandingfee/fetchOutstandingFeeListNotCleared")
    public ResponseEntity<?> fetchOutstandingFeeListNotCleared() {
        List<OutstandingFee> result = outstandingFeeService.fetchOutstandingFeeListNotCleared();
        if (result.size() == 0) {
            Map<String, Object> map = new HashMap<String, Object>();
            map.put("message", "There are no outstanding fee");
            map.put("code", "404 error");
            return ResponseEntity
                    .badRequest()
                    .body(map);
        } else {
            for (int i = 0; i < result.size(); i++) {
                if (result.get(i) != null) {
                    Loan tmploan = loanService.getLoanByLoanID(result.get(i).getLoanId()).get();
                    User tmpUser = userService.loadUserByUsername(result.get(i).getUsername());
                    CorporatePass tmpCorpass = corpassService
                            .fetchSpecificCorporatePassById(result.get(i).getCorporatePassId());

                    result.get(i).setCorpass(tmpCorpass);
                    result.get(i).setLoan(tmploan);
                    result.get(i).setUser(tmpUser);
                }

            }

            Map<String, Object> map = new HashMap<String, Object>();
            map.put("data", result);
            map.put("message", "Retrieved all outstanding fee");
            map.put("code", "200 ok");
            return ResponseEntity.ok(map);
        }
    }

    // get specific outstanding fee
    @GetMapping("/admin/outstandingfee/getOutstandingFeeById/{id}")
    public ResponseEntity<?> getOutstandingFeeById(@PathVariable int id) {
        Optional<OutstandingFee> result = outstandingFeeService.fetchSpecificOutstandingFee(id);
        if (!result.isPresent()) {
            Map<String, Object> map = new HashMap<String, Object>();
            map.put("message", "Outstanding Fee Id does not exists");
            map.put("code", "404 error");
            return ResponseEntity
                    .badRequest()
                    .body(map);
        } else {
            Loan tmploan = loanService.getLoanByLoanID(result.get().getLoanId()).get();
            User tmpUser = userService.loadUserByUsername(result.get().getUsername());
            CorporatePass tmpCorpass = corpassService
                    .fetchSpecificCorporatePassById(result.get().getCorporatePassId());
            result.get().setCorpass(tmpCorpass);
            result.get().setLoan(tmploan);
            result.get().setUser(tmpUser);
        }

        Map<String, Object> map = new HashMap<String, Object>();
        map.put("data", result);
        map.put("message", "Retrieved outstanding fee with id: " + id);
        map.put("code", "200 ok");
        return ResponseEntity.ok(map);
    }

    // create outstanding fee
    @PostMapping("/admin/outstandingfee/createOutStandingFee")
    public ResponseEntity<?> createOutStandingFee(@Valid @RequestBody OutstandingFee outstandingFee) {
        Optional<OutstandingFee> duplicateOutstandingFee = outstandingFeeService
                .fetchSpecificOutstandingFee(outstandingFee.getOutstandingfeeID());
        if (duplicateOutstandingFee.isPresent()) {
            Map<String, Object> map = new HashMap<String, Object>();
            map.put("message", "Outstanding Fee already exists!");
            map.put("code", "404 error");
            return ResponseEntity
                    .badRequest()
                    .body(map);
        }
        try {
            OutstandingFee result = outstandingFeeService.processReportLost(outstandingFee);
            Map<String, Object> map = new HashMap<String, Object>();
            map.put("data", result);
            map.put("message",
                    "Outstanding Fee with id: " + outstandingFee.getOutstandingfeeID() + " created successfully");
            map.put("code", "200 ok");
            return ResponseEntity.ok(map);
        } catch (Exception e) {
            Map<String, Object> map = new HashMap<String, Object>();
            map.put("message", "Something went wrong, error: " + e.getMessage());
            map.put("code", "404 error");
            return ResponseEntity
                    .badRequest()
                    .body(map);
        }
    }

    // update outstanding fee
    @PutMapping("/admin/outstandingfee/updateOutstandFeeById/{id}")
    public ResponseEntity<?> updateOutstandFeeById(@PathVariable String id,
            @RequestBody OutstandingFee outstandingFee) {
        int outstandingFeeId = Integer.parseInt(id);
        Optional<OutstandingFee> existingFee = outstandingFeeService
                .fetchSpecificOutstandingFee(outstandingFeeId);
        if (!existingFee.isPresent()) {
            Map<String, Object> map = new HashMap<String, Object>();
            map.put("message", "Outstanding Fee does not exists!");
            map.put("code", "404 error");
            return ResponseEntity
                    .badRequest()
                    .body(map);
        }
        try {
            OutstandingFee result = outstandingFeeService.updateOutstandingFee(outstandingFee, outstandingFeeId);
            Map<String, Object> map = new HashMap<String, Object>();
            map.put("data", result);
            map.put("message", "Outstanding Fee with id: " + outstandingFeeId + " updated successfully");
            map.put("code", "200 ok");
            return ResponseEntity.ok(map);
        } catch (Exception e) {
            Map<String, Object> map = new HashMap<String, Object>();
            map.put("message", "Something went wrong, error: " + e.getMessage());
            map.put("code", "404 error");
            return ResponseEntity
                    .badRequest()
                    .body(map);
        }

    }

    // update outstanding fee's date cleared
    @PutMapping("/admin/outstandingfee/updateOutstandFeeDateClearedById/{id}")
    public ResponseEntity<?> updateOutstandFeeDateClearedById(@PathVariable String id) {
        int outstandingFeeId = Integer.parseInt(id);
        Optional<OutstandingFee> existingFee = outstandingFeeService
                .fetchSpecificOutstandingFee(outstandingFeeId);
        if (!existingFee.isPresent()) {
            Map<String, Object> map = new HashMap<String, Object>();
            map.put("message", "Outstanding Fee does not exists!");
            map.put("code", "404 error");
            return ResponseEntity
                    .badRequest()
                    .body(map);
        }
        try {
            Date now = new Date();
            OutstandingFee result = outstandingFeeService.updateOutstandingFeeDateCleared(now, outstandingFeeId);
            Map<String, Object> map = new HashMap<String, Object>();
            map.put("data", result);
            map.put("message", "Outstanding Fee with id: " + outstandingFeeId + " updated successfully");
            map.put("code", "200 ok");
            return ResponseEntity.ok(map);
        } catch (Exception e) {
            Map<String, Object> map = new HashMap<String, Object>();
            map.put("message", "Something went wrong, error: " + e.getMessage());
            map.put("code", "404 error");
            return ResponseEntity
                    .badRequest()
                    .body(map);
        }
    }

    // delete outstanding fee
    @DeleteMapping("/admin/outstandingfee/deleteOutstandingFeeById/{id}")
    public ResponseEntity<?> deleteOutstandingFeeById(@PathVariable String id) {
        int outstandingFeeId = Integer.parseInt(id);
        Optional<OutstandingFee> existingFee = outstandingFeeService
                .fetchSpecificOutstandingFee(outstandingFeeId);
        if (!existingFee.isPresent()) {
            Map<String, Object> map = new HashMap<String, Object>();
            map.put("message", "Outstanding Fee does not exists!");
            map.put("code", "404 error");
            return ResponseEntity
                    .badRequest()
                    .body(map);
        }
        try {
            outstandingFeeService.deleteOutstandingFeeById(outstandingFeeId);
            Map<String, Object> map = new HashMap<String, Object>();
            map.put("message", "Outstanding Fee with id: " + outstandingFeeId + " deleted successfully");
            map.put("code", "200 ok");
            return ResponseEntity.ok(map);
        } catch (Exception e) {
            Map<String, Object> map = new HashMap<String, Object>();
            map.put("message", "Something went wrong, error: " + e.getMessage());
            map.put("code", "404 error");
            return ResponseEntity
                    .badRequest()
                    .body(map);
        }

    }
}
