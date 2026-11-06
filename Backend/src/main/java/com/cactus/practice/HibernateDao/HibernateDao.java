package com.cactus.practice.HibernateDao;

import com.cactus.practice.dto.SearchCriteria;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.Path;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class HibernateDao<T> {

    public static final int DEFAULT_PAGE = 0;
    public static final int DEFAULT_SIZE = 10;
    public static final int MIN_SIZE = 1;
    public static final int MAX_SIZE = 100;

    public static final String DEFAULT_SORT_FIELD = "id";
    public static final Sort.Direction DEFAULT_SORT_DIRECTION = Sort.Direction.ASC;

    private static final Pattern CRITERIA_PATTERN = Pattern.compile("([\\w.]+?)([:<>!])(.+)");

    private JpaSpecificationExecutor<T> repository;
    private Set<String> allowedSearchFields;
    private Set<String> allowedSortFields;
    private String defaultSortField = DEFAULT_SORT_FIELD;
    private Sort.Direction defaultSortDirection = DEFAULT_SORT_DIRECTION;

    public HibernateDao() {}

    public HibernateDao(JpaSpecificationExecutor<T> repository) {
        this.repository = repository;
    }

    public HibernateDao(JpaSpecificationExecutor<T> repository,
                        Set<String> allowedSearchFields,
                        Set<String> allowedSortFields) {
        this.repository = repository;
        this.allowedSearchFields = allowedSearchFields;
        this.allowedSortFields = allowedSortFields;
    }

    public HibernateDao(JpaSpecificationExecutor<T> repository,
                        Set<String> allowedSearchFields,
                        Set<String> allowedSortFields,
                        String defaultSortField,
                        Sort.Direction defaultSortDirection) {
        this.repository = repository;
        this.allowedSearchFields = allowedSearchFields;
        this.allowedSortFields = allowedSortFields;
        this.defaultSortField = defaultSortField != null ? defaultSortField : DEFAULT_SORT_FIELD;
        this.defaultSortDirection = defaultSortDirection != null ? defaultSortDirection : DEFAULT_SORT_DIRECTION;
    }

    // =========================================================================
    // SEARCH & FILTER LOGIC
    // =========================================================================

    public static List<SearchCriteria> parseSearchString(String search) {
        List<SearchCriteria> criteriaList = new ArrayList<>();
        if (search == null || search.trim().isEmpty()) {
            return criteriaList;
        }

        String[] parts = search.split(",");
        for (String part : parts) {
            Matcher matcher = CRITERIA_PATTERN.matcher(part.trim());
            if (matcher.find()) {
                criteriaList.add(new SearchCriteria(matcher.group(1), matcher.group(2), matcher.group(3)));
            }
        }
        return criteriaList;
    }

    public static <E> Specification<E> buildSpecification(List<SearchCriteria> criteriaList, Set<String> allowedFields) {
        if (criteriaList == null || criteriaList.isEmpty()) {
            return (root, query, cb) -> cb.conjunction();
        }

        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            for (SearchCriteria criteria : criteriaList) {
                if (allowedFields != null && !allowedFields.isEmpty() && !allowedFields.contains(criteria.getKey())) {
                    continue; // Skip fields outside whitelist
                }
                Path<?> path = resolvePath(root, criteria.getKey());
                String operation = criteria.getOperation();
                Object rawValue = criteria.getValue();

                if (path == null || rawValue == null) continue;

                if (":".equals(operation)) {
                    if (path.getJavaType() == String.class) {
                        predicates.add(cb.like(cb.lower(path.as(String.class)), "%" + rawValue.toString().toLowerCase() + "%"));
                    } else {
                        predicates.add(cb.equal(path, rawValue));
                    }
                } else if ("!".equals(operation)) {
                    predicates.add(cb.notEqual(path, rawValue));
                }
            }
            return predicates.isEmpty() ? cb.conjunction() : cb.and(predicates.toArray(new Predicate[0]));
        };
    }

    private static Path<?> resolvePath(Path<?> root, String property) {
        if (!property.contains(".")) {
            return root.get(property);
        }
        String[] parts = property.split("\\.");
        Path<?> current = root;
        for (String part : parts) {
            current = current.get(part);
        }
        return current;
    }

    // =========================================================================
    // PAGINATION & SORTING
    // =========================================================================

    public static Pageable buildPageable(int page, int size, String sortBy, String sortDir,
                                         Set<String> allowedSortFields, String fallbackField,
                                         Sort.Direction fallbackDir) {
        int validPage = Math.max(page, DEFAULT_PAGE);
        int validSize = (size < MIN_SIZE) ? DEFAULT_SIZE : Math.min(size, MAX_SIZE);

        String validSortBy = fallbackField != null ? fallbackField : DEFAULT_SORT_FIELD;
        if (sortBy != null && !sortBy.trim().isEmpty() && (allowedSortFields == null || allowedSortFields.contains(sortBy.trim()))) {
            validSortBy = sortBy.trim();
        }

        Sort.Direction direction = fallbackDir != null ? fallbackDir : DEFAULT_SORT_DIRECTION;
        if (sortDir != null && ("DESC".equalsIgnoreCase(sortDir.trim()) || "ASC".equalsIgnoreCase(sortDir.trim()))) {
            direction = Sort.Direction.fromString(sortDir.trim().toUpperCase());
        }

        return PageRequest.of(validPage, validSize, Sort.by(direction, validSortBy));
    }

    // =========================================================================
    // EXECUTION
    // =========================================================================

    public Page<T> execute(String search, int page, int size, String sortBy, String sortDir) {
        List<SearchCriteria> criteria = parseSearchString(search);
        Specification<T> spec = buildSpecification(criteria, this.allowedSearchFields);
        Pageable pageable = buildPageable(page, size, sortBy, sortDir, this.allowedSortFields, this.defaultSortField, this.defaultSortDirection);
        return this.repository.findAll(spec, pageable);
    }

    public List<T> execute(String search) {
        List<SearchCriteria> criteria = parseSearchString(search);
        Specification<T> spec = buildSpecification(criteria, this.allowedSearchFields);
        return this.repository.findAll(spec);
    }
}
