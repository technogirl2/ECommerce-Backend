package com.codewithangela.ecommerceapi.dao;

import com.codewithangela.ecommerceapi.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepo extends JpaRepository<User, Integer> {
    User findByUsername(String username);

}
