package ru.kata.spring.boot_security.demo.controller;

import org.springframework.context.support.DefaultMessageSourceResolvable;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
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
import ru.kata.spring.boot_security.demo.service.RoleService;
import ru.kata.spring.boot_security.demo.service.UserDetailServiceImpl;
import ru.kata.spring.boot_security.demo.service.UserService;
import java.security.Principal;
import java.util.List;
import java.util.stream.Collectors;


@RestController
@RequestMapping("/admin")
@CrossOrigin
public class AdminController {

    private final UserService userService;
    private final UserDetailServiceImpl userDetailService;
    private final RoleService roleService;

    public AdminController(UserService userService, UserDetailServiceImpl userDetailService, RoleService roleService) {
        this.userService = userService;
        this.userDetailService = userDetailService;
        this.roleService = roleService;
    }

    @GetMapping("/user/{id}")
    public ResponseEntity<User> showUser(@PathVariable("id") Integer id) {
        return new ResponseEntity<>(userService.getUserById(id), HttpStatus.FOUND);
    }
    @GetMapping("/users")
    public ResponseEntity<List<User>> allUsers() {
        List<User> users = userService.getUsers();
        return new ResponseEntity<>(users, HttpStatus.OK);
    }

//    @GetMapping("/admin/add")
//    public String adminAddPanel(Model model, Principal principal ) {
//        model.addAttribute("authorized",userDetailService.findByUsername(principal.getName()));
//        model.addAttribute("user", new User());
//        model.addAttribute("roles",roleService.getAllRole());
//        return "newUser";
//    }
    @PostMapping("/newUser")
    public ResponseEntity<ExceptionInfo> adminAddUser(@RequestBody User user, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            String err = getErrors(bindingResult);
            return new ResponseEntity<>(new ExceptionInfo(err), HttpStatus.BAD_REQUEST);
        }
        try{
            userService.addUser(user);
            return new ResponseEntity<>(HttpStatus.CREATED);
        }
        catch (DataIntegrityViolationException ex) {
            throw new UserWithSuchLoginExist("User with such login exist");
        }
    }
    @PatchMapping("/admin/edit/{id}")
    public String update (@ModelAttribute("user") User user) {
        userService.updateUser(user);
        return "redirect:/admin";
    }
    @DeleteMapping("/admin/delete")
    public String delete(@RequestParam("id") Long id) {
        userService.deleteUser(id);
        return "redirect:/admin";
    }
    private String getErrors(BindingResult bindingResult){
        return bindingResult.getFieldErrors()
                .stream().map(DefaultMessageSourceResolvable::getDefaultMessage)
                .collect(Collectors.joining(";"));
    }
}
