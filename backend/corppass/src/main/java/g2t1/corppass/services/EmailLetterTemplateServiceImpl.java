package g2t1.corppass.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import com.openhtmltopdf.pdfboxout.PdfRendererBuilder;

import java.io.FileOutputStream;
import java.io.OutputStream;
import java.time.format.DateTimeFormatter;
import java.util.*;

import javax.mail.Session;

import g2t1.corppass.models.CorporatePass;
import g2t1.corppass.models.Loan;

@Service
public class EmailLetterTemplateServiceImpl implements EmailLetterTemplateService {

	@Autowired
	private final TemplateEngine htmlTemplateEngine;
	private final Environment environment;

	public EmailLetterTemplateServiceImpl(Environment environment, TemplateEngine htmlTemplateEngine) {
		this.htmlTemplateEngine = htmlTemplateEngine;
		this.environment = environment;
	}

	/**
	 * Generate a PDF Authorisation Letter file from a HTML template to send to the
	 * user upon successful loan
	 * 
	 * @param corpass The Corporate Pass of the user who has completed a successful
	 *                loan
	 * @param loan    The loan that the user has successfully booked
	 * @throws Exception
	 */
	@Override
	public void updateLetterPDF(CorporatePass corpass, Loan loan) throws Exception {
		Session session = EmailService.setupMailServer(environment);
		Map<String, Object> map = EmailService.createMessage(session);

		DateTimeFormatter dateFormat = DateTimeFormatter
				.ofPattern("dd/MM/yyyy");

		Context ctx = (Context) map.get("Context");

		ctx.setVariable("address", corpass.getAddress());
		ctx.setVariable("membershipName", corpass.getMembershipName());
		ctx.setVariable("membershipType", corpass.getMembershipType());
		ctx.setVariable("loanPassDate", dateFormat.format(loan.getLoanPassDate()));
		ctx.setVariable("userName", loan.getEmail());
		ctx.setVariable("borrowDate", dateFormat.format(loan.getBorrowDate()));

		String htmlContent = htmlTemplateEngine.process("authorisation_letter", ctx);
		System.out.println(htmlContent);
		OutputStream os = new FileOutputStream("src/main/resources/templates/Authorisation_Letter.pdf");
		PdfRendererBuilder builder = new PdfRendererBuilder();
		builder.withHtmlContent(htmlContent, null);
		builder.toStream(os);
		builder.run();

	}

}
