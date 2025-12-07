package com.example.collector.service

import com.example.collector.model.ApiLog
import com.example.collector.model.Issue
import com.example.collector.model.IssueStatus
import com.example.collector.repository.logs.ApiLogRepository
import com.example.collector.repository.metadata.IssueRepository
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class MetricService(
    private val apiLogRepository: ApiLogRepository,
    private val issueRepository: IssueRepository
) {

    private val logger = LoggerFactory.getLogger(MetricService::class.java)

    fun ingestLog(log: ApiLog) {
        // 1. Save Raw Log to Primary DB
        apiLogRepository.save(log)

        // 2. Analyze for Alerts/Issues
        analyzeForIssues(log)
    }

    private fun analyzeForIssues(log: ApiLog) {
        var issueType: String? = null

        if (log.rateLimitHit) {
            issueType = "Rate Limit Violated"
        } else if (log.statusCode >= 500) {
            issueType = "Broken API (5xx)"
        } else if (log.latencyMs > 500) {
            issueType = "Slow API (>500ms)"
        }

        if (issueType != null) {
            createOrUpdateIssue(log, issueType)
        }
    }

    private fun createOrUpdateIssue(log: ApiLog, errorType: String) {
        // Check if an OPEN issue already exists for this service/endpoint/type
        // Note: For simplicity, we lump all issues of a type together for an endpoint.
        val existingIssue = issueRepository.findByServiceNameAndEndpointAndStatus(
            log.serviceName, log.endpoint, IssueStatus.OPEN
        )

        if (existingIssue == null) {
            val newIssue = Issue(
                serviceName = log.serviceName,
                endpoint = log.endpoint,
                errorType = errorType,
                status = IssueStatus.OPEN
            )
            issueRepository.save(newIssue)
            logger.info("Created new issue: $errorType for ${log.serviceName} ${log.endpoint}")
        } else {
            // Already exists, maybe update last seen time or count?
            // For now, we just touch it or do nothing.
        }
    }
}
