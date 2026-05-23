package com.cyber.keycap;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication // 1. 스프링 부트 설정의 핵심 어노테이션 추가!
public class KeyCapApplication {

    public static void main(String[] args) { // 2. 실행을 위한 메인 메서드 추가!
        SpringApplication.run(KeyCapApplication.class, args);
    }

}