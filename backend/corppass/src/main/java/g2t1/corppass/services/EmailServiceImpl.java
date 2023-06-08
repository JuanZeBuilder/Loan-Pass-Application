package g2t1.corppass.services;

import java.util.*;

import javax.activation.DataSource;
import javax.activation.FileDataSource;
import javax.mail.MessagingException;
import javax.mail.Session;
import javax.mail.internet.MimeMessage;

import org.springframework.core.env.Environment;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import g2t1.corppass.models.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.i18n.LocaleContextHolder;

@Service
public class EmailServiceImpl implements EmailService {
	@Autowired
	UserService userService;
	@Autowired
	LoanServiceImpl loanService;
	@Autowired
	CorporatePassServiceImpl corpassService;
	@Autowired
	EmailLetterTemplateService emailLetterTemplateService;

	private final TemplateEngine htmlTemplateEngine;
	private final Environment environment;

	// html templates are in src/main/resources/templates
	private static final String OSFEEA_TEMPLATE = "outstanding_fee_admin";
	private static final String OSFEEB_TEMPLATE = "outstanding_fee_borrower";
	private static final String LCE_TEMPLATE = "loan_cancellation_email";
	private static final String PHYCARD_TEMPLATE = "physical_card_email_template";
	private static final String ECARD_TEMPLATE = "electronic_card_email_template";
	private static final String ACCOUNT_CONFIRMATION = "registration";
	private static final String VISIT_REMINDER = "visit_reminder_email";
	private static final String PASS_RETURN_REMINDER = "pass_return_reminder_email";
	private static final String COLLECTED_TEMPLATE = "pass_collected";
	private static final String CHANGE_DATE_TEMPLATE = "change_loan_date";
	private static final String RETURNED_TEMPLATE = "loan_returned";
	private static final String CANCELLED_TEMPLATE = "loan_cancelled";

	public EmailServiceImpl(Environment environment, TemplateEngine htmlTemplateEngine) {
		this.htmlTemplateEngine = htmlTemplateEngine;
		this.environment = environment;
	}

	/**
	 * Sends an email to the new user with the verification link to verify their
	 * account.
	 * 
	 * @param userEmail       The email of the new user to send the verification
	 *                        link to.
	 * @param name            The name of the new user.
	 * @param confirmationURL The verification link to be sent to the new user.
	 * @throws MessagingException
	 */
	@Override
	public void sendAccountConfirmationEmail(String userEmail, String name, String confirmationURL)
			throws MessagingException {
		Session session = EmailService.setupMailServer(environment);

		Map<String, Object> map = EmailService.createMessage(session);
		MimeMessage message = (MimeMessage) map.get("MineMessage");
		MimeMessageHelper mailMessage = (MimeMessageHelper) map.get("MimeMessageHelper");
		Context ctx = (Context) map.get("Context");

		ctx.setVariable("name", name);
		ctx.setVariable("email", userEmail);
		ctx.setVariable("url", confirmationURL);

		mailMessage.addTo(userEmail);
		String htmlContent = this.htmlTemplateEngine.process(ACCOUNT_CONFIRMATION, ctx);
		EmailService.sendEmail(mailMessage, message, "Confirm Signup for Corporate Pass Account", htmlContent);
	}

	/**
	 * Sends an email to the staff of their succesfull Corporate Pass Loan.
	 * 
	 * @param emailDetails EmailDetails object containing all of the details to be
	 *                     sent in the email.
	 * @throws MessagingException
	 */
	@Override
	public void sendLoanSuccessEmail(EmailDetails emailDetails, CorporatePass corpass, Loan loan)
			throws MessagingException {
		Session session = EmailService.setupMailServer(environment);

		Map<String, Object> map = EmailService.createMessage(session);
		MimeMessage message = (MimeMessage) map.get("MineMessage");
		MimeMessageHelper mailMessage = (MimeMessageHelper) map.get("MimeMessageHelper");
		Context ctx = (Context) map.get("Context");

		ctx.setVariable("email", emailDetails.getBorrowerEmail());
		ctx.setVariable("name", emailDetails.getBorrowerName());
		ctx.setVariable("membershipName", emailDetails.getMembershipName());
		ctx.setVariable("attractionName", emailDetails.getAttractionName());
		ctx.setVariable("dateOfVisit", emailDetails.getDateOfVisit());
		ctx.setVariable("membershipID", emailDetails.getMembershipID());

		String htmlContent = "";
		System.out.println(emailDetails.getCardType());
		if (emailDetails.getCardType().equals("physical")) {
			htmlContent = this.htmlTemplateEngine.process(PHYCARD_TEMPLATE, ctx);
		} else {
			htmlContent = this.htmlTemplateEngine.process(ECARD_TEMPLATE, ctx);
		}
		mailMessage.addTo(emailDetails.getBorrowerEmail());

		// Update PDF and attach to the email
		try {
			emailLetterTemplateService.updateLetterPDF(corpass, loan);
		} catch (Exception e) {
			e.printStackTrace();
		}

		DataSource source = new FileDataSource("src/main/resources/templates/Authorisation_Letter.pdf");
		mailMessage.addAttachment("Authorisation_Letter.pdf", source);

		String cardType = emailDetails.getCardType();
		// sends the email with the header which indicates if a physical or electronic
		// card is used
		EmailService.sendEmail(mailMessage, message,
				cardType.substring(0, 1).toUpperCase() + cardType.substring(1)
						+ " Corporate Pass Loan Confirmation",
				htmlContent);
	}

