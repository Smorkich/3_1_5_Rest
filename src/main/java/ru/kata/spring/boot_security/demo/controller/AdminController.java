package ru.kata.spring.boot_security.demo.controller;

import org.springframework.context.support.DefaultMessageSourceResolvable;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import ru.kata.spring.boot_security.demo.exceptionInfo.ExceptionInfo;
import ru.kata.spring.boot_security.demo.exceptionInfo.UserWithSuchLoginExist;
import ru.kata.spring.boot_security.demo.model.User;
import ru.kata.spring.boot_security.demo.service.UserService;
import java.security.Principal;
import java.util.List;
import java.util.stream.Collectors;


@RestController
@RequestMapping("/admin")
public class AdminController {

    private final UserService userService;

    public AdminController(UserService userService) {
        this.userService = userService;
    }
    @GetMapping("/userThis")
    public ResponseEntity<User> userGet (Principal principal){
        User user = userService.findByUsername(principal.getName());
        return new ResponseEntity<>(user, HttpStatus.OK);
    }

    @GetMapping("/user/{id}")
    public ResponseEntity<User> showUser(@PathVariable("id") Integer id) {
        return new ResponseEntity<>(userService.getUserById(id), HttpStatus.OK);
    }
    @GetMapping("/users")
    public ResponseEntity<List<User>> allUsers() {
        List<User> users = userService.getUsers();
        return new ResponseEntity<>(users, HttpStatus.OK);
    }

    @PostMapping("/newUser")
    public ResponseEntity<ExceptionInfo> adminAddUser(@RequestBody User user, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            String err = getErrors(bindingResult);
            return new ResponseEntity<>(new ExceptionInfo(err), HttpStatus.BAD_REQUEST);
        }
        try{
            userService.save(user);
            return new ResponseEntity<>(HttpStatus.CREATED);
        }
        catch (DataIntegrityViolationException ex) {
            throw new UserWithSuchLoginExist("User with such login exist");
        }
    }
    @PatchMapping("/edit")
    public ResponseEntity<ExceptionInfo> updateUser (@RequestParam("id") Long id, @RequestBody User user) {
            user.setId(id);
            userService.save(user);
            return new ResponseEntity<>(HttpStatus.OK);
    }
    @DeleteMapping("/delete")
    public ResponseEntity<ExceptionInfo> delete(@RequestParam("id") Long id) {
        userService.deleteUser(id);
        return new ResponseEntity<>(new ExceptionInfo("Пользователь удален"), HttpStatus.OK);
    }
    private String getErrors(BindingResult bindingResult){
        return bindingResult.getFieldErrors()
                .stream().map(DefaultMessageSourceResolvable::getDefaultMessage)
                .collect(Collectors.joining(";"));
    }
}
