package com.example.collector.config

import org.springframework.boot.context.properties.ConfigurationProperties
import org.springframework.boot.autoconfigure.mongo.MongoProperties
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.data.mongodb.core.MongoTemplate
import org.springframework.data.mongodb.core.SimpleMongoClientDatabaseFactory
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories
import com.mongodb.client.MongoClients

@Configuration
@EnableMongoRepositories(
    basePackages = ["com.example.collector.repository.metadata"],
    mongoTemplateRef = "secondaryMongoTemplate"
)
class SecondaryMongoConfig {

    @Bean(name = ["secondaryMongoProperties"])
    @ConfigurationProperties(prefix = "mongodb.secondary")
    fun getSecondaryProperties(): MongoProperties {
        return MongoProperties()
    }

    @Bean(name = ["secondaryMongoTemplate"])
    fun secondaryMongoTemplate(): MongoTemplate {
        val properties = getSecondaryProperties()
        val client = MongoClients.create(properties.uri)
        return MongoTemplate(SimpleMongoClientDatabaseFactory(client, properties.database ?: "api_metadata_db"))
    }
}
