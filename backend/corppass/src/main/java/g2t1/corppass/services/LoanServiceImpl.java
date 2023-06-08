package g2t1.corppass.services;

import g2t1.corppass.models.*;
import g2t1.corppass.repositories.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.*;
import java.util.*;

@Service
public class LoanServiceImpl implements LoanService {

  @Autowired
  private LoanRepository loanRepository;

  @Autowired
  private CorporatePassRepository corporatePassRepository;

  @Autowired
  private UserRepository userRepository;

  @Autowired
  private SystemSettingRepository systemSettingRepository;

  // CRUD
  @Override
  public Loan createLoan(Loan loan) {
    return loanRepository.save(loan);
  }

  @Override
  public List<Loan> getAllLoans() {
    return (List<Loan>) loanRepository.findAll();
  }

  @Override
  public Optional<Loan> getLoanByLoanID(Integer loanID) {
    return loanRepository.findById(loanID);
  }

  @Override
  public List<Loan> getLoanByEmail(String email) {
    return loanRepository.findAllByEmail(email);
  }

  @Override
  public Loan updateLoanPassDate(Loan loan, LocalDate loanPassDate) {
    LocalDateTime borrowDate = LocalDateTime.now();
    if (borrowDateIsValid(borrowDate, loanPassDate)) {
      loan.setLoanPassDate(loanPassDate);
      return loanRepository.save(loan);
    }
    return loan;
  }

  // Created by Chun Wang
  @Override
  public List<Loan> getAllLoansAfterTheDate(LocalDate date) {

    List<Loan> loanList = new ArrayList<>();
    List<Loan> returnList = new ArrayList<>();
    loanList = (List<Loan>) loanRepository.findAll();
    if (loanList == null) {
      return null;
    }

    for (int i = 0; i < loanList.size(); i++) {
      if (loanList.get(i).getLoanPassDate().isAfter(date)) {
        returnList.add(loanList.get(i));
      }
    }
    if (returnList.size() == 0) {
      return null;
    }
    return returnList;
  }

  @Override
  public Loan updateLoanStatus(Loan loan, String status) throws Exception {
    try {
      loan.setStatus(status);
      return loanRepository.save(loan);
    } catch (Exception e) {
      throw new Exception(e);
    }
  }

  @Override
  public void deleteLoanByLoanID(int loanID) {
    loanRepository.deleteById(loanID);
  }

  // Logic check/Data validation for create Loan

  @Override
  public boolean borrowDateIsValid(LocalDateTime borrowDate, LocalDate loanPassDate) {
    LocalDate sDate = borrowDate.toLocalDate().plusDays(1);
    LocalDate eDate = borrowDate.toLocalDate().plusWeeks(8);
    if (loanPassDate.isAfter(eDate) || loanPassDate.equals(sDate)) {
      return false;
    }
    return true;
  }

  @Override
  public boolean checkIfLoanLimitExceed(String email, LocalDate loanPassDate) {
    LocalDate sDate = loanPassDate.minusDays(loanPassDate.getDayOfMonth() - 1);
    LocalDate eDate = sDate.plusMonths(1).minusDays(1);
    SystemSetting loansPerMonth = systemSettingRepository.findBySettingName("loansPerMonth").get();
    int monthRestrictions = Integer.parseInt(loansPerMonth.getValue());
    int noOfLoan = loanRepository.countByEmailAndLoanPassDateBetweenAndStatusNot(email, sDate, eDate, "cancelled");
    // List<Loan> loanList = loanRepository.findByEmailAndLoanPassDateBetween(email, sDate, eDate);
    // for(Loan loan : loanList){
    //   if(loan.getStatus().equals("cancelled")){
    //     loanList.remove(loan);
    //   }
    // }
    // int noOfLoan = loanList.size();
    if (monthRestrictions - noOfLoan == 0) {
      return false;
    }
    return true;
  }

  @Override
  public boolean checkIfPassLimitExceed(int noOfPassNeeded) {
    SystemSetting loansPerMonth = systemSettingRepository.findBySettingName("passesPerLoan").get();
    int monthRestrictions = Integer.parseInt(loansPerMonth.getValue());
    if (noOfPassNeeded > monthRestrictions) {
      return false;
    }
    return true;
  }

