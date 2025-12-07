package com.example.apitracking.service

import com.example.apitracking.configuration.ApiTrackingProperties
import com.example.apitracking.model.ApiLog
import org.slf4j.LoggerFactory
import org.springframework.boot.web.client.RestTemplateBuilder
import org.springframework.scheduling.annotation.Async
import org.springframework.stereotype.Service
import org.springframework.web.client.RestTemplate

@Service
class LogSender(
    private val properties: ApiTrackingProperties,
    restTemplateBuilder: RestTemplateBuilder
) {
    private val logger = LoggerFactory.getLogger(LogSender::class.java)
    private val restTemplate: RestTemplate = restTemplateBuilder.build()

    @Async
    fun sendLog(log: ApiLog) {
        try {
            // In a real scenario, we might batch these or use a message queue
            restTemplate.postForEntity(properties.collectorUrl, log, Void::class.java)
        } catch (e: Exception) {
            logger.error("Failed to send API log to collector: ${e.message}")
        }
    }
}
