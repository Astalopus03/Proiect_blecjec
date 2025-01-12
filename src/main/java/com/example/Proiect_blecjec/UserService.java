package com.example.Proiect_blecjec;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;

    private final String jwtSecret = "your_secret_key"; // Asigură-te că secretul tău este configurat corect

    public User register(String username, String password) {
        User user = new User();
        user.setUsername(username);
        user.setPassword(passwordEncoder.encode(password));
        return userRepository.save(user);
    }

    public User authenticate(String username, String password) {
        // Autentificarea utilizatorului folosind AuthenticationManager
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(username, password)
        );

        // Obținerea detaliilor utilizatorului și returnarea obiectului User
        UserDetails userDetails = userDetailsService.loadUserByUsername(username);
        return userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    // Decodifică token-ul și obține username-ul
    public String getUsernameFromToken(String token) {
        Claims claims = Jwts.parser()
                .setSigningKey(jwtSecret)
                .parseClaimsJws(token)
                .getBody();

        return claims.getSubject();  // În mod normal, subiectul din token este username-ul
    }

    // Găsește utilizatorul pe baza username-ului
    public User getUserByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}
