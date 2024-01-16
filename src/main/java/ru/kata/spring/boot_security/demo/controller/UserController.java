package ru.kata.spring.boot_security.demo.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import ru.kata.spring.boot_security.demo.model.User;
import ru.kata.spring.boot_security.demo.service.RoleService;
import ru.kata.spring.boot_security.demo.service.UserDetailServiceImpl;
import ru.kata.spring.boot_security.demo.service.UserService;
import java.security.Principal;

@Controller
public class UserController {

    private final UserService userService;
    private final UserDetailServiceImpl userDetailService;
    private final RoleService roleService;

    public UserController(UserService userService, UserDetailServiceImpl userDetailService, RoleService roleService) {
        this.userService = userService;
        this.userDetailService = userDetailService;
        this.roleService = roleService;
    }

    @GetMapping("/user")
    public String showUser(Model model, Principal principal) {
        model.addAttribute("user", userDetailService.findByUsername(principal.getName()));
        return "userPage";
    }
    @GetMapping("/admin")
    public String adminPanel(Model model, Principal principal) {
        model.addAttribute("authorized",userDetailService.findByUsername(principal.getName()));
        model.addAttribute("users", userService.getUsers());
        model.addAttribute("roles", roleService.getAllRole());
        return "index";
    }

    @GetMapping("/admin/add")
    public String adminAddPanel(Model model, Principal principal ) {
        model.addAttribute("authorized",userDetailService.findByUsername(principal.getName()));
        model.addAttribute("user", new User());
        model.addAttribute("roles",roleService.getAllRole());
        return "newUser";
    }
    @PostMapping("/admin/add")
    public String adminAddUser(@ModelAttribute("user") User user) {
        userService.addUser(user);
        return "redirect:/admin";
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
}
