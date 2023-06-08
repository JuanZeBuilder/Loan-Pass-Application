package g2t1.corppass.events;

import org.springframework.context.ApplicationEvent;

import g2t1.corppass.models.User;

public class OnSignupEvent extends ApplicationEvent {
	private String appUrl;
	private User user;

	public OnSignupEvent(User user, String appUrl) {
		super(user);

		this.user = user;
		this.appUrl = appUrl;
	}

	public String getAppUrl() {
		return appUrl;
	}

	public User getUser() {
		return user;
	}
}