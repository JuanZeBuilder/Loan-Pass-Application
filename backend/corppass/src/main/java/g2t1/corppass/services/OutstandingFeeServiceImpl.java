package g2t1.corppass.services;

import g2t1.corppass.models.*;
import g2t1.corppass.repositories.OutstandingFeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class OutstandingFeeServiceImpl implements OutstandingFeeService {

	@Autowired
	private OutstandingFeeRepository outstandingFeeRepository;

	@Autowired
	EmailServiceImpl emailService;
	@Autowired
	LoanServiceImpl loanService;
	@Autowired
	CorporatePassServiceImpl corpassService;
	@Autowired
	UserServiceImpl userService;
	@Autowired
	EmailLetterTemplateService emailTemplateService;

	@Override
	public OutstandingFee saveOutstandingFee(OutstandingFee outstandingFee) {
		return outstandingFeeRepository.save(outstandingFee);
	}

	@Override
	public List<OutstandingFee> fetchOutstandingFeeList() {
		return (List<OutstandingFee>) outstandingFeeRepository.findAll();
	}

	@Override
	public Optional<OutstandingFee> fetchSpecificOutstandingFee(int outstandingfeeId) {
		return outstandingFeeRepository.findById(outstandingfeeId);
	}

	@Override
	public List<OutstandingFee> fetchOutstandingFeeListByUsername(String username) {
		List<OutstandingFee> output = new ArrayList<OutstandingFee>();
		List<OutstandingFee> outstandingFeeList = (List<OutstandingFee>) outstandingFeeRepository.findAll();
		for (OutstandingFee fee : outstandingFeeList) {
			if (fee.getUsername().equals(username)) {
				output.add(fee);
			}
		}
		return output;
	}

	@Override
	public List<OutstandingFee> fetchOutstandingFeeListNotCleared() {
		List<OutstandingFee> output = new ArrayList<OutstandingFee>();
		List<OutstandingFee> outstandingFeeList = (List<OutstandingFee>) outstandingFeeRepository.findAll();
		for (OutstandingFee fee : outstandingFeeList) {
			if (fee.getDateCleared() == null) {
				output.add(fee);
			}
		}
		return output;
	}

	@Override
	public OutstandingFee updateOutstandingFee(OutstandingFee outstandingFee, int outstandingFeeId) {

		OutstandingFee existingOutstandingFee = outstandingFeeRepository.findById(outstandingFeeId).get();
		if (existingOutstandingFee == null) {
			return null;
		}
		if (Objects.nonNull(outstandingFee.getUsername()) && !"".equalsIgnoreCase(outstandingFee.getUsername())) {
			existingOutstandingFee.setUsername(outstandingFee.getUsername());
		}
		if (Objects.nonNull(outstandingFee.getAmount())) {
			existingOutstandingFee.setAmount(outstandingFee.getAmount());
		}
		if (Objects.nonNull(outstandingFee.getCorporatePassId())) {
			existingOutstandingFee.setCorporatePassId(outstandingFee.getCorporatePassId());
		}
		if (Objects.nonNull(outstandingFee.getLoanId())) {
			existingOutstandingFee.setLoanId(outstandingFee.getLoanId());
		}
		if (Objects.nonNull(outstandingFee.getDateReportLost())) {
			existingOutstandingFee.setDateReportLost(outstandingFee.getDateReportLost());
		}
		existingOutstandingFee.setDateCleared(outstandingFee.getDateCleared());

		return outstandingFeeRepository.save(existingOutstandingFee);
	}

	@Override
	public OutstandingFee updateOutstandingFeeDateCleared(Date dateCleared, int outstandingFeeId) {
		OutstandingFee existingOutstandingFee = outstandingFeeRepository.findById(outstandingFeeId).get();
		if (existingOutstandingFee == null) {
			return null;
		}
		try {
			existingOutstandingFee.setDateCleared(dateCleared);
			loanService.updateLoanStatus(loanService.getLoanByLoanID(existingOutstandingFee.getLoanId()).get(),
					"cancelled");
			outstandingFeeRepository.save(existingOutstandingFee);
		} catch (Exception e) {
			return null;
		}
		return existingOutstandingFee;
	}

	@Override
	public void deleteOutstandingFeeById(int outstandingFeeId) {

		outstandingFeeRepository.deleteById(outstandingFeeId);

	}

	// process lost corpass and create outstanding fee -> send email to those who
	// are affected,to the one report lost about the outstanding replacement fee,
	// send email to
	// all the admins
	@Override
	public OutstandingFee processReportLost(OutstandingFee outstandingFee) throws Exception {
		CorporatePass tmpCorpass = corpassService.fetchSpecificCorporatePassById(outstandingFee.getCorporatePassId());
		Loan tmpLoan = loanService.getLoanByLoanID(outstandingFee.getLoanId()).get();
		Date now = new Date();

		// Create outstanding fee
		outstandingFee.setAmount(tmpCorpass.getReplacementFee());
		outstandingFee.setDateReportLost(now);
		outstandingFee.setDateCleared(null);
		outstandingFee.setUsername(tmpLoan.getEmail());
		OutstandingFee result = saveOutstandingFee(outstandingFee);

		if (Objects.nonNull(tmpCorpass)) {
			tmpCorpass.setStatus("Lost");
			// Set loan to lost
			loanService.updateLoanStatus(tmpLoan, "Lost");

			List<Loan> informList = new ArrayList<>();
			informList = loanService.getAllLoansAfterTheDate(tmpLoan.getLoanPassDate());

			if (informList != null && informList.size() > 0) {
				for (int i = 0; i < informList.size(); i++) {
					List<CorporatePass> corppassList = new ArrayList<>(informList.get(i).getCorppassList());
					if (corppassList != null && corppassList.size() > 0) {
						for (int j = 0; j < corppassList.size(); j++) {
							if (outstandingFee.getCorporatePassId().equals(corppassList.get(j).getId())) {
								// set loan status to "canceled" for whoever after that loan and send email to
								// those loan holder to inform them that the corporate pass is being lost.
								informList.get(i).setStatus("Canceled");
								// send email to those borrow whose loan is being cancelled due to the lost of
								// corporate pass
								emailService.sendStaffCancellationEmailOnOutstandingFee(corppassList.get(j),
										informList.get(i));
							}
							;
						}

					}

				}
			}
			// Update Corppass status to Lost
			corpassService.updateCorporatePass(tmpCorpass, outstandingFee.getCorporatePassId());
		}

		// Send Staff Email on outstanding fee
		emailService.sendOustandingEmailBorrower(outstandingFee);
		// Send Admin Email on outstanding fee (report lost of corpass)
		emailService.sendOustandingEmailAdmin(outstandingFee);

		return result;
	}
}
