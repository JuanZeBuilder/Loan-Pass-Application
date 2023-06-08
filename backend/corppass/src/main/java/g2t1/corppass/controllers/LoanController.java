package g2t1.corppass.controllers;

import java.time.*;
import java.util.*;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import g2t1.corppass.models.*;
import g2t1.corppass.payloads.response.ApiResponse;
import g2t1.corppass.services.*;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api")
public class LoanController {

    @Autowired
    LoanService loanService;

    @Autowired
    EmailService emailService;

    @Autowired
    SchedulerService schedulerService;

    @Autowired
    CorporatePassService corporatePassService;

    // Get All Loan
    @GetMapping("/loan/get")
    public ResponseEntity<?> index() {
        List<Loan> loanList = loanService.getAllLoans();
        if (loanList.size() == 0) {
            return ResponseEntity
                    .badRequest()
                    .body(new ApiResponse<>(404, "There are no loan records in the database"));
        }
        return ResponseEntity.ok(new ApiResponse<>(200, "Retrieved all loan records in the database", loanList));
    }

    // Get Loan by loanID
    @GetMapping("/loan/getbyloanid/{loanID}")
    public ResponseEntity<?> getByLoanId(@PathVariable Integer loanID) {
        Optional<Loan> loanRecord = loanService.getLoanByLoanID(loanID);
        if (!loanRecord.isPresent()) {
            return ResponseEntity
                    .badRequest()
                    .body(new ApiResponse<>(404, "Loan record of id: " + loanID + " does not exists"));
        }
        return ResponseEntity.ok(new ApiResponse<>(200, "Retrieved loan record of id: " + loanID, loanRecord));
    }

    // Get All User's Loan by user's email (email)
    @GetMapping("/loan/getbyemail/{email}")
    public ResponseEntity<?> getAllUserLoan(@PathVariable String email) {
        List<Loan> loanRecord = loanService.getLoanByEmail(email);
        System.out.println(loanRecord);
        if (loanRecord.isEmpty()) {
            return ResponseEntity
                    .badRequest()
                    .body(new ApiResponse<>(404, "There are no loan history for " + email));
        }
        return ResponseEntity.ok(new ApiResponse<>(404, "Retrieved all the loan record of user: " + email, loanRecord));
    }

    @GetMapping("/loan/monthlyloanstatistics/{year}")
    public ResponseEntity<?> monthlyLoanStatistics(@PathVariable int year) {
        List<Integer> monthlyLoanStatistics = loanService.getMonthlyLoanStatistics(year);
        return ResponseEntity.ok(new ApiResponse<>(404, "Retrieved the monthly loan statistics of: " + year, monthlyLoanStatistics));
    }

    @GetMapping("/loan/monthlyborrowerstatistics/{year}")
    public ResponseEntity<?> monthlyBorrowerStatistics(@PathVariable int year) {
        List<Integer> monthlyBorrowerStatistics = loanService.getMonthlyBorrowerStatistics(year);
        return ResponseEntity.ok(new ApiResponse<>(404, "Retrieved the monthly borrower statistics of: " + year, monthlyBorrowerStatistics));
    }

    @GetMapping("/loan/userloanrecord")
    public ResponseEntity<?> employeeLoanPeriod(@RequestBody Map<String, String> body) {
        Map<String, List<Integer>> userLoanRecord  = loanService.getUserLoanRecord(body.get("email"), Integer.parseInt(body.get("year")));
        return ResponseEntity.ok(new ApiResponse<>(404, "Retrieved the user loan record count for monthly, biannually and annually", userLoanRecord));
    }

    @GetMapping("/loan/getpreviousborrower/{loanID}")
    public ResponseEntity<?> getPreviousBorrower(@PathVariable int loanID) {
        Optional<Loan> loanRecord = loanService.getLoanByLoanID(loanID);
        if (loanRecord.isEmpty()) {
            return ResponseEntity
                    .badRequest()
                    .body(new ApiResponse<>(404, "There are no loan history for " + loanID));
        }
        Map<String, List<String>> previousLoanRecord = loanService.getPreviousPassBorrower(loanRecord.get());
        return ResponseEntity.ok(new ApiResponse<>(404, "Retrieved the previous pass of: " + loanID, previousLoanRecord));
    }

