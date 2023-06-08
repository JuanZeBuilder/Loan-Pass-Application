package g2t1.corppass.controllers;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import g2t1.corppass.payloads.request.UpdateSystemSettingRequest;
import g2t1.corppass.payloads.response.ApiResponse;
import g2t1.corppass.services.SystemSettingService;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/admin/api/systemSettings")
public class SystemSettingController {
	@Autowired
	SystemSettingService systemSettingService;

	@GetMapping
	public ResponseEntity<?> getSystemSettingsList() {
		return ResponseEntity.ok(new ApiResponse<>(200, systemSettingService.fetchSystemSettingsList()));
	}

	@PutMapping
	public ResponseEntity<?> updateSystemSetting(@Valid @RequestBody UpdateSystemSettingRequest req) {
		systemSettingService.setSystemSetting(req.getSettingName(), req.getValue());
		return ResponseEntity.ok(new ApiResponse<>(200, "Successfully updated system setting."));
	}
}
