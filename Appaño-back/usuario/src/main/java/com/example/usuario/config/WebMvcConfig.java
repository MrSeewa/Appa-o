package com.example.usuario.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebMvcConfig implements WebMvcConfigurer {

    @Value("${storage.location}")
    private String uploadDir;

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        String rutaNormalizada = uploadDir.replace("\\", "/");
        if (!rutaNormalizada.endsWith("/")) {
            rutaNormalizada += "/";
        }
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations("file:" + rutaNormalizada);
    }
}