    // Delete Loan by loanID
    @DeleteMapping("/loan/delete/{loanID}")
    public ResponseEntity<?> deleteById(@PathVariable int loanID) {
        Optional<Loan> loanRecord = loanService.getLoanByLoanID(loanID);
        if (!loanRecord.isPresent()) {
            return ResponseEntity
                    .badRequest()
                    .body(new ApiResponse<>(404, "Loan record does not exists!"));
        }
        try {
            loanService.deleteLoanByLoanID(loanID);
            return ResponseEntity
                    .ok(new ApiResponse<>(200, "Loan record of id: " + loanID + " is deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity
                    .badRequest()
                    .body(new ApiResponse<>(400, "Something went wrong, error: " + e.getMessage()));
        }
    }

    // Update Loan record date with loanID
    @PutMapping("/loan/updateloanpassdate")
    public ResponseEntity<?> updateLoanPassDate(@RequestBody Map<String, String> body) {
        Optional<Loan> loanRecord = loanService.getLoanByLoanID(Integer.parseInt(body.get("loanID")));
        if (!loanRecord.isPresent()) {
            return ResponseEntity
                    .badRequest()
                    .body(new ApiResponse<>(404, "Loan record does not exists!"));
        }
        try {
            Loan result = loanService.updateLoanPassDate(loanRecord.get(), LocalDate.parse(body.get("loanPassDate")));
            if (result != null) {
                // Send Email here to inform user loanPassDate has been changed
                Date bDate = Date.from(loanRecord.get().getLoanPassDate().atStartOfDay(ZoneId.systemDefault()).toInstant());
                Date aDate = Date.from(result.getLoanPassDate().atStartOfDay(ZoneId.systemDefault()).toInstant());
                // emailService.sendLoanChangeDateEmail(result.getEmail(),result.getUsername(), Integer.toString(loanRecord.get().getLoanID()), loanRecord.get().getLoanPassDate(), result.getLoanPassDate());
                emailService.sendLoanChangeDateEmail(result.getEmail(),result.getUsername(), Integer.toString(loanRecord.get().getLoanID()), bDate, aDate); 
                return ResponseEntity.ok(new ApiResponse<>(200,
                        "loan record of id " + result.getLoanID() + " is updated successfully", result));
            }
            
            return ResponseEntity
                    .badRequest()
                    .body(new ApiResponse<>(400, "loan pass date is too far or too near from date of borrowing",
                            result));
        } catch (Exception e) {
            return ResponseEntity
                    .badRequest()
                    .body(new ApiResponse<>(400, "Something went wrong, error: " + e.getMessage()));
        }
    }

    // Update Loan status with loanID
    @PutMapping("/loan/updateloanstatus")
    public ResponseEntity<?> updateLoanStatus(@RequestBody Map<String, String> body) {
        Optional<Loan> loanRecord = loanService.getLoanByLoanID(Integer.parseInt(body.get("loanID")));
        if (!loanRecord.isPresent()) {
            return ResponseEntity
                    .badRequest()
                    .body(new ApiResponse<>(404, "Loan record does not exists!"));
        }
        try {
            Loan result = loanService.updateLoanStatus(loanRecord.get(), body.get("status"));
            if(body.get("status").equals("cancelled")){
                // Send Email here to inform loan has been cancelled
                emailService.sendLoanCancelledEmail(loanRecord.get().getEmail(), loanRecord.get().getUsername(), Integer.toString(loanRecord.get().getLoanID()), loanRecord.get().getAttraction());
            }
            return ResponseEntity.ok(new ApiResponse<>(200,
                    "loan record of id " + result.getLoanID() + " is updated successfully", result));
        } catch (Exception e) {
            return ResponseEntity
                    .badRequest()
                    .body(new ApiResponse<>(400, "Something went wrong, error: " + e.getMessage()));
        }
    }

    @PutMapping("/loan/updatecardinssuance/{loanID}")
    public ResponseEntity<?> updateCardInssuance(@PathVariable int loanID) {
        Optional<Loan> loanRecord = loanService.getLoanByLoanID(loanID);
        // LocalDate tempDate = LocalDate.now();
        // Date date = new Date(tempDate.getYear(), tempDate.getMonthValue(), tempDate.getDayOfMonth());
        if (!loanRecord.isPresent()) {
            return ResponseEntity
                    .badRequest()
                    .body(new ApiResponse<>(404, "Loan record does not exists!"));
        }
        try {
            Loan result = loanService.updateLoanStatus(loanRecord.get(), "issued");
            for (CorporatePass cp : loanRecord.get().getCorppassList()) {
                if (cp.getType().equals("physical")) {
                    corporatePassService.updateCorporatePassToLoan(cp.getId());
                    emailService.sendPassCollectedEmail(loanRecord.get().getEmail(), loanRecord.get().getUsername(), cp.getId(), new Date());
                }
            }
            // Send Email here to inform user pass has been issue

            return ResponseEntity.ok(new ApiResponse<>(200,
                    "loan record of id " + result.getLoanID() + "corporate pass is updated successfully", result));
        } catch (Exception e) {
            return ResponseEntity
                    .badRequest()
                    .body(new ApiResponse<>(400, "Something went wrong, error: " + e.getMessage()));
        }
    }

    @PutMapping("/loan/returncardinssuance/{loanID}")
    public ResponseEntity<?> returnCardInssuance(@PathVariable int loanID) {
        Optional<Loan> loanRecord = loanService.getLoanByLoanID(loanID);
        if (!loanRecord.isPresent()) {
            return ResponseEntity
                    .badRequest()
                    .body(new ApiResponse<>(404, "Loan record does not exists!"));
        }
        try {
            Loan result = loanService.updateLoanStatus(loanRecord.get(), "returned");
            for (CorporatePass cp : loanRecord.get().getCorppassList()) {
                if (cp.getType().equals("physical")) {
                    corporatePassService.updateCorporatePassToAvailable(cp.getId());
                    // Send Email here to inform user pass has been returned
                    emailService.sendPassReturnedEmail(loanRecord.get().getEmail(),loanRecord.get().getUsername(), cp.getId(),new Date());
                }
            }
            return ResponseEntity.ok(new ApiResponse<>(200,
                    "loan record of id " + result.getLoanID() + " is updated successfully", result));
        } catch (Exception e) {
            return ResponseEntity
                    .badRequest()
                    .body(new ApiResponse<>(400, "Something went wrong, error: " + e.getMessage()));
        }
    }

    // Create loan pass
    @PostMapping("/loan/create")
    public ResponseEntity<?> create(@Valid @RequestBody Loan loan) {

        loan.setBorrowDate(LocalDateTime.now());

        if (!loanService.borrowDateIsValid(loan.getBorrowDate(), loan.getLoanPassDate())) {
            return ResponseEntity
                    .badRequest()
                    .body(new ApiResponse<>(404,
                            "Borrowing date is too far off from the Loan date" + loan.getLoanPassDate()));
        }

        if (!loanService.checkIfPassLimitExceed(loan.getNumberOfPassesNeeded())) {
            return ResponseEntity
                    .badRequest()
                    .body(new ApiResponse<>(404, "User exceeded the limit of borrowing Corporate Pass at a time"));
        }

        if (!loanService.checkIfLoanLimitExceed(loan.getEmail(), loan.getLoanPassDate())) {
            return ResponseEntity
                    .badRequest()
                    .body(new ApiResponse<>(404, "User exceeded the limit of borrowing Corporate Pass for the month of "
                            + loan.getLoanPassDate().getMonth()));
        }

        List<CorporatePass> cpList = loanService.getAvailableCorporatePass(loan.getAttraction(),
                loan.getLoanPassDate());

        // Check whether if enough pass is available for the desired loanPassDate for the chosen attraction
        if (cpList.isEmpty() || cpList.size() < loan.getNumberOfPassesNeeded()) {
            return ResponseEntity
                    .badRequest()
                    .body(new ApiResponse<>(404, "Not enough pass available on " + loan.getLoanPassDate()
                            + " for the attraction " + loan.getAttraction(), "noOfPassLeft: " + cpList.size()));
        }

        String status = "approved";
        // Adding of Corppass list to the corppassIDLoanList
        Set<CorporatePass> cpSet = new HashSet<>();
        for (CorporatePass cp : cpList) {
            // for setCorppassList
            cpSet.add(cp);
            if (cp.getType().equals("physical")) {
                status = "pending";
            }
            if (cpSet.size() >= loan.getNumberOfPassesNeeded()) {
                break;
            }
        }
        loan.setStatus(status);
        loan.setCorppassList(cpSet);

        try {
            Loan result = loanService.createLoan(loan);
            // Email Service
            for (CorporatePass cp : cpSet) {
                EmailDetails emailDetails = new EmailDetails(loan.getEmail(), cp.getMembershipName(), cp.getId(),
                        loan.getUsername(),
                        loan.getLoanPassDate().toString(), loan.getAttraction(), cp.getType());
                emailService.sendLoanSuccessEmail(emailDetails, cp, loan);
            }

            schedulerService.scheduleVisitReminderEmail(loan);
            schedulerService.schedulePassReturnCheck(loan);

            return ResponseEntity.ok(new ApiResponse<>(200,
                    "Loan record with id: " + result.getLoanID() + " created successfully", result));
        } catch (Exception e) {
            return ResponseEntity
                    .badRequest()
                    .body(new ApiResponse<>(400, "Something went wrong, error: " + e.getMessage()));
        }
    }

}
