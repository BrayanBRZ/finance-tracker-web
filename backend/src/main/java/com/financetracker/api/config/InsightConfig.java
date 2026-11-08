package com.financetracker.api.config;

import java.net.http.HttpClient;
import java.time.Duration;
import java.time.Clock;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.JdkClientHttpRequestFactory;
import org.springframework.web.client.RestClient;

@Configuration
@EnableConfigurationProperties(InsightConfig.Settings.class)
public class InsightConfig {
    @Bean
    Clock insightClock() {
        return Clock.systemUTC();
    }

    @ConfigurationProperties(prefix = "app.ai")
    public record Settings(boolean enabled, String apiKey, String model, int timeoutSeconds,
            int requestsPerMinute, int walletRequestsPerMinute) {
        public boolean configured() {
            return enabled && apiKey != null && !apiKey.isBlank()
                    && model != null && model.matches("[a-zA-Z0-9._-]{1,100}");
        }
    }

    @Bean
    RestClient geminiRestClient(RestClient.Builder builder, Settings settings) {
        HttpClient httpClient = HttpClient.newBuilder().connectTimeout(Duration.ofSeconds(5)).build();
        JdkClientHttpRequestFactory factory = new JdkClientHttpRequestFactory(httpClient);
        factory.setReadTimeout(Duration.ofSeconds(Math.clamp(settings.timeoutSeconds(), 1, 60)));
        return builder.baseUrl("https://generativelanguage.googleapis.com/v1beta")
                .requestFactory(factory).build();
    }
}
