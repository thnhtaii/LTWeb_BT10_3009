package vn.iotstar;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import vn.iotstar.models.LoginResponse;
import vn.iotstar.models.LoginUserModel;
import vn.iotstar.models.RegisterUserModel;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class JwtAuthenticationTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void testCompleteJwtFlow() throws Exception {
        // 1. Register User Thanh Tài
        RegisterUserModel registerDto = new RegisterUserModel("thanhtai@gmail.com", "123456", "Thanh Tài");

        mockMvc.perform(post("/auth/signup")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(registerDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value("thanhtai@gmail.com"))
                .andExpect(jsonPath("$.fullName").value("Thanh Tài"));

        // 2. Login User to get JWT
        LoginUserModel loginDto = new LoginUserModel("thanhtai@gmail.com", "123456");

        MvcResult loginResult = mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").isNotEmpty())
                .andReturn();

        String responseBody = loginResult.getResponse().getContentAsString();
        LoginResponse loginResponse = objectMapper.readValue(responseBody, LoginResponse.class);
        String token = loginResponse.getToken();
        assertNotNull(token);

        // 3. Access /users/me with Bearer token
        mockMvc.perform(get("/users/me")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value("thanhtai@gmail.com"))
                .andExpect(jsonPath("$.fullName").value("Thanh Tài"));

        // 4. Access /users/ with Bearer token
        mockMvc.perform(get("/users/")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray());

        // 5. Access /users/me without token -> 403 Forbidden
        mockMvc.perform(get("/users/me"))
                .andExpect(status().isForbidden());

        // 6. Access /users/me with invalid token -> rejected
        mockMvc.perform(get("/users/me")
                        .header("Authorization", "Bearer invalid.jwt.token"))
                .andExpect(status().is4xxClientError());
    }
}
