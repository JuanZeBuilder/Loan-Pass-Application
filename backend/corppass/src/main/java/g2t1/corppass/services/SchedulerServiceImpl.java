package g2t1.corppass.services;

import java.time.*;
import java.util.*;

import org.quartz.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import g2t1.corppass.jobs.*;
import g2t1.corppass.models.Loan;

@Service
public class SchedulerServiceImpl implements SchedulerService {
  @Autowired
  EmailServiceImpl emailService;

	@Autowired
	private Scheduler scheduler;

  public void scheduleEmailJob(JobDetail job, Trigger trigger) throws SchedulerException {
		scheduler.getContext().put("emailService", emailService);
		scheduler.start();
		scheduler.scheduleJob(job, trigger);
  };

	@Override
	public void scheduleVisitReminderEmail(Loan loan) throws SchedulerException {
		LocalDate visitReminderLocalDate = loan.getLoanPassDate().minusDays(1);
		Date reminderDate = Date.from(visitReminderLocalDate.atStartOfDay(ZoneId.systemDefault()).toInstant());

		Trigger trigger = TriggerBuilder.newTrigger().startAt(reminderDate).build();

		JobDataMap jobDataMap = new JobDataMap();
		jobDataMap.put("loan", loan);

		JobDetail job = JobBuilder.newJob(VisitReminderEmailJob.class)
				.usingJobData(jobDataMap)
				.build();

		scheduleEmailJob(job, trigger);
	}

	@Override
	public void schedulePassReturnCheck(Loan loan) throws SchedulerException {
		LocalDateTime returnDateTime = loan.getLoanPassDate().atTime(9, 0);
		Date returnDate = Date.from(returnDateTime.atZone(ZoneId.systemDefault()).toInstant());

		Trigger trigger = TriggerBuilder.newTrigger().startAt(returnDate).build();

		JobDataMap jobDataMap = new JobDataMap();
		jobDataMap.put("loan", loan);

		JobDetail job = JobBuilder.newJob(PassReturnCheckJob.class)
				.usingJobData(jobDataMap)
				.build();

		scheduleEmailJob(job, trigger);
	};
}
