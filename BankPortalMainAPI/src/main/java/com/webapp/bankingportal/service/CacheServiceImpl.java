package com.webapp.bankingportal.service;

import com.webapp.bankingportal.type.CacheKeyType;

import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

/**
 * In-memory cache implementation with per-entry TTL.
 * Replaces the previous Redis-backed implementation - no external server needed.
 */
@Slf4j
@Service
public class CacheServiceImpl implements CacheService {

    private record CacheEntry(Object value, long expiresAtMillis) {
        boolean isExpired() {
            return System.currentTimeMillis() > expiresAtMillis;
        }
    }

    private final Map<String, CacheEntry> store = new ConcurrentHashMap<>();

    @Override
    public boolean exists(CacheKeyType cacheKeyType, String... keyArguments) {
        return get(cacheKeyType, keyArguments).isPresent();
    }

    @Override
    public Optional<String> get(CacheKeyType cacheKeyType, String... keyArguments) {
        return getRaw(acquireKey(cacheKeyType, keyArguments)).map(Object::toString);
    }

    @Override
    public <T> Optional<T> get(CacheKeyType cacheKeyType, Class<T> clazz, String... keyArguments) {
        Optional<Object> value = getRaw(acquireKey(cacheKeyType, keyArguments));
        if (value.isEmpty()) {
            return Optional.empty();
        }

        if (clazz.isInstance(value.get())) {
            return Optional.of(clazz.cast(value.get()));
        }

        log.warn("Value type mismatch. Expected: {}, Actual: {}",
                clazz.getSimpleName(), value.get().getClass().getSimpleName());
        return Optional.empty();
    }

    @Override
    public void put(CacheKeyType cacheKeyType, Object value, String... keyArguments) {
        put(cacheKeyType, value, cacheKeyType.getTtlSeconds(), keyArguments);
    }

    @Override
    public void put(CacheKeyType cacheKeyType, Object value, long ttlSeconds, String... keyArguments) {
        String key = acquireKey(cacheKeyType, keyArguments);
        store.put(key, new CacheEntry(value, System.currentTimeMillis() + ttlSeconds * 1000));
        log.debug("Cache stored: key={}", key);
    }

    @Override
    public void delete(CacheKeyType cacheKeyType, String... keyArguments) {
        String key = acquireKey(cacheKeyType, keyArguments);
        store.remove(key);
        log.debug("Cache deleted: key={}", key);
    }

    private Optional<Object> getRaw(String key) {
        CacheEntry entry = store.get(key);
        if (entry == null) {
            return Optional.empty();
        }
        if (entry.isExpired()) {
            store.remove(key);
            return Optional.empty();
        }
        return Optional.of(entry.value());
    }

    private String acquireKey(CacheKeyType cacheKeyType, String... keyArguments) {
        String key = cacheKeyType.generateKey();
        if (keyArguments.length != 0) {
            key = cacheKeyType.generateKey(keyArguments);
        }

        return key;
    }
}
