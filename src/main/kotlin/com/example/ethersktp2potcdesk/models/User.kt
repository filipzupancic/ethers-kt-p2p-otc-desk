package com.example.ethersktp2potcdesk.models

import java.util.UUID

data class User(
    val address: String,
    val nonce: String = UUID.randomUUID().toString(),
)