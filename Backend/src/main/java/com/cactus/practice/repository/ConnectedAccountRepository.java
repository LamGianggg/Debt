package com.cactus.practice.repository;

import com.cactus.practice.entity.ConnectedAccount;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface ConnectedAccountRepository extends JpaRepository<ConnectedAccount, String>, JpaSpecificationExecutor<ConnectedAccount> {
}
