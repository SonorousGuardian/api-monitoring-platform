package com.example.collector.repository.logs

import com.example.collector.model.ApiLog
import org.springframework.data.mongodb.repository.MongoRepository
import org.springframework.stereotype.Repository
import java.time.LocalDateTime

@Repository
interface ApiLogRepository : MongoRepository<ApiLog, String> {
    fun findByServiceName(serviceName: String): List<ApiLog>
    fun findByTimestampBetween(start: LocalDateTime, end: LocalDateTime): List<ApiLog>
}
