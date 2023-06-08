package g2t1.corppass.services;

import java.util.*;

import g2t1.corppass.models.CorporatePass;
import g2t1.corppass.models.EmailDetails;
import g2t1.corppass.models.Loan;
import g2t1.corppass.models.OutstandingFee;
import g2t1.corppass.payloads.response.ApiResponse;

import javax.mail.*;
import javax.mail.internet.MimeMessage;

import org.springframework.core.env.Environment;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.http.ResponseEntity;
import org.springframework.context.i18n.LocaleContextHolder;

import org.thymeleaf.context.Context;

public interface EmailService {

	/**
	 * Creates email session with the gmail smtp server using port 465
	 * 
	 * @param environment
	 * @return Session used to send the email
	 */
	static Session setupMailServer(Environment environment) {
		// (must be used before each try block for each method that sends email.)
		Properties properties = System.getProperties();
		properties.put("mail.smtp.host", "smtp.gmail.com");
		properties.put("mail.smtp.port", "465");
		properties.put("mail.smtp.ssl.enable", "true");
		properties.put("mail.smtp.auth", "true");

		String authUsername = environment.getProperty("spring.mail.username");
		String authPassword = environment.getProperty("spring.mail.password");

		Session session = Session.getInstance(properties, new javax.mail.Authenticator() {
			protected PasswordAuthentication getPasswordAuthentication() {
				return new PasswordAuthentication(authUsername, authPassword);
			}
		});
		return session;
	}

	/**
	 * The template to create the default MimeMessage Object and sets the context to
	 * be edited by the specific differentiated email service methods.
	 * 
	 * @param session Session used to send the email.
	 * @return a map containing MimeMessage, MimeMessageHelper & Context as Objects
	 * @throws MessagingException
	 */
	static Map<String, Object> createMessage(Session session) throws MessagingException {
		Map<String, Object> map = new HashMap<String, Object>();
		MimeMessage message = new MimeMessage(session);
		final MimeMessageHelper mailMessage;
		mailMessage = new MimeMessageHelper(message, true, "UTF-8");
		final Context ctx = new Context(LocaleContextHolder.getLocale());
		map.put("MineMessage", message);
		map.put("MimeMessageHelper", mailMessage);
		map.put("Context", ctx);
		return map;
	}

	/**
	 * The template to send an email to the user with the details set in the email
	 * template and specific differentiated email service methods.
	 * 
	 * @param mailMessage MimeMessageHelper Object
	 * @param message     MimeMessage Object
	 * @param subject     String as subject of the email
	 * @param htmlContent String containing the html content of the email's body
	 * @throws MessagingException
	 */
	static ResponseEntity<?> sendEmail(MimeMessageHelper mailMessage, MimeMessage message, String subject,
			String htmlContent) throws MessagingException {
		try {
			mailMessage.setSubject(subject);
			mailMessage.setText(htmlContent, true);
			System.out.println("sending...");
			Transport.send(message);
			System.out.println("Sent message successfully....");
			return ResponseEntity
					.ok()
					.body(new ApiResponse<>(200, "Sent message successfully!"));
		} catch (MessagingException e) {
			throw e;
		}
	}

	/**
	 * The template to send an email to all admins of a staff's new outstanding fee.
	 * To be overwritten in EmailServiceImpl for the actual implementation.
	 * 
	 * @param outstandingFee OutstandingFee object containing all of the details of
	 *                       a new outstanding fee to be notified to all admins in
	 *                       the system.
	 * @throws MessagingException
	 */
	void sendOustandingEmailAdmin(OutstandingFee outstandingFee) throws MessagingException;

	/**
	 * The template to send an email to the borrower concerning the new outstanding fee.
	 * To be overwritten in EmailServiceImpl for the actual implementation.
	 * 
	 * @param outstandingFee OutstandingFee object containing all of the details of
	 *                       a new outstanding fee to be notified to all admins in
	 *                       the system.
	 * @throws MessagingException
	 */
	void sendOustandingEmailBorrower(OutstandingFee outstandingFee) throws MessagingException;

