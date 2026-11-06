package com.cactus.practice.HibernateDao;

import org.springframework.data.domain.Page;

import java.io.Serializable;
import java.util.List;
import java.util.Optional;

public interface IGenericDao<T, ID extends Serializable> {
    T save(T entity);
    Optional<T> findById(ID id);
    List<T> findAll();
    void deleteById(ID id);
    boolean existsById(ID id);
    Page<T> filter(String search, int page, int size, String sortBy, String sortDir);
}
