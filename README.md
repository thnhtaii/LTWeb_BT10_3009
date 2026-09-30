# BÀI TẬP 10: XÁC THỰC VÀ PHÂN QUYỀN VỚI JSON WEB TOKEN (JWT) TRÊN SPRING BOOT 3 & SPRING SECURITY 6

> **Môn học:** Lập trình Web  
> **Sinh viên thực hiện:** Nguyễn Thanh Tài  
> **Mã nguồn GitHub:** [https://github.com/thnhtaii/LTWeb_BT10_3009](https://github.com/thnhtaii/LTWeb_BT10_3009)

---

## 📌 Giới thiệu dự án

Dự án triển khai cơ chế xác thực không trạng thái (**Stateless Authentication**) sử dụng **JSON Web Token (JWT)** trên nền tảng **Spring Boot 3** và **Spring Security 6**, kết hợp với cơ sở dữ liệu **Microsoft SQL Server / MySQL** và giao diện người dùng tương tác thông qua **AJAX & Thymeleaf**.

Dự án bao gồm 2 phần:
1. **Bài tập ví dụ theo bài giảng JWT:** Triển khai đầy đủ 10 bước trong slide bài giảng `04_JWT.pdf` sử dụng bộ thư viện JJWT `0.12.6`.
2. **Bài tập mở rộng:** Sử dụng thư viện **Nimbus JOSE + JWT** (`com.nimbusds:nimbus-jose-jwt`) thay thế cho JJWT.

---

## 🛠️ Công nghệ sử dụng (Tech Stack)

- **Ngôn ngữ:** Java 17+ (Tương thích Java 17, 21, 26)
- **Framework:** Spring Boot 3.3.4
- **Bảo mật:** Spring Security 6 (Stateless Session, JWT Filter)
- **Thư viện JWT:** 
  - `io.jsonwebtoken` (JJWT v0.12.6: `jjwt-api`, `jjwt-impl`, `jjwt-jackson`)
  - `com.nimbusds` (Nimbus JOSE + JWT v9.40)
- **ORM / Database Access:** Spring Data JPA / Hibernate 6
- **Cơ sở dữ liệu:** Microsoft SQL Server (SQLEXPRESS) & MySQL
- **Frontend / Giao diện:** Thymeleaf, HTML5, Bootstrap 5, jQuery AJAX
- **Công cụ kiểm thử:** Postman, JUnit 5, Spring MockMvc

---

## 📂 Cấu trúc thư mục dự án

```
BT10_3009/
├── pom.xml                               # Quản lý dependencies & build plugin
├── README.md                             # Tài liệu hướng dẫn dự án
├── jwt_springboot3.sql                   # Script tạo Database & Bảng dữ liệu
└── src/
    ├── main/
    │   ├── java/vn/iotstar/
    │   │   ├── JwtSpringboot3Application.java    # Class khởi chạy ứng dụng
    │   │   ├── configs/
    │   │   │   ├── ApplicationConfiguration.java # Cấu hình Beans (UserDetailsService, PasswordEncoder,...)
    │   │   │   ├── SecurityConfiguration.java    # Cấu hình SecurityFilterChain & CORS
    │   │   │   └── GlobalExceptionHandler.java   # Xử lý ngoại lệ toàn cục (@RestControllerAdvice)
    │   │   ├── controllers/
    │   │   │   ├── AuthenticationController.java # API /auth/signup & /auth/login
    │   │   │   ├── UserController.java           # API /users/me & /users/
    │   │   │   └── AuthController.java           # Controller điều hướng View Thymeleaf
    │   │   ├── entity/
    │   │   │   └── User.java                     # Entity User kế thừa UserDetails, Serializable
    │   │   ├── filter/
    │   │   │   └── JwtAuthenticationFilter.java  # Bộ lọc xác thực Header Bearer Token
    │   │   ├── models/
    │   │   │   ├── LoginResponse.java            # Model trả về chuỗi token & expiresIn
    │   │   │   ├── LoginUserModel.java           # DTO đăng nhập (email, password)
    │   │   │   └── RegisterUserModel.java        # DTO đăng ký (email, password, fullName)
    │   │   ├── repository/
    │   │   │   └── UserRepository.java           # Interface truy vấn User qua email
    │   │   └── services/
    │   │       ├── AuthenticationService.java    # Nghiệp vụ đăng ký & đăng nhập
    │   │       ├── JwtService.java               # Triển khai JWT theo JJWT 0.12.6
    │   │       ├── NimbusJwtService.java         # Triển khai JWT theo Nimbus JOSE + JWT
    │   │       └── UserService.java              # Lấy danh sách người dùng
    │   └── resources/
    │       ├── application.properties            # Cấu hình kết nối SQL Server & Secret Key JWT
    │       ├── static/js/mainjs.js               # AJAX gọi API, lưu localStorage.token, Logout
    │       └── templates/
    │           ├── login.html                    # Giao diện Đăng nhập AJAX
    │           └── profile.html                  # Giao diện Thông tin cá nhân AJAX
    └── test/
        ├── java/vn/iotstar/JwtAuthenticationTests.java # Bộ kiểm thử tích hợp tự động
        └── resources/application-test.properties       # Cấu hình H2 database cho kiểm thử
```

---

## ⚙️ Hướng dẫn cài đặt & Cấu hình Cơ sở dữ liệu

### 1. Tạo Database trên Microsoft SQL Server
Chạy script trong file [jwt_springboot3.sql](jwt_springboot3.sql):
```sql
CREATE DATABASE BT10_3009;
GO

USE BT10_3009;
GO

CREATE TABLE users (
    id INT IDENTITY(1,1) PRIMARY KEY,
    full_name NVARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    images NVARCHAR(500) NULL,
    created_at DATETIME2 DEFAULT GETDATE(),
    updated_at DATETIME2 DEFAULT GETDATE()
);
GO

-- Thêm tài khoản mẫu:
INSERT INTO users (full_name, email, password, images, created_at, updated_at)
VALUES (
    N'Thanh Tài',
    'thanhtai@gmail.com',
    '$2a$10$OclhnbFWYhC9KyWGgF8VVO9LP/F4WBB5GJJbh1uz7tNoGGbG0Jo02', -- Mật khẩu: 123456
    'https://ui-avatars.com/api/?name=Thanh+Tai&background=0d6efd&color=fff',
    GETDATE(),
    GETDATE()
);
GO
```

### 2. Cấu hình file `application.properties`
```properties
spring.application.name=JWT_springboot3
server.port=8005

# Cấu hình Microsoft SQL Server (SQLEXPRESS)
spring.datasource.url=jdbc:sqlserver://localhost:64078;databaseName=BT10_3009;encrypt=true;trustServerCertificate=true
spring.datasource.driverClassName=com.microsoft.sqlserver.jdbc.SQLServerDriver
spring.datasource.username=sa
spring.datasource.password=123456

# Hibernate
spring.jpa.hibernate.ddl-auto=update
spring.jpa.open-in-view=false
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.SQLServerDialect

# Cấu hình Secret Key JWT (HMAC-SHA256) & Thời gian sống (1 giờ = 3600000 ms)
security.jwt.secret-key=3cfa76ef14937c1c0ea519f8fc057a80fcd04a7420f8e8bcd0a7567c272e007b
security.jwt.expiration-time=3600000
```

---

## 🚀 Hướng dẫn khởi chạy ứng dụng

### Cách 1: Sử dụng Terminal / Command Line
```bash
mvn spring-boot:run
```

### Cách 2: Sử dụng Spring Tool Suite (STS) / Eclipse
1. Mở IDE, import project dạng **Existing Maven Projects**.
2. Chuột phải vào project `BT10_3009` ➔ Chọn **Run As** ➔ **Spring Boot App**.
3. Cổng truy cập mặc định: `http://localhost:8005`.

---

## 🧪 Hướng dẫn kiểm thử chi tiết

### Cách 1: Kiểm thử trên Giao diện Web (AJAX)
1. Mở trình duyệt và truy cập: [http://localhost:8005/login](http://localhost:8005/login)
2. Điền thông tin tài khoản:
   - **Email:** `thanhtai@gmail.com`
   - **Password:** `123456`
3. Bấm **Login**:
   - Hệ thống tự động nhận chuỗi JWT Token và lưu vào `localStorage.token`.
   - Tự động chuyển hướng sang trang [http://localhost:8005/user/profile](http://localhost:8005/user/profile).
   - AJAX gọi API `/users/me` đính kèm header `Authorization: Bearer <token>` để hiển thị thông tin người dùng và Avatar.
4. Bấm **Logout**: Hệ thống xóa token trong `localStorage` và chuyển về trang đăng nhập.

---

### Cách 2: Kiểm thử bằng Postman / REST Client

#### 1. Đăng ký tài khoản (`POST /auth/signup`)
- **URL:** `http://localhost:8005/auth/signup`
- **Method:** `POST`
- **Headers:** `Content-Type: application/json`
- **Body (raw JSON):**
  ```json
  {
    "fullName": "Thanh Tài",
    "email": "thanhtai.demo@gmail.com",
    "password": "123456"
  }
  ```
- **Response (200 OK):**
  ```json
  {
    "id": 2,
    "fullName": "Thanh Tài",
    "email": "thanhtai.demo@gmail.com",
    "createdAt": "2026-09-30T02:44:02.092+00:00",
    "enabled": true
  }
  ```

#### 2. Đăng nhập lấy JWT Token (`POST /auth/login`)
- **URL:** `http://localhost:8005/auth/login`
- **Method:** `POST`
- **Body (raw JSON):**
  ```json
  {
    "email": "thanhtai.demo@gmail.com",
    "password": "123456"
  }
  ```
- **Response (200 OK):**
  ```json
  {
    "token": "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ0aGFuaHRhaS5kZW1vQGdtYWlsLmNvbSIsImlhdCI6MTc5MDczNjI0MiwiZXhwIjoxNzkwNzM5ODQyfQ...",
    "expiresIn": 3600000
  }
  ```

#### 3. Lấy thông tin cá nhân (`GET /users/me`)
- **URL:** `http://localhost:8005/users/me`
- **Method:** `GET`
- **Headers:** `Authorization: Bearer <chuỗi_token_ở_bước_2>`
- **Response (200 OK):** Trả về thông tin người dùng đã xác thực.

#### 4. Lấy danh sách tất cả người dùng (`GET /users/`)
- **URL:** `http://localhost:8005/users/`
- **Method:** `GET`
- **Headers:** `Authorization: Bearer <chuỗi_token>`
- **Response (200 OK):** Danh sách mảng JSON toàn bộ users.

#### 5. Kiểm thử bảo mật:
- **Không có Token:** Gửi `GET /users/me` không kèm header ➔ Trả về `403 Forbidden`.
- **Token giả mạo/sai:** Gửi token không hợp lệ ➔ Trả về `403 Forbidden` / `401 Unauthorized`.

---

### Cách 3: Chạy kiểm thử tự động (Automated Unit & Integration Test)
Chạy lệnh trên terminal:
```bash
mvn test
```
Bộ test tự động trong class `JwtAuthenticationTests` sẽ kiểm thử tự động toàn diện quy trình xác thực và in ra:
```
[INFO] Tests run: 1, Failures: 0, Errors: 0, Skipped: 0
[INFO] BUILD SUCCESS
```

---

## 📌 Danh sách các bước triển khai theo Slide bài giảng

| Bước | Nội dung triển khai | File nguồn |
| :---: | :--- | :--- |
| **Bước 1** | Khai báo Dependency JJWT 0.12.6, Nimbus, Security 6, Data JPA | `pom.xml` |
| **Bước 2** | Tạo Entity `User` implements `UserDetails, Serializable` | `entity/User.java` |
| **Bước 3** | Tạo các Data Transfer Objects / Models | `models/*` |
| **Bước 4** | Khởi tạo Repository (`UserRepository`) và các Services | `repository/*`, `services/*` |
| **Bước 5** | Cấu hình Beans trong `ApplicationConfiguration` | `configs/ApplicationConfiguration.java` |
| **Bước 6** | Bộ lọc xác thực `JwtAuthenticationFilter` (OncePerRequestFilter) | `filter/JwtAuthenticationFilter.java` |
| **Bước 7** | Cấu hình bảo mật phân quyền & CORS trong `SecurityConfiguration` | `configs/SecurityConfiguration.java` |
| **Bước 8** | Xây dựng REST Controller (`AuthenticationController`, `UserController`) | `controllers/*` |
| **Bước 9** | Kiểm thử các API Endpoints với Postman | Postman / JUnit Test |
| **Bước 10**| Xử lý ngoại lệ toàn cục & Giao diện đăng nhập, profile qua AJAX | `GlobalExceptionHandler.java`, `templates/*`, `mainjs.js` |
