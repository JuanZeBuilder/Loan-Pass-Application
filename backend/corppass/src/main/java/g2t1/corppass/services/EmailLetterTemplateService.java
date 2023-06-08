package g2t1.corppass.services;

import java.io.*;
import java.util.*;

import g2t1.corppass.models.CorporatePass;
import g2t1.corppass.models.Loan;

import org.thymeleaf.spring5.SpringTemplateEngine;
import org.thymeleaf.templateresolver.ClassLoaderTemplateResolver;
import org.thymeleaf.context.Context;

public interface EmailLetterTemplateService {
	/**
	 * Returns html template depending on the template type requested by the user.
	 * Populates the edit template box.
	 * 
	 * @param templateType
	 * @return html template as a String
	 */
	static String getTemplateToPreview(String templateType) {
		Map<String, Object> processReturn = processHTMLTemplate();
		Context ctx = (Context) processReturn.get("ctx");
		SpringTemplateEngine templateEngine = (SpringTemplateEngine) processReturn.get("templateEngine");
		Context populatedCtx = setDummyNamesForPreview(ctx, templateType);
		Map<String, String> fileTypeToName = mapFileTypeToName();
		String result = templateEngine.process(fileTypeToName.get(templateType), populatedCtx);
		return result;
	}

	/**
	 * Returns html template depending on the template type requested by the user
	 * with dummy variables to allow the user to preview their updated template.
	 * 
	 * @param templateType
	 * @return html template as a String
	 */
	static String getTemplateToEdit(String templateType) {
		Map<String, Object> processReturn = processHTMLTemplate();

		Context ctx = (Context) processReturn.get("ctx");
		SpringTemplateEngine templateEngine = (SpringTemplateEngine) processReturn.get("templateEngine");
		Context populatedCtx = setContextForEdit(ctx, templateType);
		Map<String, String> fileTypeToName = mapFileTypeToName();
		String result = templateEngine.process(fileTypeToName.get(templateType), populatedCtx);
		return result;
	}

	/**
	 * Processes the HTML Templates and returns the template context and template
	 * engine to the caller
	 * 
	 * @return a map containing the template context and template engine
	 */
	static Map<String, Object> processHTMLTemplate() {
		SpringTemplateEngine templateEngine = new SpringTemplateEngine();
		ClassLoaderTemplateResolver templateResolver = new ClassLoaderTemplateResolver();
		templateResolver.setPrefix("templates/");
		templateResolver.setCacheable(false);
		templateResolver.setSuffix(".html");
		templateResolver.setTemplateMode("HTML");
		templateResolver.setForceTemplateMode(true);
		templateEngine.setTemplateResolver(templateResolver);

		Context ctx = new Context();
		Map<String, Object> processReturn = new HashMap<>();
		processReturn.put("ctx", ctx);
		processReturn.put("templateEngine", templateEngine);

		return processReturn;
	}

	static Context setContextForEdit(Context ctx, String templateType) {
		if (templateType != "letter") {
			ctx.setVariable("name", "//name//");
			ctx.setVariable("email", "//email//");
			ctx.setVariable("membershipName", "//membershipName//");
			ctx.setVariable("attractionName", "//attractionName//");
			ctx.setVariable("dateOfVisit", "//dateOfVisit//");
			ctx.setVariable("membershipID", "//membershipID//");
		} else {
			ctx.setVariable("address", "//address//");
			ctx.setVariable("membershipName", "//membershipName//");
			ctx.setVariable("membershipType", "//membershipType//");
			ctx.setVariable("loanPassDate", "//loanPassDate//");
			ctx.setVariable("userName", "//userName//");
			ctx.setVariable("borrowDate", "//borrowDate//");
		}

		return ctx;
	}

	static Context setDummyNamesForPreview(Context ctx, String templateType) {
		if (templateType != "letter") {
			ctx.setVariable("name", "Jane Doe");
			ctx.setVariable("email", "jane.doe@sportsschool.edu.sg");
			ctx.setVariable("membershipName", "Mandai Reserves");
			ctx.setVariable("attractionName", "Singapore Zoo");
			ctx.setVariable("dateOfVisit", "Saturday, 12 February 2022");
			ctx.setVariable("membershipID", "12345678");
		} else {
			ctx.setVariable("address", "456 KangLin Road");
			ctx.setVariable("membershipName", "Premium CFOZ Card(s)");
			ctx.setVariable("membershipType", "Premium corporate friends of the Zoo (CFOZ) Membership");
			ctx.setVariable("loanPassDate", "12 February 2022");
			ctx.setVariable("userName", "Tan Ah Beng");
			ctx.setVariable("borrowDate", "5 February 2022");
		}

		return ctx;
	}

