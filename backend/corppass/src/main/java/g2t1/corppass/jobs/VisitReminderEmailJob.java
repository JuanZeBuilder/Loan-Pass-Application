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
public class VisitReminderEmailJob extends QuartzJobBean {
	private static final Logger logger = LoggerFactory.getLogger(VisitReminderEmailJob.class);

  @Autowired
  EmailServiceImpl emailService;

  @Override
  public void executeInternal(JobExecutionContext context) {

    try {
      JobDataMap jobDataMap = context.getJobDetail().getJobDataMap();
      Loan loan = (Loan) jobDataMap.get("loan");
      int loanId = loan.getLoanID();

      emailService.sendVisitReminderEmail(loan);
      logger.info("ran VisitReminderEmail job for loan with id: " + loanId);
    } catch (Exception e) {
      logger.warn("Unable to send visit reminder email: " + e);
    }
  }
}
