package com.cactus.practice.HibernateDao;

import com.cactus.practice.dto.SearchCriteria;
import com.cactus.practice.entity.Customer;
import com.cactus.practice.repository.CustomerRepository;
import jakarta.persistence.criteria.*;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;

import java.util.Collections;
import java.util.List;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class HibernateDaoTest {

    @Mock
    private CustomerRepository customerRepository;

    @Mock
    private Root<Customer> root;

    @Mock
    private CriteriaQuery<?> query;

    @Mock
    private CriteriaBuilder cb;

    @Mock
    private Path<String> stringPath;

    @Mock
    private Path<Integer> intPath;

    @Mock
    private Predicate predicate;

    @Test
    void testConstructors() {
        HibernateDao<Customer> dao1 = new HibernateDao<>();
        assertNotNull(dao1);

        HibernateDao<Customer> dao2 = new HibernateDao<>(customerRepository);
        assertNotNull(dao2);

        HibernateDao<Customer> dao3 = new HibernateDao<>(customerRepository, Set.of("name"), Set.of("id"));
        assertNotNull(dao3);

        HibernateDao<Customer> dao4 = new HibernateDao<>(customerRepository, Set.of("name"), Set.of("id"), "name", Sort.Direction.DESC);
        assertNotNull(dao4);
    }

    @Test
    void testParseSearchString() {
        assertTrue(HibernateDao.parseSearchString(null).isEmpty());
        assertTrue(HibernateDao.parseSearchString("   ").isEmpty());

        List<SearchCriteria> list = HibernateDao.parseSearchString("name:Hoang,status!Inactive,invalidPart");
        assertEquals(2, list.size());
        assertEquals("name", list.get(0).getKey());
        assertEquals(":", list.get(0).getOperation());
        assertEquals("Hoang", list.get(0).getValue());

        assertEquals("status", list.get(1).getKey());
        assertEquals("!", list.get(1).getOperation());
        assertEquals("Inactive", list.get(1).getValue());
    }

    @Test
    void testBuildPageable() {
        // Negative page, min size
        Pageable p1 = HibernateDao.buildPageable(-1, 0, null, null, null, "id", Sort.Direction.ASC);
        assertEquals(0, p1.getPageNumber());
        assertEquals(10, p1.getPageSize());
        assertEquals(Sort.Direction.ASC, p1.getSort().getOrderFor("id").getDirection());

        // Max size bound
        Pageable p2 = HibernateDao.buildPageable(2, 200, "name", "DESC", Set.of("name"), "id", Sort.Direction.ASC);
        assertEquals(2, p2.getPageNumber());
        assertEquals(100, p2.getPageSize());
        assertEquals(Sort.Direction.DESC, p2.getSort().getOrderFor("name").getDirection());

        // Invalid sort field outside whitelist
        Pageable p3 = HibernateDao.buildPageable(0, 10, "disallowedField", "ASC", Set.of("name"), "fallbackId", Sort.Direction.DESC);
        assertEquals("fallbackId", p3.getSort().iterator().next().getProperty());
    }

    @Test
    void testBuildSpecification_Empty() {
        Specification<Customer> spec = HibernateDao.buildSpecification(null, null);
        assertNotNull(spec);
        when(cb.conjunction()).thenReturn(predicate);
        Predicate p = spec.toPredicate(root, query, cb);
        assertEquals(predicate, p);
    }

    @Test
    void testBuildSpecification_WithStringAndNonString() {
        SearchCriteria c1 = new SearchCriteria("name", ":", "Hoang");
        SearchCriteria c2 = new SearchCriteria("status", "!", "Inactive");
        SearchCriteria c3 = new SearchCriteria("count", ":", 5);

        doReturn(stringPath).when(root).get("name");
        doReturn(String.class).when(stringPath).getJavaType();
        when(stringPath.as(String.class)).thenReturn(stringPath);
        when(cb.lower(stringPath)).thenReturn(stringPath);
        when(cb.like(eq(stringPath), eq("%hoang%"))).thenReturn(predicate);

        doReturn(stringPath).when(root).get("status");
        when(cb.notEqual(stringPath, "Inactive")).thenReturn(predicate);

        doReturn(intPath).when(root).get("count");
        doReturn(Integer.class).when(intPath).getJavaType();
        when(cb.equal(intPath, 5)).thenReturn(predicate);

        when(cb.and(any(Predicate[].class))).thenReturn(predicate);

        Specification<Customer> spec = HibernateDao.buildSpecification(List.of(c1, c2, c3), Set.of("name", "status", "count"));
        Predicate result = spec.toPredicate(root, query, cb);
        assertNotNull(result);
    }

    @Test
    void testExecuteWithPaging() {
        HibernateDao<Customer> dao = new HibernateDao<>(customerRepository, Set.of("name"), Set.of("name"));
        when(customerRepository.findAll(any(Specification.class), any(Pageable.class)))
                .thenReturn(new PageImpl<>(Collections.emptyList()));

        Page<Customer> page = dao.execute("name:Hoang", 0, 10, "name", "ASC");
        assertNotNull(page);
    }

    @Test
    void testExecuteWithoutPaging() {
        HibernateDao<Customer> dao = new HibernateDao<>(customerRepository, Set.of("name"), Set.of("name"));
        when(customerRepository.findAll(any(Specification.class))).thenReturn(Collections.emptyList());

        List<Customer> list = dao.execute("name:Hoang");
        assertNotNull(list);
    }
}
