package com.example.collector.config

import org.springframework.boot.context.properties.ConfigurationProperties
import org.springframework.boot.autoconfigure.mongo.MongoProperties
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.context.annotation.Primary
import org.springframework.data.mongodb.core.MongoTemplate
import org.springframework.data.mongodb.core.SimpleMongoClientDatabaseFactory
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories
import com.mongodb.client.MongoClients

@Configuration
@EnableMongoRepositories(
    basePackages = ["com.example.collector.repository.logs"],
    mongoTemplateRef = "primaryMongoTemplate"
)
class PrimaryMongoConfig {

    @Primary
    @Bean(name = ["primaryMongoProperties"])
    @ConfigurationProperties(prefix = "mongodb.primary")
    fun getPrimaryProperties(): MongoProperties {
        return MongoProperties()
    }

    @Primary
    @Bean(name = ["primaryMongoTemplate"])
    fun primaryMongoTemplate(): MongoTemplate {
        val properties = getPrimaryProperties()
        val client = MongoClients.create(properties.uri)
        return MongoTemplate(SimpleMongoClientDatabaseFactory(client, properties.database ?: "api_logs_db"))
    }
}
