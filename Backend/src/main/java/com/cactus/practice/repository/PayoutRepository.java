package com.cactus.practice.repository;

import com.cactus.practice.entity.Payout;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PayoutRepository extends JpaRepository<Payout, String>, JpaSpecificationExecutor<Payout> {
    List<Payout> findAllByOrderByCreatedAtDesc();
    List<Payout> findByStatusIgnoreCase(String status);
}
