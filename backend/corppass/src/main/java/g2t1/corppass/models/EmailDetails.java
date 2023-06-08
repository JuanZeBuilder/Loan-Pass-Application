package g2t1.corppass.models;

/**
 * EmailDetails replaces attributes of the loan details into the email template
 */
public class EmailDetails {

    private String borrowerEmail;
    private String membershipName;
    private String membershipID;
    private String borrowerName;
    private String dateOfVisit;
    private String attractionName;
    private String cardType;


    public EmailDetails(String borrowerEmail, String membershipName, String membershipID, String borrowerName,
            String dateOfVisit, String attractionName, String cardType) {
        this.borrowerEmail = borrowerEmail;
        this.membershipName = membershipName;
        this.membershipID = membershipID;
        this.borrowerName = borrowerName;
        this.dateOfVisit = dateOfVisit;
        this.attractionName = attractionName;
        this.cardType = cardType;
    }

    @Override
    public String toString() {
        return "EmailLog [borrowerEmail=" + borrowerEmail + ", membershipName=" + membershipName + ", membershipID="
                + membershipID + ", borrowerName=" + borrowerName + ", dateOfVisit=" + dateOfVisit + ", attractionName="
                + attractionName + ", cardType=" + cardType + "]";
    }

    public String getMembershipID() {
        return membershipID;
    }
    public void setMembershipID(String membershipID) {
        this.membershipID = membershipID;
    }

    public String getBorrowerEmail() {
        return borrowerEmail;
    }

    public void setBorrowerEmail(String borrowerEmail) {
        this.borrowerEmail = borrowerEmail;
    }

    public String getBorrowerName() {
        return borrowerName;
    }

    public void setBorrowerName(String borrowerName) {
        this.borrowerName = borrowerName;
    }

    public String getDateOfVisit() {
        return dateOfVisit;
    }

    public void setDateOfVisit(String dateOfVisit) {
        this.dateOfVisit = dateOfVisit;
    }

    public String getAttractionName() {
        return attractionName;
    }

    public void setAttractionName(String attractionName) {
        this.attractionName = attractionName;
    }

    public String getMembershipName() {
        return membershipName;
    }

    public void setMembershipName(String membershipName) {
        this.membershipName = membershipName;
    }

    public String getCardType() {
        return cardType;
    }

    public void setCardType(String cardType) {
        this.cardType = cardType;
    }

}