	/**
	 * Sends an email to admin of a staff's new outstanding fee.
	 * 
	 * @param outstandingFee OutstandingFee object containing all of the details of
	 *                       a new outstanding fee to be notified to all admins in
	 *                       the system.
	 * @throws MessagingException
	 */
	public void sendOustandingEmailAdmin(OutstandingFee outstandingFee)
			throws MessagingException {
		Session session = EmailService.setupMailServer(environment);

		Map<String, Object> map = EmailService.createMessage(session);
		MimeMessage message = (MimeMessage) map.get("MineMessage");
		MimeMessageHelper mailMessage = (MimeMessageHelper) map.get("MimeMessageHelper");

		User tmpUser = userService.loadUserByUsername(outstandingFee.getUsername());
		CorporatePass tmpCorpass = corpassService
				.fetchSpecificCorporatePassById(outstandingFee.getCorporatePassId());

		final Context ctx = new Context(LocaleContextHolder.getLocale());
		ctx.setVariable("outstandingFeeId", outstandingFee.getOutstandingfeeID());
		ctx.setVariable("staffName", tmpUser.getLastName() + " " + tmpUser.getFirstName());
		ctx.setVariable("staffEmail", outstandingFee.getUsername());
		ctx.setVariable("corpassId", tmpCorpass.getId());
		ctx.setVariable("staffOutstandingAmount", tmpCorpass.getReplacementFee());
		ctx.setVariable("cardType", tmpCorpass.getType());
		ctx.setVariable("attractionName", tmpCorpass.getAttraction());

		String htmlContent = this.htmlTemplateEngine.process(OSFEEA_TEMPLATE, ctx);

		// To Set to dynamic receiver
		// mailMessage.addTo(loan.getUsername());
		List<String> adminEmails = userService.fetchAdminEmails();
		for (int i = 0; i < adminEmails.size(); i++) {
			mailMessage.addTo(adminEmails.get(i));
		}

		EmailService.sendEmail(mailMessage, message,
				"Lost corporate pass reported - Outstanding Fee ID: " + outstandingFee.getOutstandingfeeID(),
				htmlContent);
	}

	/**
	 * Sends an email to borrower's about the outstanding fee.
	 * 
	 * @param outstandingFee OutstandingFee object containing all of the details of
	 *                       a new outstanding fee to be notified to all admins in
	 *                       the system.
	 * @throws MessagingException
	 */

	public void sendOustandingEmailBorrower(OutstandingFee outstandingFee)
			throws MessagingException {
		Session session = EmailService.setupMailServer(environment);

		Map<String, Object> map = EmailService.createMessage(session);
		MimeMessage message = (MimeMessage) map.get("MineMessage");
		MimeMessageHelper mailMessage = (MimeMessageHelper) map.get("MimeMessageHelper");

		User tmpUser = userService.loadUserByUsername(outstandingFee.getUsername());
		CorporatePass tmpCorpass = corpassService
				.fetchSpecificCorporatePassById(outstandingFee.getCorporatePassId());

		final Context ctx = new Context(LocaleContextHolder.getLocale());
		ctx.setVariable("outstandingFeeId", outstandingFee.getOutstandingfeeID());
		ctx.setVariable("staffName", tmpUser.getLastName() + " " + tmpUser.getFirstName());
		ctx.setVariable("staffEmail", outstandingFee.getUsername());
		ctx.setVariable("corpassId", tmpCorpass.getId());
		ctx.setVariable("staffOutstandingAmount", tmpCorpass.getReplacementFee());
		ctx.setVariable("cardType", tmpCorpass.getType());
		ctx.setVariable("attractionName", tmpCorpass.getAttraction());

		String htmlContent = this.htmlTemplateEngine.process(OSFEEB_TEMPLATE, ctx);
		mailMessage.addTo(outstandingFee.getUsername());

		EmailService.sendEmail(mailMessage, message,
				"Outstanding Fee Reminder - Outstanding Fee ID: " + outstandingFee.getOutstandingfeeID(),
				htmlContent);
	}

