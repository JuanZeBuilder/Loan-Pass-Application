package g2t1.corppass.models;

import javax.persistence.*;

@Entity
@Table(name = "roles")
public class Role {
	public enum ERole {
		ROLE_BORROWER,
		ROLE_ADMIN,
		ROLE_GOP,
	}

  @Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;

	@Enumerated(EnumType.STRING)
	@Column(length = 20, unique=true)
	private ERole name;
  public ERole getName() {
		return name;
	}

  public Integer getId() {
		return id;
	}

  public void setId(Integer id) {
		this.id = id;
	}

	protected Role() {}

  public Role(ERole name) {
		this.name = name;
	}
}
