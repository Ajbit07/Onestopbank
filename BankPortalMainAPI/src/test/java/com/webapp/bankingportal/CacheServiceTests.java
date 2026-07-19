package com.webapp.bankingportal;

import com.webapp.bankingportal.service.CacheService;
import com.webapp.bankingportal.service.CacheServiceImpl;
import com.webapp.bankingportal.type.CacheKeyType;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

class CacheServiceTests {

    private CacheService cacheService;

    @BeforeEach
    void setUp() {
        cacheService = new CacheServiceImpl();
    }

    @Test
    void putAndGet_returnsStoredValue() {
        cacheService.put(CacheKeyType.IDEMPOTENCY, "hello", "a", "b", "c");

        Optional<String> value = cacheService.get(CacheKeyType.IDEMPOTENCY, "a", "b", "c");

        assertTrue(value.isPresent());
        assertEquals("hello", value.get());
    }

    @Test
    void get_missingKey_returnsEmpty() {
        Optional<String> value = cacheService.get(CacheKeyType.IDEMPOTENCY, "x", "y", "z");

        assertTrue(value.isEmpty());
    }

    @Test
    void getTyped_returnsTypedValue() {
        cacheService.put(CacheKeyType.IDEMPOTENCY, 42, "a", "b", "c");

        Optional<Integer> value = cacheService.get(CacheKeyType.IDEMPOTENCY, Integer.class, "a", "b", "c");

        assertTrue(value.isPresent());
        assertEquals(42, value.get());
    }

    @Test
    void getTyped_typeMismatch_returnsEmpty() {
        cacheService.put(CacheKeyType.IDEMPOTENCY, "not-a-number", "a", "b", "c");

        Optional<Integer> value = cacheService.get(CacheKeyType.IDEMPOTENCY, Integer.class, "a", "b", "c");

        assertTrue(value.isEmpty());
    }

    @Test
    void exists_reflectsPresence() {
        assertFalse(cacheService.exists(CacheKeyType.IDEMPOTENCY, "a", "b", "c"));

        cacheService.put(CacheKeyType.IDEMPOTENCY, "value", "a", "b", "c");

        assertTrue(cacheService.exists(CacheKeyType.IDEMPOTENCY, "a", "b", "c"));
    }

    @Test
    void delete_removesValue() {
        cacheService.put(CacheKeyType.IDEMPOTENCY, "value", "a", "b", "c");
        cacheService.delete(CacheKeyType.IDEMPOTENCY, "a", "b", "c");

        assertTrue(cacheService.get(CacheKeyType.IDEMPOTENCY, "a", "b", "c").isEmpty());
    }

    @Test
    void expiredEntry_returnsEmpty() throws InterruptedException {
        cacheService.put(CacheKeyType.IDEMPOTENCY, "value", 0, "a", "b", "c");

        Thread.sleep(5);

        assertTrue(cacheService.get(CacheKeyType.IDEMPOTENCY, "a", "b", "c").isEmpty());
    }
}
