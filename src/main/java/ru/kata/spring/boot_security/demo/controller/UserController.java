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
import ru.kata.spring.boot_security.demo.service.UserDetailServiceImpl;
import ru.kata.spring.boot_security.demo.service.UserService;
import java.security.Principal;

@Controller
public class UserController {

    private final UserService userService;
    private final  UserDetailServiceImpl userDetailService;

    public UserController(UserService userService, UserDetailServiceImpl userDetailService) {
        this.userService = userService;
        this.userDetailService = userDetailService;
    }

    @GetMapping("/user")
    public String index(Model model, Principal principal) {
        model.addAttribute("user", userDetailService.findByUsername(principal.getName()));
        return "userPage";
    }
    @GetMapping("/admin")
    public String showAllUsers(Model model, Principal principal) {
        model.addAttribute("user",userDetailService.findByUsername(principal.getName()));
        model.addAttribute("users", userService.getUsers());
        return "index";
    }

    @GetMapping("/admin/add")
    public String add(Model model) {
        model.addAttribute("user", new User());
        return "addUserPage";
    }
    @PostMapping("/admin/add")
    public String addUser(@ModelAttribute("user") User user) {
        userService.addUser(user);
        return "redirect:/admin";
    }
    @GetMapping("/admin/edit")
    public String edit(Model model, @RequestParam(value = "id") Long id) {
        model.addAttribute("user",userService.getUserById(id));
        return "/editPage";
    }
    @PatchMapping("/admin/edit")
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
