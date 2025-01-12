package com.example.Proiect_blecjec;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class AuthResponse {
    private String token;
    private String username; // Adăugăm câmpul pentru username
    private String redirectUrl;

}
