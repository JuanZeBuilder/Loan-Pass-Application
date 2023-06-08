package g2t1.corppass.services;

import java.time.*;
import java.util.*;

import g2t1.corppass.models.CorporatePass;
import g2t1.corppass.models.Loan;

public interface LoanService {

	// create Loan
	public Loan createLoan(Loan loan);

	// get all loans
	public List<Loan> getAllLoans();

	// get loan of staff by email
	public Optional<Loan> getLoanByLoanID(Integer id);

	// get loan of staff by email
	public List<Loan> getLoanByEmail(String email);

	// update specific loan's loanPassDate
	public Loan updateLoanPassDate(Loan loan, LocalDate loanPassDate);

	// update loan Status
	public Loan updateLoanStatus(Loan loan, String status) throws Exception;

	// delete specific corporate pass
	public void deleteLoanByLoanID(int loanID);

	public boolean borrowDateIsValid(LocalDateTime borrowDate, LocalDate loanPassDate);

	public boolean checkIfLoanLimitExceed(String email, LocalDate loanPassDate);

	public boolean checkIfPassLimitExceed(int noOfPassNeeded);

	public List<CorporatePass> getAvailableCorporatePass(String attraction, LocalDate loanPassDate);

	public Map<String, List<String>> getPreviousPassBorrower(Loan loan);

	public List<Integer> getMonthlyLoanStatistics(int year);

	public List<Integer> getMonthlyBorrowerStatistics(int year);

	public Map<String, List<Integer>> getUserLoanRecord(String email, int year);

	// Create by ChunWang for outstanding fee service
	public List<Loan> getAllLoansAfterTheDate(LocalDate date);
}