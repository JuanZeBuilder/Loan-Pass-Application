package g2t1.corppass.services;

import org.quartz.*;

import g2t1.corppass.models.Loan;

public interface SchedulerService {
  public void scheduleEmailJob(JobDetail job, Trigger trigger) throws SchedulerException;

	public void scheduleVisitReminderEmail(Loan loan) throws SchedulerException;

	public void schedulePassReturnCheck(Loan loan) throws SchedulerException;
}