	/**
	 * Sends an email to all the borrower that is affected by the lost corporate
	 * pass to notify them that the loan is being canceled
	 * 
	 * @param corpass,loan Corporate Pass object containing all of the details of
	 *                     the lost corporate pass and loan object containing all of
	 *                     the details of the loan that is affected by the lost
	 *                     corporate pass.
	 * @throws MessagingException
	 */

	public void sendStaffCancellationEmailOnOutstandingFee(CorporatePass corpass, Loan loan)
			throws MessagingException {
		Session session = EmailService.setupMailServer(environment);

		Map<String, Object> map = EmailService.createMessage(session);
		MimeMessage message = (MimeMessage) map.get("MineMessage");
		MimeMessageHelper mailMessage = (MimeMessageHelper) map.get("MimeMessageHelper");

		User tmpUser = userService.loadUserByUsername(loan.getEmail());

		final Context ctx = new Context(LocaleContextHolder.getLocale());
		ctx.setVariable("staffName", tmpUser.getLastName() + " " +
				tmpUser.getFirstName());
		// ctx.setVariable("staffEmail", tmpUser.getUsername());
		ctx.setVariable("corpassId", corpass.getId());
		ctx.setVariable("loanId", loan.getLoanID());
		ctx.setVariable("loanPassDate", loan.getLoanPassDate());
		ctx.setVariable("cardType", corpass.getType());
		ctx.setVariable("attractionName", corpass.getAttraction());

		String htmlContent = this.htmlTemplateEngine.process(LCE_TEMPLATE, ctx);
		mailMessage.addTo(loan.getEmail());
		EmailService.sendEmail(mailMessage, message,
				"Corporate Pass Loan Cancellation Notification - Loan ID: " + loan.getLoanID(),
				htmlContent);
	}

	@Override
	public void sendVisitReminderEmail(Loan loan) throws MessagingException {
		Session session = EmailService.setupMailServer(environment);

		Map<String, Object> map = EmailService.createMessage(session);
		MimeMessage message = (MimeMessage) map.get("MineMessage");
		MimeMessageHelper mailMessage = (MimeMessageHelper) map.get("MimeMessageHelper");

		User tmpUser = userService.loadUserByUsername(loan.getEmail());

		final Context ctx = new Context(LocaleContextHolder.getLocale());
		ctx.setVariable("name", tmpUser.getLastName() + " " +
				tmpUser.getFirstName());
		ctx.setVariable("attraction", loan.getAttraction());
		ctx.setVariable("loanPassDate", loan.getLoanPassDate());

		String htmlContent = this.htmlTemplateEngine.process(VISIT_REMINDER, ctx);

		// To Set to dynamic receiver
		mailMessage.addTo(loan.getEmail());
		EmailService.sendEmail(mailMessage, message,
				"Corporate Pass Collection Reminder for Loan ID: " + loan.getLoanID(),
				htmlContent);
	}

	@Override
	public void sendPassReturnReminderEmail(Loan loan) throws MessagingException {
		Session session = EmailService.setupMailServer(environment);

		Map<String, Object> map = EmailService.createMessage(session);
		MimeMessage message = (MimeMessage) map.get("MineMessage");
		MimeMessageHelper mailMessage = (MimeMessageHelper) map.get("MimeMessageHelper");

		User tmpUser = userService.loadUserByUsername(loan.getEmail());

		final Context ctx = new Context(LocaleContextHolder.getLocale());
		ctx.setVariable("name", tmpUser.getLastName() + " " +
				tmpUser.getFirstName());
		ctx.setVariable("attraction", loan.getAttraction());
		ctx.setVariable("loanPassDate", loan.getLoanPassDate());

		String htmlContent = this.htmlTemplateEngine.process(PASS_RETURN_REMINDER, ctx);

		// To Set to dynamic receiver
		mailMessage.addTo(loan.getEmail());
		EmailService.sendEmail(mailMessage, message,
				"Corporate Pass Return Reminder for Loan ID: " + loan.getLoanID(),
				htmlContent);
	};

	/**
	 * Sends an email to the borrower who has collected the corporate pass
	 * 
	 * @param userEmail       The email of the borrower.
	 * @param borrowerName    The name of the corporate pass borrower.
	 * @param corporatePassID The id of the corporate pass collected.
	 * @param dateCollected   The date the corporate pass was collected.
	 * @throws MessagingException
	 */
	@Override
	public void sendPassCollectedEmail(String userEmail, String borrowerName, String corporatePassID,
			Date dateCollected) throws MessagingException {
		Session session = EmailService.setupMailServer(environment);

		Map<String, Object> map = EmailService.createMessage(session);
		MimeMessage message = (MimeMessage) map.get("MineMessage");
		MimeMessageHelper mailMessage = (MimeMessageHelper) map.get("MimeMessageHelper");

		String date = dateCollected.toString();
		final Context ctx = new Context(LocaleContextHolder.getLocale());
		ctx.setVariable("name", borrowerName);
		ctx.setVariable("corporatePassID", corporatePassID);
		ctx.setVariable("dateCollected", date);

		String htmlContent = this.htmlTemplateEngine.process(COLLECTED_TEMPLATE, ctx);

		// To Set to dynamic receiver
		mailMessage.addTo(userEmail);
		EmailService.sendEmail(mailMessage, message,
				"Corporate Pass Collected - Corporate Pass ID: " + corporatePassID,
				htmlContent);
	};

