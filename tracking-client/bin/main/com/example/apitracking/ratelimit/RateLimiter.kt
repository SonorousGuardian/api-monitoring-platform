package com.example.apitracking.ratelimit

import com.example.apitracking.configuration.ApiTrackingProperties
import org.springframework.stereotype.Component
import java.util.concurrent.atomic.AtomicInteger
import java.util.concurrent.Executors
import java.util.concurrent.TimeUnit
import jakarta.annotation.PostConstruct

@Component
class RateLimiter(private val properties: ApiTrackingProperties) {

    private val requestCount = AtomicInteger(0)
    private val limit: Int get() = properties.rateLimit.limit

    @PostConstruct
    fun init() {
        // Reset counter every second
        Executors.newSingleThreadScheduledExecutor().scheduleAtFixedRate({
            requestCount.set(0)
        }, 1, 1, TimeUnit.SECONDS)
    }

    /**
     * Checks if the request is within the rate limit.
     * Increments the counter.
     * @return true if allowed, false if limit exceeded
     */
    fun tryAcquire(): Boolean {
        val current = requestCount.incrementAndGet()
        return current <= limit
    }
}
