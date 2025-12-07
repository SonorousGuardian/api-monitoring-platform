package com.example.apitracking.interceptor

import com.example.apitracking.configuration.ApiTrackingProperties
import com.example.apitracking.model.ApiLog
import com.example.apitracking.ratelimit.RateLimiter
import com.example.apitracking.service.LogSender
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import org.springframework.web.servlet.HandlerInterceptor
import org.springframework.web.util.ContentCachingRequestWrapper
import org.springframework.web.util.ContentCachingResponseWrapper
import java.time.LocalDateTime

class ApiTrackingInterceptor(
    private val properties: ApiTrackingProperties,
    private val logSender: LogSender,
    private val rateLimiter: RateLimiter
) : HandlerInterceptor {

    private val startTimeKey = "startTime"

    override fun preHandle(request: HttpServletRequest, response: HttpServletResponse, handler: Any): Boolean {
        request.setAttribute(startTimeKey, System.currentTimeMillis())
        return true
    }

    override fun afterCompletion(
        request: HttpServletRequest,
        response: HttpServletResponse,
        handler: Any,
        ex: Exception?
    ) {
        val startTime = request.getAttribute(startTimeKey) as? Long ?: return
        val endTime = System.currentTimeMillis()
        val latency = endTime - startTime
        
        // Check rate limit (simulated check, doesn't block but flags)
        val isRateLimitHit = !rateLimiter.tryAcquire()

        // Calculate sizes (approximate if not wrapped)
        // Note: To get actual body sizes, we'd need a Filter to wrap requests/responses. 
        // For this assignment, we'll try to get content-length or estimate.
        val requestSize = request.contentLengthLong.takeIf { it != -1L } ?: 0L
        // Response size is harder in Interceptor without wrapping, we'll use header if available
        val responseSize = response.getHeader("Content-Length")?.toLongOrNull() ?: 0L

        val apiLog = ApiLog(
            serviceName = properties.serviceName,
            endpoint = request.requestURI,
            method = request.method,
            statusCode = response.status,
            requestSize = requestSize,
            responseSize = responseSize,
            latencyMs = latency,
            timestamp = LocalDateTime.now(),
            rateLimitHit = isRateLimitHit,
            errorMessage = ex?.message
        )

        logSender.sendLog(apiLog)
    }
}