	/**
	 * The template to send an email to the staff concerning the cancellation on outstanding fee.
	 * To be overwritten in EmailServiceImpl for the actual implementation.
	 * 
	 * @param outstandingFee OutstandingFee object containing all of the details of
	 *                       a new outstanding fee to be notified to all admins in
	 *                       the system.
	 * @param loan Loan object containing all of the details of the loan involved.
	 * @throws MessagingException
	 */
	void sendStaffCancellationEmailOnOutstandingFee(CorporatePass corpass, Loan loan) throws MessagingException;

	/**
	 * The template to send an email to the staff of their succesfull Corporate
	 * Pass Loan.
	 * To be overwritten in EmailServiceImpl for the actual implementation.
	 * 
	 * @param outstandingFee OutstandingFee object containing all of the details of
	 *                       a new outstanding fee to be notified to all admins in
	 *                       the system.
	 * @throws MessagingException
	 */
	void sendLoanSuccessEmail(EmailDetails emailDetails, CorporatePass corpass, Loan loan) throws MessagingException;

	/**
	 * The template to send an email to the borrower who has collected the corporate pass
	 * To be overwritten in EmailServiceImpl for the actual implementation.
	 * 
	 * @param userEmail       The email of the borrower.
	 * @param borrowerName        The name of the corporate pass borrower.
	 * @param corporatePassID    The id of the corporate pass collected.
	 * @param dateCollected  The date the corporate pass was collected.
	 * @throws MessagingException
	 */
	void sendPassCollectedEmail(String userEmail, String borrowerName, String corporatePassID, Date dateCollected) throws MessagingException;

	/**
	 * The template to send an email to the borrower who has returned the corporate pass
	 * To be overwritten in EmailServiceImpl for the actual implementation.
	 * 
	 * @param userEmail       The email of the borrower.
	 * @param borrowerName The name of the corporate pass borrower.
	 * @param corporatePassID        The ID of the corporate pass that has been returned.
	 * @param dateReturned The date the corporate pass was returned.
	
	 * @throws MessagingException
	 */
	void sendPassReturnedEmail(String userEmail,String borrowerName, String corporatePassID, Date dateReturned)
			throws MessagingException;

	/**
	 * The template to send an email to the borrower when a loan's date is rescheduled.
	 * To be overwritten in EmailServiceImpl for the actual implementation.
	 * 
	 * @param userEmail       The email of the new user to send the verification
	 *                        link to.
	 * @param loanID The ID of the loan that has been rescheduled.
	 * @param oldDate The old date of the loan.
	 * @param newDate The updatede date of the loan.
	 * @throws MessagingException
	 */
	void sendLoanChangeDateEmail(String userEmail,String borrowerName, String loanID, Date oldDate, Date newDate) throws MessagingException;


	/**
	 * The template to send an email to the borrower that their loan is cancelled.
	 * To be overwritten in EmailServiceImpl for the actual implementation.
	 * 
	 * @param userEmail       The email of the new user to send the verification
	 *                        link to.
	 * @param borrowerName        The name of the new user.
	 * @param loanID    The id of the loan cancelled.
	 * @param attractionName  The name of the attraction the loan was for.
	 * @throws MessagingException
	 */
	void sendLoanCancelledEmail(String userEmail, String borrowerName, String loanID, String attractionName)
			throws MessagingException;

	/**
	 * The template to send an email borrower upon creation of account.
	 * To be overwritten in EmailServiceImpl for the actual implementation.
	 * 
	 * @param userEmail       The email of the new user to send the verification
	 *                        link to.
	 * @param userName        The name of the new user.
	 * @param confirmationURL The verification link to be sent to the new user.
	 * @throws MessagingException
	 */
	void sendAccountConfirmationEmail(String userEmail, String userName, String confirmationURL)
			throws MessagingException;

	void sendVisitReminderEmail(Loan loan) throws MessagingException;

	void sendPassReturnReminderEmail(Loan loan) throws MessagingException;
}
