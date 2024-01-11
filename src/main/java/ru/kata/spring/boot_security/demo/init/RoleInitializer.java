package ru.kata.spring.boot_security.demo.init;

import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import ru.kata.spring.boot_security.demo.model.Role;
import ru.kata.spring.boot_security.demo.model.User;
import ru.kata.spring.boot_security.demo.repositories.RoleRepository;
import ru.kata.spring.boot_security.demo.repositories.UserRepository;
import java.util.Arrays;
import java.util.Collections;
@Component
public class RoleInitializer implements CommandLineRunner {
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;


    public RoleInitializer(UserRepository userRepository, RoleRepository roleRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        if(userRepository.count() >= 2) {
            return;
        }
        Role userRole = new Role("ROLE_USER");
        Role adminRole = new Role("ROLE_ADMIN");
        roleRepository.save(userRole);
        roleRepository.save(adminRole);

        User user = new User();
        user.setName("first");
        user.setLastName("user");
        user.setEmail("user@mail.ru");
        user.setUsername("user@mail.ru");
        user.setPassword(passwordEncoder.encode("user"));
        user.setRoles(Collections.singletonList(userRole));
        userRepository.save(user);

        User admin = new User();
        admin.setName("first");
        admin.setLastName("admin");
        admin.setEmail("admin@mail.ru");
        admin.setUsername("admin@mail.ru");
        admin.setPassword(passwordEncoder.encode("admin"));
        admin.setRoles(Arrays.asList(userRole, adminRole));
        userRepository.save(admin);
    }
}
