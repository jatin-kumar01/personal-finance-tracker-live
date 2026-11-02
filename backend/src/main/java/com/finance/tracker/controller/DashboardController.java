package com.finance.tracker.controller;

import com.finance.tracker.dto.CategorySummaryResponse;
import com.finance.tracker.dto.DashboardSummaryResponse;
import com.finance.tracker.dto.MonthlySummaryResponse;
import com.finance.tracker.security.CustomUserDetails;
import com.finance.tracker.service.DashboardService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping("/summary")
    public ResponseEntity<DashboardSummaryResponse> getOverallSummary(
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        DashboardSummaryResponse response = dashboardService.getOverallSummary(userDetails.getId());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/monthly-summary")
    public ResponseEntity<MonthlySummaryResponse> getMonthlySummary(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestParam(required = false) Integer year,
            @RequestParam(required = false) Integer month
    ) {
        LocalDate now = LocalDate.now();
        int targetYear = (year != null) ? year : now.getYear();
        int targetMonth = (month != null) ? month : now.getMonthValue();

        MonthlySummaryResponse response = dashboardService.getMonthlySummary(userDetails.getId(), targetYear, targetMonth);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/category-summary")
    public ResponseEntity<List<CategorySummaryResponse>> getCategorySummary(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestParam(required = false) String type
    ) {
        List<CategorySummaryResponse> responses = dashboardService.getCategorySummary(userDetails.getId(), type);
        return ResponseEntity.ok(responses);
    }
}
