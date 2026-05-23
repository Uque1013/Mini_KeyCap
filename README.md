# 📍 Cyber Keycap

> **키캡**이 너무 좋아서 다양한 키캡들의 소리를 듣고싶어 제작한 온라인 서비스입니다.

---

### ✨ 주요 기능
* **키캡 누르기**: 키캡을 누르면서 해당 키캡의 소리 듣기
* **키캡 선택**: 듣고 싶은 소리의 키캡 선택
* **개수 선택**: 동시에 누르고싶은 키캡 수 선택

### 🛠 개발 기간 
* 2026.05.20 ~ 2026.05.31

### 🛠 기술 스택
* **Backend**: Java 17, Spring Boot 3.x, MyBatis
* **Frontend**: HTML5, CSS3, JavaScript, Thymeleaf

---

### 📂 프로젝트 구조
```text
src/main/
  ├── java/com/cyber/keycap/
  │    ├── controller/      # API 및 페이지 라우팅
  │    ├── service/         # 비즈니스 로직
  │    ├── mapper/          # MyBatis 매퍼 인터페이스
  └── resources/
       ├── static/          # CSS, JS 정적 파일
       └── templates/       # HTML(Thymeleaf) 파일
```
---

### 💡 실행 방법
1. 프로젝트 실행 후 `http://localhost:8080`에 접속합니다.
