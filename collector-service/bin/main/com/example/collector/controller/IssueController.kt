package com.example.collector.controller

import com.example.collector.model.Issue
import com.example.collector.model.IssueStatus
import com.example.collector.repository.metadata.IssueRepository
import org.springframework.dao.OptimisticLockingFailureException
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import java.time.LocalDateTime

@RestController
@RequestMapping("/api/issues")
class IssueController(
    private val issueRepository: IssueRepository
) {

    @GetMapping
    fun getIssues(@RequestParam(required = false) status: IssueStatus?): List<Issue> {
        return if (status != null) {
            issueRepository.findByStatus(status)
        } else {
            issueRepository.findAll()
        }
    }

    @PostMapping("/{id}/resolve")
    fun resolveIssue(@PathVariable id: String): ResponseEntity<Any> {
        return try {
            val issue = issueRepository.findById(id).orElse(null) ?: return ResponseEntity.notFound().build()
            
            if (issue.status == IssueStatus.RESOLVED) {
                return ResponseEntity.badRequest().body("Issue already resolved")
            }

            issue.status = IssueStatus.RESOLVED
            issue.resolvedAt = LocalDateTime.now()
            // In a real app, get user from SecurityContext
            issue.resolvedBy = "admin" 

            issueRepository.save(issue)
            ResponseEntity.ok(issue)
        } catch (e: OptimisticLockingFailureException) {
            ResponseEntity.status(HttpStatus.CONFLICT).body("Issue was modified by another user. Please refresh.")
        }
    }
}
