package com.gymTrackerProject.gymTracker.repository;

import com.gymTrackerProject.gymTracker.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserRepository extends JpaRepository<User,Long> {
    List<User> email(String email);

    User findFirstByEmail(String email);
    boolean existsByEmail(String email);
}
