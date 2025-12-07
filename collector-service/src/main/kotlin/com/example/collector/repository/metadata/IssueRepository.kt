package com.example.collector.repository.metadata

import com.example.collector.model.Issue
import com.example.collector.model.IssueStatus
import org.springframework.data.mongodb.repository.MongoRepository
import org.springframework.stereotype.Repository

@Repository
interface IssueRepository : MongoRepository<Issue, String> {
    fun findByStatus(status: IssueStatus): List<Issue>
    // To check if an open issue already exists for this endpoint to avoid duplicates
    fun findByServiceNameAndEndpointAndStatus(serviceName: String, endpoint: String, status: IssueStatus): Issue?
}
