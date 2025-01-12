package com.example.Proiect_blecjec;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody AuthRequest request) {
        User user = userService.register(request.getUsername(), request.getPassword());
        return ResponseEntity.ok(user);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest request) {
        User user = userService.authenticate(request.getUsername(), request.getPassword());
        if (user != null) {
            String token = jwtUtil.generateToken(user.getUsername());
            String username = user.getUsername();
            System.out.println(username);
            return ResponseEntity.ok(new AuthResponse(token,username,"/game"));  // Redirecționare spre pagina jocului
        }
        return ResponseEntity.status(401).body("Invalid credentials");
    }
}
