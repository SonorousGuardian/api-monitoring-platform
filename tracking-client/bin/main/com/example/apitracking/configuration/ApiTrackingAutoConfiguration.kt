package com.example.apitracking.configuration

import com.example.apitracking.interceptor.ApiTrackingInterceptor
import com.example.apitracking.ratelimit.RateLimiter
import com.example.apitracking.service.LogSender
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty
import org.springframework.boot.context.properties.EnableConfigurationProperties
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.web.servlet.config.annotation.InterceptorRegistry
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer

@Configuration
@EnableConfigurationProperties(ApiTrackingProperties::class)
@ConditionalOnProperty(prefix = "monitoring", name = ["enabled"], havingValue = "true", matchIfMissing = true)
class ApiTrackingAutoConfiguration(
    private val properties: ApiTrackingProperties,
    private val logSender: LogSender,
    private val rateLimiter: RateLimiter
) : WebMvcConfigurer {

    @Bean
    fun apiTrackingInterceptor(): ApiTrackingInterceptor {
        return ApiTrackingInterceptor(properties, logSender, rateLimiter)
    }

    override fun addInterceptors(registry: InterceptorRegistry) {
        registry.addInterceptor(apiTrackingInterceptor())
            .addPathPatterns("/**") // Track all endpoints
            .excludePathPatterns("/actuator/**", "/error") // Exclude internal endpoints
    }
}
