package com.cactus.practice.service;

import com.cactus.practice.dto.BalanceSummaryDto;
import com.cactus.practice.dto.PagedResponse;
import com.cactus.practice.dto.PayoutRequest;
import com.cactus.practice.entity.Payout;

import java.util.List;

public interface PayoutService {
    List<Payout> getAllPayouts();
    Payout createPayout(PayoutRequest request);
    BalanceSummaryDto getBalanceSummary();
    PagedResponse<Payout> filterPayouts(String search, int page, int size, String sortBy, String sortDir);
}