  @Override
  public List<CorporatePass> getAvailableCorporatePass(String attraction, LocalDate loanPassDate) {
    List<CorporatePass> cpList = corporatePassRepository.findByAttraction(attraction);
    List<Loan> loanList = loanRepository.findByAttractionAndLoanPassDate(attraction, loanPassDate);
    
    // removal of lost cp passes
    for (CorporatePass cp : cpList){
      if(cp.getStatus().equals("lost")){
        cpList.remove(cp);
      }
    }

    if (loanList.isEmpty()) {
      return cpList;
    }

    for (Loan loan : loanList) {
      // if loan status is cancelled no need to remove corporate passes
      if(!loan.getStatus().equals("cancelled")){
        Set<CorporatePass> tempList = loan.getCorppassList();
        for (CorporatePass temp : tempList) {
          cpList.remove(temp);
        }
      }
    }

    return cpList;
  }

  @Override
  public List<Integer> getMonthlyLoanStatistics(int year) {
    List<Integer> result = new ArrayList<>();
    for(int i = 1; i < 13; i++){
      LocalDate sDate = LocalDate.of(year, i, 1);
      LocalDate eDate = sDate.plusMonths(1).minusDays(1);
      result.add(loanRepository.countByLoanPassDateBetweenOrderByLoanPassDateAsc(sDate,eDate));
    }
    return result;
  }

  @Override
  public List<Integer> getMonthlyBorrowerStatistics(int year) {
    List<Integer> result = new ArrayList<>();
    for(int i = 1; i < 13; i++){
      LocalDate sDate = LocalDate.of(year, i, 1);
      LocalDate eDate = sDate.plusMonths(1).minusDays(1);
      result.add(loanRepository.countDistinctEmailByLoanPassDateBetween(sDate,eDate));
    }
    return result;
  }

  @Override
  public Map<String, List<Integer>> getUserLoanRecord(String email, int year) {
    Map<String, List<Integer>> result = new HashMap<>();
    List<Integer> monthlyLoanList = new ArrayList<>();
    List<Integer> biAnnualLoanList = new ArrayList<>();
    List<Integer> annualLoanList = new ArrayList<>();
    int biannualsum = 0;
    // for monthly record
    for(int i = 1; i < 13; i++) {
      LocalDate sDate = LocalDate.of(year, i, 1);
      LocalDate eDate = sDate.plusMonths(1).minusDays(1);
      int monthlycount = loanRepository.countByEmailAndLoanPassDateBetweenOrderByLoanPassDateAsc(email, sDate, eDate);
      monthlyLoanList.add(monthlycount);
      biannualsum += monthlycount;
      // for biannualsum
      if(i == 6){
        biAnnualLoanList.add(biannualsum);
        biannualsum = 0;
      }
      if(i == 12){
        biAnnualLoanList.add(biannualsum);
        biannualsum = 0;
      }
    }

    // for annually
    int annualSum = monthlyLoanList.stream().mapToInt(Integer::intValue).sum();
    annualLoanList.add(annualSum);

    result.put("monthly", monthlyLoanList);
    result.put("biannually", biAnnualLoanList);
    result.put("annually", annualLoanList);
    
    return result;
  }

  @Override
  public Map<String, List<String>> getPreviousPassBorrower(Loan loan) {
    Map<String, List<String>> result = new HashMap<>();
    Set<CorporatePass> cpList = loan.getCorppassList();
    boolean check = true;
    for (CorporatePass cp : cpList){
      result.put(cp.getId(),null);
      List<Loan> loanList = loanRepository.findFirst30ByLoanPassDateBeforeOrderByLoanPassDateDesc(loan.getLoanPassDate());
      if (!loanList.isEmpty()){
        for(Loan tempLoan : loanList){
          Set<CorporatePass> tempCPList = tempLoan.getCorppassList();
          for(CorporatePass tempCP : tempCPList){
            if(tempCP.getId().equals(cp.getId())){
              Optional<User> tempUser = userRepository.findByUsername(tempLoan.getEmail());
              List<String> tempList = new ArrayList<>();
              tempList.add(tempLoan.getUsername());
              tempList.add(cp.getId());
              tempList.add(tempUser.get().getContactNumber());
              result.replace(cp.getId(), tempList);
              check = false;
            }
          } // tempCPList loop
          if(check == false){
            break;
          }
        } // loanList loop
        check = true;
      }
    }
    
    return result;
  }

}
