package com.example.collector.controller

import com.example.collector.model.ApiLog
import com.example.collector.repository.logs.ApiLogRepository
import org.springframework.web.bind.annotation.*
import java.time.LocalDateTime

@RestController
@RequestMapping("/api/logs")
class LogController(
    private val apiLogRepository: ApiLogRepository
) {

    @GetMapping
    fun getLogs(
        @RequestParam(required = false) serviceName: String?
    ): List<ApiLog> {
        return if (serviceName != null) {
            apiLogRepository.findByServiceName(serviceName)
        } else {
            apiLogRepository.findAll()
        }
    }
}
