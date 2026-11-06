package com.cactus.practice.service.impl;

import com.cactus.practice.HibernateDao.PayoutHibernateDao;
import com.cactus.practice.dto.BalanceSummaryDto;
import com.cactus.practice.dto.PagedResponse;
import com.cactus.practice.dto.PayoutRequest;
import com.cactus.practice.entity.Payout;
import com.cactus.practice.repository.PayoutRepository;
import com.cactus.practice.service.PayoutService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;

@Service
@Transactional
public class PayoutServiceImpl implements PayoutService {

    private final PayoutRepository payoutRepository;
    private final PayoutHibernateDao payoutHibernateDao;

    @Autowired
    public PayoutServiceImpl(PayoutRepository payoutRepository, PayoutHibernateDao payoutHibernateDao) {
        this.payoutRepository = payoutRepository;
        this.payoutHibernateDao = payoutHibernateDao;
    }

    @Override
    @Transactional(readOnly = true)
    public List<Payout> getAllPayouts() {
        return payoutRepository.findAllByOrderByCreatedAtDesc();
    }

    @Override
    public Payout createPayout(PayoutRequest request) {
        BigDecimal amount = request.getAmount().setScale(2, RoundingMode.HALF_UP);
        String id = "po_1N" + UUID.randomUUID().toString().replace("-", "").substring(0, 10);
        String today = LocalDate.now().format(DateTimeFormatter.ofPattern("MMM dd, yyyy"));

        boolean isInstant = request.getType() != null && request.getType().toLowerCase().contains("instant");
        String arrival = isInstant ? "Within 30 minutes" : "Expected " + LocalDate.now().plusDays(2).format(DateTimeFormatter.ofPattern("MMM dd, yyyy"));
        String status = isInstant ? "Paid" : "In Transit";
        String statusType = isInstant ? "success" : "pending";

        Payout payout = new Payout(
                id,
                String.format("$%,.2f USD", amount.doubleValue()),
                amount,
                status,
                statusType,
                request.getDestination() != null ? request.getDestination() : "Chase Bank •••• 8841",
                today,
                arrival,
                request.getType() != null ? request.getType() : "Standard Automated"
        );

        return payoutRepository.save(payout);
    }

    @Override
    @Transactional(readOnly = true)
    public BalanceSummaryDto getBalanceSummary() {
        List<Payout> payouts = payoutRepository.findAll();
        double inTransit = 0.0;
        double totalPaid = 0.0;

        for (Payout p : payouts) {
            double amt = p.getRawAmount() != null ? p.getRawAmount().doubleValue() : parseCurrency(p.getAmount());
            if ("In Transit".equalsIgnoreCase(p.getStatus())) {
                inTransit += amt;
            } else if ("Paid".equalsIgnoreCase(p.getStatus())) {
                totalPaid += amt;
            }
        }

        // Base available pool minus payouts
        double available = Math.max(0.0, 42850.00 - inTransit);

        return new BalanceSummaryDto(
                String.format("$%,.2f", available),
                String.format("$%,.2f", inTransit),
                String.format("$%,.2f", totalPaid),
                available,
                inTransit
        );
    }

    @Override
    @Transactional(readOnly = true)
    public PagedResponse<Payout> filterPayouts(String search, int page, int size, String sortBy, String sortDir) {
        Page<Payout> pagedResult = payoutHibernateDao.filter(search, page, size, sortBy, sortDir);
        return new PagedResponse<>(
                pagedResult.getContent(),
                pagedResult.getNumber(),
                pagedResult.getSize(),
                pagedResult.getTotalElements(),
                pagedResult.getTotalPages(),
                pagedResult.isLast()
        );
    }

    private double parseCurrency(String formatted) {
        if (formatted == null) return 0.0;
        try {
            String clean = formatted.replaceAll("[^0-9.]", "");
            return Double.parseDouble(clean);
        } catch (Exception e) {
            return 0.0;
        }
    }
}
