package g2t1.corppass.payloads.request;

public class CorporatePassRequest {
    private String id;
    private String membershipName;
    private String attraction;
    private String type;
    private String status;
    private String active;
    private String replacementFee;
    private String barcodeId;
    private String address;
    private String postalCode;
    private String membershipType;

    public String getId() {
        return id;
    }
    public void setId(String id) {
        this.id = id;
    }
    public String getMembershipName() {
        return membershipName;
    }
    public void setMembershipName(String membershipName) {
        this.membershipName = membershipName;
    }
    public String getAttraction() {
        return attraction;
    }
    public void setAttraction(String attraction) {
        this.attraction = attraction;
    }
    public String getType() {
        return type;
    }
    public void setType(String type) {
        this.type = type;
    }
    public String getStatus() {
        return status;
    }
    public void setStatus(String status) {
        this.status = status;
    }
    public String getActive() {
        return active;
    }
    public void setActive(String active) {
        this.active = active;
    }
    public String getReplacementFee() {
        return replacementFee;
    }
    public void setReplacementFee(String replacementFee) {
        this.replacementFee = replacementFee;
    }
    public String getBarcodeId() {
        return barcodeId;
    }
    public void setBarcodeId(String barcodeId) {
        this.barcodeId = barcodeId;
    }
    public String getAddress() {
        return address;
    }
    public void setAddress(String address) {
        this.address = address;
    }
    public String getPostalCode() {
        return postalCode;
    }
    public void setPostalCode(String postalCode) {
        this.postalCode = postalCode;
    }
    public String getMembershipType() {
        return membershipType;
    }
    public void setMembershipType(String membershipType) {
        this.membershipType = membershipType;
    }


    
}
