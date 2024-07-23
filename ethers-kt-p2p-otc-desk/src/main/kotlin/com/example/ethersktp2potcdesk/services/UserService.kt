package com.example.ethersktp2potcdesk.services

import com.example.ethersktp2potcdesk.models.User
import org.springframework.stereotype.Service
import java.util.concurrent.ConcurrentHashMap

@Service
class UserService {
    private val users = ConcurrentHashMap<String, User>()

    fun register(user: User) {
        users[user.address] = user
    }

    fun findByAddress(address: String) = users[address]
}