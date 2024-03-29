package ru.kata.spring.boot_security.demo.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ru.kata.spring.boot_security.demo.model.User;
import ru.kata.spring.boot_security.demo.service.UserDetailServiceImpl;
import ru.kata.spring.boot_security.demo.service.UserService;

import java.security.Principal;

@RestController
@CrossOrigin
public class UserController {
    private final UserDetailServiceImpl userDetailService;

    public UserController(UserDetailServiceImpl userService) {
        this.userDetailService = userService;
    }

    @GetMapping("/")
    public ResponseEntity<User> showUserInfo (Principal principal){
        User user = userDetailService.findByUsername(principal.getName());
        return new ResponseEntity<>(user, HttpStatus.OK);
    }
}
