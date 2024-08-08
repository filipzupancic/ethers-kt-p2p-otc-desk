package com.example.ethersktp2potcdesk.security

import com.example.ethersktp2potcdesk.services.UserService
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.http.HttpMethod
import org.springframework.security.authentication.AuthenticationManager
import org.springframework.security.authentication.ProviderManager
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.http.SessionCreationPolicy
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.security.web.SecurityFilterChain
import org.springframework.web.cors.CorsConfiguration
import org.springframework.web.cors.UrlBasedCorsConfigurationSource
import org.springframework.web.servlet.config.annotation.CorsRegistry
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer

@Configuration
class SecurityConfig {
    @Bean
    fun encoder(): PasswordEncoder = BCryptPasswordEncoder()

    @Bean
    fun cors() =
        object : WebMvcConfigurer {
            override fun addCorsMappings(registry: CorsRegistry) {
                registry
                    .addMapping("/**")
                    .allowedOrigins("*")
                    .allowedOriginPatterns("*")
                    .allowedMethods("*")
            }
        }

    @Bean
    fun chain(http: HttpSecurity): SecurityFilterChain {
        http
            .authorizeHttpRequests { requests ->
                requests
                    .requestMatchers(HttpMethod.GET, "/challenge/{address}")
                    .permitAll()
                    .requestMatchers(HttpMethod.POST, "/auth")
                    .permitAll()
                    .requestMatchers(HttpMethod.GET, "/deals/all")
                    .permitAll()
                    .anyRequest()
                    .authenticated()
            }.formLogin { loginConfigurer ->
                loginConfigurer.disable()
            }.csrf { csrfConfigurer ->
                csrfConfigurer.disable()
            }.logout { logoutConfigurer ->
                logoutConfigurer.disable()
            }.sessionManagement { sessionManagementConfigurer ->
                sessionManagementConfigurer.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            }.cors { corsConfigurer ->
                corsConfigurer.configurationSource(corsConfigurationSource())
            }

        return http.build()
    }

    @Bean
    fun corsConfigurationSource(): UrlBasedCorsConfigurationSource {
        val source = UrlBasedCorsConfigurationSource()
        val config =
            CorsConfiguration().apply {
                allowCredentials = true
                allowedOrigins = listOf("http://localhost", "http://localhost:80", "http://159.223.128.228/", "http://10.116.0.2/")
                allowedHeaders = listOf("Authorization", "Cache-Control", "Content-Type")
                allowedMethods = listOf("GET", "POST", "PUT", "DELETE", "OPTIONS")
            }
        source.registerCorsConfiguration("/**", config)
        return source
    }
}