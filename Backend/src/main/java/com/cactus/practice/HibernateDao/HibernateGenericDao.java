package com.cactus.practice.HibernateDao;

import org.springframework.data.domain.Page;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.io.Serializable;
import java.util.List;
import java.util.Optional;
import java.util.Set;

public abstract class HibernateGenericDao<T, ID extends Serializable> implements IGenericDao<T, ID> {

    protected final JpaRepository<T, ID> repository;
    protected final HibernateDao<T> hibernateDao;

    public HibernateGenericDao(JpaRepository<T, ID> repository,
                               JpaSpecificationExecutor<T> specExecutor,
                               Set<String> allowedSearchFields,
                               Set<String> allowedSortFields,
                               String defaultSortField) {
        this.repository = repository;
        this.hibernateDao = new HibernateDao<>(
                specExecutor,
                allowedSearchFields,
                allowedSortFields,
                defaultSortField,
                HibernateDao.DEFAULT_SORT_DIRECTION
        );
    }

    @Override
    public T save(T entity) {
        return repository.save(entity);
    }

    @Override
    public Optional<T> findById(ID id) {
        return repository.findById(id);
    }

    @Override
    public List<T> findAll() {
        return repository.findAll();
    }

    @Override
    public void deleteById(ID id) {
        repository.deleteById(id);
    }

    @Override
    public boolean existsById(ID id) {
        return repository.existsById(id);
    }

    @Override
    public Page<T> filter(String search, int page, int size, String sortBy, String sortDir) {
        return hibernateDao.execute(search, page, size, sortBy, sortDir);
    }
}