	static Map<String, String> getReplacementVariables(String templateType){
		Map<String, String> variables = new HashMap<>();
		if(templateType != "letter"){
			variables.put("//name//", "<span th:text=\"\\${name}\">Name</span>");
			variables.put("//email//", "<span th:text=\"\\${email}\">Email</span>");
			variables.put("//membershipName//", "<span th:text=\"\\${membershipName}\">membershipName</span>");
			variables.put("//attractionName//", "<span th:text=\"\\${attractionName}\">attractionName</span>");
			variables.put("//dateOfVisit//", "<span th:text=\"\\${dateOfVisit}\">dateOfVisit</spanb>");
			variables.put("//membershipID//", "<span th:text=\"\\${membershipID}\">membershipID</span>");
		}else{
			variables.put("//address//", "<span th:text=\"\\${membershipName}\">membershipName</span>");
			variables.put("//membershipName//", "<span th:text=\"\\${membershipName}\">membershipName</span>");
			variables.put("//membershipType//", "<span th:text=\"\\${membershipName}\">membershipName</span>");
			variables.put("//loanPassDate//", "<span th:text=\"\\${membershipName}\">membershipName</span>");
			variables.put("//userName//", "<span th:text=\"\\${membershipName}\">membershipName</span>");
			variables.put("//borrowDate//", "<span th:text=\"\\${membershipName}\">membershipName</span>");
		}
		return variables;
	}

	static Map<String, String> getDynamicParameters(String templateType) {
		Map <String, String> dynamicParameters = new HashMap<>();
		if (templateType != "letter") {
			dynamicParameters.put("Borrower name", "//name//");
			dynamicParameters.put("Borrower email", "//email//");
			dynamicParameters.put("Corporate Pass Membership Name", "//membershipName//");
			dynamicParameters.put("Corporate Pass Attraction Name", "//attractionName//");
			dynamicParameters.put("Date of Visit", "//dateOfVisit//");
			dynamicParameters.put("Membership ID", "//membershipID//");
		} else {
			dynamicParameters.put("Attraction Address", "//address//");
			dynamicParameters.put("Corporate Pass Membership Name", "//membershipName//");
			dynamicParameters.put("Corporate Pass Membership Type", "//membershipType//");
			dynamicParameters.put("Loan Pass Date", "//loanPassDate//");
			dynamicParameters.put("Name of Employee", "//userName//");
			dynamicParameters.put("Date borrowed", "//borrowDate//");
		}
		return dynamicParameters;
	}

	static Map<String, String> mapFileTypeToName() {
		Map<String, String> fileType = new HashMap<>();
		fileType.put("electronic", "electronic_card_email_template");
		fileType.put("physical", "physical_card_email_template");
		fileType.put("letter", "authorisation_letter");
		return fileType;
	}

	/**
     * Updates template with the new template provided by the admin.
     * Changes variables to be dynamic
     * @param templateType the type of template to be updated
     * @param newTemplate as a Jsonified String to update the template
     * @return List of Strings containing if template was changed successfully and the new template with dynamic variables
     */
    // rewrite html file with new template as a string
	static List<String> updateTemplate(String templateType, String newTemplate){
		List<String> response = new ArrayList<>();
        Map<String, String> fileTypeToURL = new HashMap<>();
        fileTypeToURL.put("electronic",  "src/main/resources/templates/electronic_card_email_template.html");
        fileTypeToURL.put("physical" , "src/main/resources/templates/physical_card_email_template.html");
        fileTypeToURL.put("letter" , "src/main/resources/templates/authorisation_letter.html");

        try(PrintStream out  = new PrintStream(new FileOutputStream(new File(fileTypeToURL.get(templateType)), false))){
			System.out.println(newTemplate);
			newTemplate = newTemplate.replaceFirst("<html>", "<html xmlns:th=\"http://www.thymeleaf.org\">");
			newTemplate = newTemplate.replaceFirst("<head>", "<head>\n\t<title th:remove=\"all\">Corporate Pass Loan confirmed</title>");
            // iterate through hashmap to replace the variables with the correct identifiers
            Map<String, String> replacementVariables = getReplacementVariables(templateType);
            for(Map.Entry<String, String> entry : replacementVariables.entrySet()) {
                newTemplate = newTemplate.replaceAll(entry.getKey(), entry.getValue());
            }
			System.out.println(newTemplate);
            out.print(newTemplate);
			response.add("success");
            response.add(newTemplate);
      
          }catch(FileNotFoundException e){
            response.add(e.getMessage());
          }
		return response;
          
    }

	// Create authorisation letter as PDF from the HTML
	public void updateLetterPDF(CorporatePass corpass, Loan loan) throws Exception;
}
