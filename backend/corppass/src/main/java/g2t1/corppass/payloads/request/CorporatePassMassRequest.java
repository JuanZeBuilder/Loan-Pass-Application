package g2t1.corppass.payloads.request;

import java.util.*;

public class CorporatePassMassRequest {
    private String[] ids;
    private String membershipName;
    private String attraction;
    private String[] types;
    private String status;
    private String active;
    private String replacementFee;
    private Long[] barcodeIds;
    private String address;
    private String postalCode;
    private String membershipType;
    private Map<String, Object> newDetails;

    public String[] getIds() {
        return ids;
    }
    public void setId(String[] ids) {
        this.ids = ids;
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
    public String[] getTypes() {
        return types;
    }
    public void setType(String[] types) {
        this.types = types;
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
    public Long[] getBarcodeIds() {
        return barcodeIds;
    }
    public void setBarcodeId(Long[] barcodeIds) {
        this.barcodeIds = barcodeIds;
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
    public Map<String, Object> getNewDetails() {
        return newDetails;
    }
    public void setNewDetails(Map<String, Object> newDetails) {
        this.newDetails = newDetails;
    }

    
}
