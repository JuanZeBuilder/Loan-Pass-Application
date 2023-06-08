package g2t1.corppass.repositories;

import java.time.*;
import java.util.*;

import org.springframework.data.repository.CrudRepository;
import g2t1.corppass.models.Loan;

public interface LoanRepository extends CrudRepository<Loan, Integer> {

    List<Loan> findAllByEmail(String email);

    List<Loan> findByEmailAndLoanPassDate(String email, LocalDate loanPassDate);

    List<Loan> findByEmailAndLoanPassDateBetween(String email, LocalDate sDate, LocalDate eDate);

    int countByEmailAndLoanPassDateBetweenAndStatusNot(String email, LocalDate sDate, LocalDate eDate, String status);

    List<Loan> findByAttractionAndLoanPassDate(String attraction, LocalDate loanPassDate);

    int countByLoanPassDateBetween(LocalDate sDate, LocalDate eDate);

    List<Loan> findFirst30ByLoanPassDateBeforeOrderByLoanPassDateDesc(LocalDate localPassDate);

    int countByLoanPassDateBetweenOrderByLoanPassDateAsc(LocalDate sDate, LocalDate eDate);

    int countDistinctEmailByLoanPassDateBetween(LocalDate sDate, LocalDate eDate);

    int countByEmailAndLoanPassDateBetweenOrderByLoanPassDateAsc(String email,LocalDate sDate, LocalDate eDate);

    // Loan findFirstByLoanPassDateBeforeAndCorpassidOrderByLoanPassDateDesc(LocalDate localPassDate, String corppasID);
}

// monthly statistics (number of loans per month, number of borrowers per month)
// number of loans per employee (monthly, bi-annual, annual)