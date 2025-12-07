package com.example.apitracking.configuration

import org.springframework.boot.context.properties.ConfigurationProperties

@ConfigurationProperties(prefix = "monitoring")
data class ApiTrackingProperties(
    val enabled: Boolean = true,
    val collectorUrl: String = "http://localhost:8080/ingest",
    val serviceName: String = "unknown-service",
    val rateLimit: RateLimitProperties = RateLimitProperties()
)

data class RateLimitProperties(
    val limit: Int = 100 // Requests per second
)
