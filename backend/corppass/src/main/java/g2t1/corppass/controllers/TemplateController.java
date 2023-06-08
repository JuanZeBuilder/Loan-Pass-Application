package g2t1.corppass.controllers;

import org.springframework.web.bind.annotation.RestController;

import java.util.*;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.http.ResponseEntity;


import g2t1.corppass.payloads.response.ApiResponse;
import g2t1.corppass.services.EmailLetterTemplateService;

@RestController
@CrossOrigin(origins = "*")
public class TemplateController {

    /**
     * Returns the parameters the admin must use for the templates to be dynamic.
     * @param templateType template of interest
     * @return a map of parameters
     */
    @GetMapping(value = "admin/parameters/{templateType}")
    public Map<String, String> getReplacementVariables(@PathVariable String templateType) {
        return EmailLetterTemplateService.getDynamicParameters(templateType);
    }

    /**
     * Returns html template depending on the template type requested by the user. Populates the edit template box.
     * @param templateType
     * @return html template as a String
     */
    @GetMapping(value = "admin/preview/{templateType}")
    public String getTemplateToPreview(@PathVariable String templateType) {
        return EmailLetterTemplateService.getTemplateToPreview(templateType);
    }

    /**
     * Returns html template depending on the template type requested by the user with dummy variables to allow the user to preview their updated template.
     * @param templateType
     * @return html template as a String
     */
    @GetMapping(value = "admin/populate_edit/{templateType}")
    public String getTemplateToEdit(@PathVariable String templateType) {
        return EmailLetterTemplateService.getTemplateToEdit(templateType);
    }

    /**
     * Updates template with the new template provided by the admin.
     * Changes variables to be dynamic
     * @param templateType the type of template to be updated
     * @param newTemplate as a Jsonified String to update to the html template
     * @return response entity. If successful, data will be the newly created html template (after variable-processing) as a String
     */
    // rewrite html file with new template as a string
    @PutMapping(value = "/admin/updateTemplate/{templateType}")
    public ResponseEntity<?> updatetemplateTemplate(@PathVariable String templateType,@RequestBody Map<String, String> body) {

        String newTemplate = body.get("newTemplate");
        List<String> codeResponse = EmailLetterTemplateService.updateTemplate(templateType, newTemplate);
        if(codeResponse.get(0) == "success"){
            return ResponseEntity
            .ok()
            .body(new ApiResponse<>(200, "Template updated succesfully", codeResponse.get(1)));
        }else{
            System.out.println("No file found");
            return ResponseEntity
            .badRequest()
            .body(new ApiResponse<>(400, "Something went wrong, error: " + "No file found."));
        }
          
    }

}
