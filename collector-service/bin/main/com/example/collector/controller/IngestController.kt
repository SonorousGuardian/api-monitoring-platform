package com.example.collector.controller

import com.example.collector.model.ApiLog
import com.example.collector.service.MetricService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/ingest")
class IngestController(
    private val metricService: MetricService
) {

    @PostMapping
    fun ingest(@RequestBody log: ApiLog): ResponseEntity<Void> {
        metricService.ingestLog(log)
        return ResponseEntity.accepted().build()
    }
}
