package g2t1.corppass.models;

import java.util.Date;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.Transient;

import org.springframework.lang.Nullable;

@Entity
@Table(name = "outstandingfee")
public class OutstandingFee {
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    private int outstandingfeeID;
    private String username;
    private String corporatePassId;
    private int loanId;
    private double amount;
    @Nullable
    private Date dateCleared;
    private Date dateReportLost;
    @Transient
    private User user;
    @Transient
    private Loan loan;
    @Transient
    private CorporatePass corpass;

    protected OutstandingFee() {
    }

    public OutstandingFee(int outstandingfeeID, String username, String corporatePassId, int loanId, double amount,
            Date dateReportLost, Date dateCleared) {
        this.outstandingfeeID = outstandingfeeID;
        this.username = username;
        this.corporatePassId = corporatePassId;
        this.loanId = loanId;
        this.amount = amount;
        this.dateReportLost = dateReportLost;
        this.dateCleared = dateCleared;
    }

    public OutstandingFee(String username, String corporatePassId, int loanId, double amount,
            Date dateReportLost, Date dateCleared) {
        this.username = username;
        this.corporatePassId = corporatePassId;
        this.loanId = loanId;
        this.amount = amount;
        this.dateReportLost = dateReportLost;
        this.dateCleared = dateCleared;
    }

    public OutstandingFee(String corporatePassId, int loanId) {
        this.corporatePassId = corporatePassId;
        this.loanId = loanId;
    }

    @Override
    public String toString() {
        return "OutstandingFee [outstandingfeeID=" + outstandingfeeID + ", username=" + username + ", corporatePassId="
                + corporatePassId + ", loanId=" + loanId + ", amount=" + amount + ", dateCleared=" + dateCleared
                + ", dateReportLost=" + dateReportLost + "]";
    }

    public void setOutstandingfeeID(int outstandingfeeID) {
        this.outstandingfeeID = outstandingfeeID;
    }

    public int getOutstandingfeeID() {
        return outstandingfeeID;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getCorporatePassId() {
        return corporatePassId;
    }

    public void setCorporatePassId(String corporatePassId) {
        this.corporatePassId = corporatePassId;
    }

    public int getLoanId() {
        return loanId;
    }

    public void setLoanId(int loanId) {
        this.loanId = loanId;
    }

    public Date getDateCleared() {
        return dateCleared;
    }

    public void setDateCleared(Date dateCleared) {
        this.dateCleared = dateCleared;
    }

    public Date getDateReportLost() {
        return dateReportLost;
    }

    public void setDateReportLost(Date dateReportLost) {
        this.dateReportLost = dateReportLost;
    }

    public double getAmount() {
        return amount;
    }

    public void setAmount(double amount) {
        this.amount = amount;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Loan getLoan() {
        return loan;
    }

    public void setLoan(Loan loan) {
        this.loan = loan;
    }

    public CorporatePass getCorpass() {
        return corpass;
    }

    public void setCorpass(CorporatePass corpass) {
        this.corpass = corpass;
    }

}
