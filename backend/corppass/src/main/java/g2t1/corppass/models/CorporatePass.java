package g2t1.corppass.models;

import javax.persistence.*;
/**
	* Corporate Pass class
	* This class represents each individual pass that users can loan
*/
@Entity
@Table(name = "corporatepass")
public class CorporatePass {
	@Id
	private String id;

	private String membershipName;

	private String attraction;

	private String type;

	private String status;

	private Boolean active;

	private Double replacementFee;

	private Long barcodeId;

	private String address;

	private String postalCode;

	private String membershipType;

	protected CorporatePass() {
	}

	/**
		* Corporate Pass Constructor
		* @param id The id of the pass in String
		* @param membershipName The membership that that pass belongs to. E.g. "Mandai Wildlife Reserves"
		* @param attraction The attraction that the pass is for within the membership. E.g. "Zoo"
		* @param type The type of pass. Values "physical" | "electronic"
		* @param status The status of pass. Values "available" | "on loan" | "lost"
		* @param active Whether the pass is active or not (affects the ability to see and book the pass). boolean values of true | false
		* @param replcementFee The replacementFee for passes. Only affects physical passes. Value in integer
		* @param barcodeId The barcode id. Used to verify the pass at point of entrance. Takes in Long values.
		* @param address The address of the attraction (without postal code). Takes in String.
		* @param postalCode The postal code portion of the address. Takes in String.
		* @param membershipType The membership type according to use case. E.g. "Gold" | "Silver" | "Bronze"
	*/
	public CorporatePass(String id, String membershipName, String attraction, String type, String status,
			Boolean active,
			Double replacementFee, Long barcodeId, String address, String postalCode, String membershipType) {
		this.id = id;
		this.membershipName = membershipName;
		this.attraction = attraction;
		this.type = type;
		this.status = status;
		this.active = active;
		this.replacementFee = replacementFee;
		this.barcodeId = barcodeId;
		this.address = address;
		this.postalCode = postalCode;
		this.membershipType = membershipType;
	}

	/**
		* Prints out the Corporate pass as a String
	*/
	@Override
	public String toString() {
		return "CorporatePass [id=" + id + ", membershipName=" + membershipName + ", attraction=" + attraction
				+ ", type=" + type + ", status=" + status + ", active=" + active + ", replacementFee=" + replacementFee
				+ ", barcodeId=" + barcodeId + ", address=" + address + ", postalCode=" + postalCode
				+ ", membershipType=" + membershipType + "]";
	}

	/**
		* Method to get id of corporate pass
		* @return The id in String
	*/
	public String getId() {
		return id;
	}

	/**
		* Method to set id of corporate pass
		* @param id The id of the pass in String
	*/
	public void setId(String id) {
		this.id = id;
	}

	/**
		* Method to get membership name of corporate pass
		* @return The membership name in String
	*/
	public String getMembershipName() {
		return membershipName;
	}

	/**
		* Method to set membership name of corporate pass
		* @param membershipName The membership that that pass belongs to. E.g. "Mandai Wildlife Reserves"
	*/
	public void setMembershipName(String membershipName) {
		this.membershipName = membershipName;
	}

	/**
		* Method to get attraction name of corporate pass
		* @return The attraction name of the pass in String
	*/
	public String getAttraction() {
		return attraction;
	}

	/**
		* Method to set attraction name of corporate pass
		* @param attraction The attraction name of the pass in String
	*/
	public void setAttraction(String attraction) {
		this.attraction = attraction;
	}

	/**
		* Method to get type of corporate pass
		* @return The type of pass. Values "physical" | "electronic"
	*/
	public String getType() {
		return type;
	}

	/**
		* Method to set type of corporate pass
		* @param type Values "physical" | "electronic"
	*/
	public void setType(String type) {
		this.type = type;
	}

	/**
		* Method to get status of corporate pass
		* @return The status of pass. Values "available" | "on loan" | "lost"
	*/
	public String getStatus() {
		return status;
	}

	/**
		* Method to set status of corporate pass
		* @param status Values "available" | "on loan" | "lost"
	*/
	public void setStatus(String status) {
		this.status = status;
	}

	/**
		* Method to get whether a pass is active or not
		* @return boolean values of true | false
	*/
	public Boolean getActive() {
		return active;
	}

	/**
		* Method to set a pass to active or inactive
		* @param active boolean values of true | false
	*/
	public void setActive(Boolean active) {
		this.active = active;
	}

	/**
		* Method to get replacement fee of corporate pass
		* @return replacement fee in interger
	*/
	public Double getReplacementFee() {
		return replacementFee;
	}

	/**
		* Method to set replacement fee of corporate pass
		* @param replacementFee value in integer
	*/
	public void setReplacementFee(Double replacementFee) {
		this.replacementFee = replacementFee;
	}

	/**
		* Method to get barcode id of corporate pass
		* @return barcode id in long
	*/
	public Long getBarcodeId() {
		return barcodeId;
	}

	/**
		* Method to set barcode id of corporate pass
		* @param barcodeId value in long
	*/
	public void setBarcodeId(Long barcodeId) {
		this.barcodeId = barcodeId;
	}

	/**
		* Method to get address of corporate pass
		* @return address of attraction in String
	*/
	public String getAddress() {
		return address;
	}

	/**
		* Method to set address of corporate pass
		* @param address address of attraction in String
	*/
	public void setAddress(String address) {
		this.address = address;
	}

	/**
		* Method to get postal code of corporate pass
		* @return postal code of attraction in String
	*/
	public String getPostalCode() {
		return postalCode;
	}

	/**
		* Method to set postal code of corporate pass
		* @param postalCode postal code of attraction in String
	*/
	public void setPostalCode(String postalCode) {
		this.postalCode = postalCode;
	}

	/**
		* Method to get membership type of corporate pass
		* @return membership type of attraction in String
	*/
	public String getMembershipType() {
		return membershipType;
	}

	/**
		* Method to set membership type of corporate pass
		* @param membershipType membership type of attraction in String
	*/
	public void setMembershipType(String membershipType) {
		this.membershipType = membershipType;
	}

}
