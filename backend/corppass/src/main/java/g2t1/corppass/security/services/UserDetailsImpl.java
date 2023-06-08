package g2t1.corppass.security.services;

import java.util.*;
import java.util.stream.Collectors;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.fasterxml.jackson.annotation.JsonIgnore;

import g2t1.corppass.models.User;

public class UserDetailsImpl implements UserDetails {
	private int id;

  private String username;

	@JsonIgnore
	private String password;

  private Collection<? extends GrantedAuthority> authorities;

  public UserDetailsImpl(int id, String username, String password,
			Collection<? extends GrantedAuthority> authorities) {
		this.id = id;
		this.username = username;
		this.password = password;
		this.authorities = authorities;
	}

  public static UserDetailsImpl build(User user) {
		List<GrantedAuthority> authorities = user.getRoles().stream()
				.map(role -> new SimpleGrantedAuthority(role.getName().name()))
				.collect(Collectors.toList());

		return new UserDetailsImpl(
				user.getId(),
				user.getUsername(),
				user.getPassword(), 
				authorities);
	}

  @Override
	public Collection<? extends GrantedAuthority> getAuthorities() {
		return authorities;
	}

  public int getId() {
		return id;
	}

  @Override
	public String getUsername() {
		return username;
	}

  @Override
	public String getPassword() {
		return password;
	}

  @Override
	public boolean isAccountNonExpired() {
		return true;
	}

	@Override
	public boolean isAccountNonLocked() {
		return true;
	}

  @Override
	public boolean isCredentialsNonExpired() {
		return true;
	}

	@Override
	public boolean isEnabled() {
		return true;
	}
}
