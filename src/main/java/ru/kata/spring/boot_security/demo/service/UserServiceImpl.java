package ru.kata.spring.boot_security.demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import ru.kata.spring.boot_security.demo.dao.DaoUser;
import ru.kata.spring.boot_security.demo.model.User;

import javax.transaction.Transactional;
import java.util.List;


@Service
public class UserServiceImpl implements UserService {

    private final DaoUser daoUser;
    private final PasswordEncoder bCryptPasswordEncoder;

    @Autowired
    public UserServiceImpl(DaoUser daoUser,  @Lazy PasswordEncoder bCryptPasswordEncoder) {
        this.daoUser = daoUser;
        this.bCryptPasswordEncoder = bCryptPasswordEncoder;
    }

    @Override
    public List<User> getUsers() {
        return daoUser.getUsers();
    }

    @Transactional
    @Override
    public void addUser(User user) {
        user.setPassword(bCryptPasswordEncoder.encode(user.getPassword()));
        daoUser.addUser(user);
    }

    @Transactional
    @Override
    public void deleteUser(long id) {
        daoUser.deleteUser(id);
    }

    @Transactional
    @Override
    public void updateUser(User user) {
        user.setPassword(bCryptPasswordEncoder.encode(user.getPassword()));
        daoUser.updateUser(user);
    }

    @Override
    public User getUserById(long id) {
        return daoUser.getUserById(id);
    }
}