	/**
	 * Sends an email to the borrower who has returned the corporate pass
	 * 
	 * @param userEmail       The email of the borrower.
	 * @param borrowerName    The name of the corporate pass borrower.
	 * @param corporatePassID The ID of the corporate pass that has been returned.
	 * @param dateReturned    The date the corporate pass was returned.
	 * 
	 * @throws MessagingException
	 */
	@Override
	public void sendPassReturnedEmail(String userEmail, String borrowerName, String corporatePassID, Date dateReturned)
			throws MessagingException {
		Session session = EmailService.setupMailServer(environment);

		Map<String, Object> map = EmailService.createMessage(session);
		MimeMessage message = (MimeMessage) map.get("MineMessage");
		MimeMessageHelper mailMessage = (MimeMessageHelper) map.get("MimeMessageHelper");

		String date = dateReturned.toString();
		final Context ctx = new Context(LocaleContextHolder.getLocale());
		ctx.setVariable("corporatePassID", corporatePassID);
		ctx.setVariable("name", borrowerName);
		ctx.setVariable("dateReturned", date);

		String htmlContent = this.htmlTemplateEngine.process(RETURNED_TEMPLATE, ctx);

		// To Set to dynamic receiver
		mailMessage.addTo(userEmail);
		EmailService.sendEmail(mailMessage, message,
				"Corporate Pass Returned - Corporate Pass ID: " + corporatePassID,
				htmlContent);
	};

	/**
	 * Sends an email to the borrower when a loan's date is rescheduled.
	 * 
	 * @param userEmail The email of the new user to send the verification
	 *                  link to.
	 * @param loanID    The ID of the loan that has been rescheduled.
	 * @param oldDate   The old date of the loan.
	 * @param newDate   The updatede date of the loan.
	 * @throws MessagingException
	 */
	@Override
	public void sendLoanChangeDateEmail(String userEmail, String borrowerName, String loanID, Date oldDate,
			Date newDate) throws MessagingException {
		Session session = EmailService.setupMailServer(environment);

		Map<String, Object> map = EmailService.createMessage(session);
		MimeMessage message = (MimeMessage) map.get("MineMessage");
		MimeMessageHelper mailMessage = (MimeMessageHelper) map.get("MimeMessageHelper");

		String old = oldDate.toString();
		String newD = newDate.toString();
		final Context ctx = new Context(LocaleContextHolder.getLocale());
		ctx.setVariable("borrowerName", borrowerName);
		ctx.setVariable("loanID", loanID);
		ctx.setVariable("oldDate", old);
		ctx.setVariable("newDate", newD);

		String htmlContent = this.htmlTemplateEngine.process(CHANGE_DATE_TEMPLATE, ctx);

		// To Set to dynamic receiver
		mailMessage.addTo(userEmail);
		EmailService.sendEmail(mailMessage, message,
				"Corporate Pass Loan Date Change - Loan ID: " + loanID,
				htmlContent);
	}

	/**
	 * The template to send an email to the borrower that their loan is cancelled.
	 * 
	 * @param userEmail      The email of the new user to send the verification
	 *                       link to.
	 * @param borrowerName   The name of the new user.
	 * @param loanID         The id of the loan cancelled.
	 * @param attractionName The name of the attraction the loan was for.
	 * @throws MessagingException
	 */
	@Override
	public void sendLoanCancelledEmail(String userEmail, String borrowerName, String loanID, String attractionName)
			throws MessagingException {
		Session session = EmailService.setupMailServer(environment);

		Map<String, Object> map = EmailService.createMessage(session);
		MimeMessage message = (MimeMessage) map.get("MineMessage");
		MimeMessageHelper mailMessage = (MimeMessageHelper) map.get("MimeMessageHelper");

		final Context ctx = new Context(LocaleContextHolder.getLocale());
		ctx.setVariable("borrowerName", borrowerName);
		ctx.setVariable("loanID", loanID);
		ctx.setVariable("attractionName", attractionName);

		String htmlContent = this.htmlTemplateEngine.process(CANCELLED_TEMPLATE, ctx);

		// To Set to dynamic receiver
		mailMessage.addTo(userEmail);
		EmailService.sendEmail(mailMessage, message,
				"Corporate Pass Loan Cancelled - Loan ID: " + loanID,
				htmlContent);
	}
}
