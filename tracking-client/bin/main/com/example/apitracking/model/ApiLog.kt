package com.example.apitracking.model

import java.time.LocalDateTime

data class ApiLog(
    val serviceName: String,
    val endpoint: String,
    val method: String,
    val statusCode: Int,
    val requestSize: Long,
    val responseSize: Long,
    val latencyMs: Long,
    val timestamp: LocalDateTime = LocalDateTime.now(),
    val rateLimitHit: Boolean = false,
    val errorMessage: String? = null
)
