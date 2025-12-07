package com.example.collector.model

import org.springframework.data.annotation.Id
import org.springframework.data.annotation.Version
import org.springframework.data.mongodb.core.mapping.Document
import java.time.LocalDateTime

enum class IssueStatus { OPEN, RESOLVED }

@Document(collection = "issues")
data class Issue(
    @Id
    val id: String? = null,
    val serviceName: String,
    val endpoint: String,
    val errorType: String, // e.g. "Slow API", "Broken API", "Rate Limit Violated"
    var status: IssueStatus = IssueStatus.OPEN,
    var resolvedBy: String? = null,
    var resolvedAt: LocalDateTime? = null,
    val createdAt: LocalDateTime = LocalDateTime.now(),
    
    @Version
    val version: Long? = null
)
