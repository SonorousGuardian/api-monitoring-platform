package com.example.collector.model

import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.mapping.Document
import java.time.LocalDateTime

@Document(collection = "api_logs")
data class ApiLog(
    @Id
    val id: String? = null,
    val serviceName: String,
    val endpoint: String,
    val method: String,
    val statusCode: Int,
    val requestSize: Long,
    val responseSize: Long,
    val latencyMs: Long,
    val timestamp: LocalDateTime,
    val rateLimitHit: Boolean,
    val errorMessage: String?
)
