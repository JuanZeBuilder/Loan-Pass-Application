package g2t1.corppass.models;

import java.time.*;
import java.util.*;
import javax.persistence.*;
import javax.validation.constraints.*;

@Entity
@Table(name = "loan")
public class Loan {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column
    private int loanID;

    @Email
    @Column
    private String email;

    @Column
    private String username;
    
    @Column
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "corppassIDLoanList", joinColumns = @JoinColumn(name = "loanID"), inverseJoinColumns = @JoinColumn(name = "corpassID"))
    private Set<CorporatePass> corppassList = new HashSet<>();

    @Column
    private String attraction;

    @Column
    private int numberOfPassesNeeded;

    @Column
    private LocalDate loanPassDate;

    @Column
    private LocalDateTime borrowDate;

    @Column
    private String status;

    protected Loan() {
    }

    public Loan(int loanID) {
        this.loanID = loanID;
    }

    public Loan(int loanID, String email, String username, String attraction, LocalDate loanPassDate, int numberOfPassesNeeded) {
        this.loanID = loanID;
        this.email = email;
        this.username = username;
        this.attraction = attraction;
        this.loanPassDate = loanPassDate;
        this.numberOfPassesNeeded = numberOfPassesNeeded;
    }

    @Override
    public String toString() {
        return "Loan [loanID=" + loanID + ", email=" + email + ", username=" + username + ", corppassList="
                + corppassList + ", attraction=" + attraction + ", numberOfPassesNeeded=" + numberOfPassesNeeded
                + ", loanPassDate=" + loanPassDate + ", borrowDate=" + borrowDate + ", status=" + status + "]";
    }

    public int getLoanID() {
        return loanID;
    }

    public String getEmail() {
        return email;
    }

    public String getUsername() {
        return username;
    }

    public int getNumberOfPassesNeeded() {
        return numberOfPassesNeeded;
    }

    public String getAttraction() {
        return attraction;
    }

    public LocalDate getLoanPassDate() {
        return loanPassDate;
    }

    public LocalDateTime getBorrowDate() {
        return borrowDate;
    }

    public String getStatus() {
        return status;
    }

    public Set<CorporatePass> getCorppassList() {
        return corppassList;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public void setCorppassList(Set<CorporatePass> corppassList) {
        this.corppassList = corppassList;
    }

    public void setAttraction(String attraction) {
        this.attraction = attraction;
    }

    public void setNumberOfPassesNeeded(int numberOfPassesNeeded) {
        this.numberOfPassesNeeded = numberOfPassesNeeded;
    }

    public void setLoanPassDate(LocalDate loanPassDate) {
        this.loanPassDate = loanPassDate;
    }

    public void setBorrowDate(LocalDateTime borrowDate) {
        this.borrowDate = borrowDate;
    }

    public void setStatus(String status) {
        this.status = status;
    }

}
