package g2t1.corppass.events;

import java.util.UUID;

import javax.mail.MessagingException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.*;
import org.springframework.stereotype.Component;

import g2t1.corppass.models.User;
import g2t1.corppass.repositories.UserRepository;
import g2t1.corppass.services.EmailServiceImpl;

@Component
public class SignupListener implements ApplicationListener<OnSignupEvent> {
	private static final Logger logger = LoggerFactory.getLogger(SignupListener.class);

	@Autowired
	EmailServiceImpl emailService;

	@Autowired
	UserRepository userRepository;

	@Override
	public void onApplicationEvent(OnSignupEvent signupEvent) {
		User user = signupEvent.getUser();

		String verificationToken = UUID.randomUUID().toString();
		user.setVerificationToken(verificationToken);

		userRepository.save(user);

		String userEmail = user.getUsername();

		String confirmationUrl = signupEvent.getAppUrl() + "/api/auth/verify?token=" + verificationToken;

    try {
      emailService.sendAccountConfirmationEmail(user.getUsername(), user.getFirstName() + user.getLastName(), confirmationUrl);
      logger.info("Sent signup confirmation email to " + userEmail);
    } catch (MessagingException e) {
      logger.warn("Unable to send confirmation email to " + userEmail + ", error: " + e);
    }

  }
}
