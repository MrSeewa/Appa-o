package com.example.evento;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableFeignClients // pal usuarioclinet papitoooo
public class EventoApplication {

    public static void main(String[] args) {
        SpringApplication.run(EventoApplication.class, args);
    }
}
