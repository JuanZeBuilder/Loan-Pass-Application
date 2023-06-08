package g2t1.corppass.jobs;

import org.quartz.JobDataMap;
import org.quartz.JobExecutionContext;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.quartz.QuartzJobBean;
import org.springframework.stereotype.Component;

import g2t1.corppass.models.Loan;
import g2t1.corppass.services.EmailServiceImpl;

@Component
public class PassReturnCheckJob extends QuartzJobBean {
	private static final Logger logger = LoggerFactory.getLogger(VisitReminderEmailJob.class);

  @Autowired
  EmailServiceImpl emailService;

  @Override
  public void executeInternal(JobExecutionContext context) {
    try {
      JobDataMap jobDataMap = context.getJobDetail().getJobDataMap();
      Loan loan = (Loan) jobDataMap.get("loan");
      int loanId = loan.getLoanID();
  
      if (loan.getStatus() == "returned") {
        logger.info("Loan with id: " + loanId + " has been successfully returned, no further actions to be taken.");
        return;
      }

      emailService.sendPassReturnReminderEmail(loan);
      logger.info("Loan with id: " + loanId + " not yet returned, reminder email sent.");
    } catch (Exception e) {
      logger.warn("Unable to send pass return reminder email: " + e);
    }
  }
  
}
