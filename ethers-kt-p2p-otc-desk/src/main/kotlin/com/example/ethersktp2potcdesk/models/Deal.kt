package com.example.ethersktp2potcdesk.models

import java.math.BigInteger

data class Deal(
    val id: BigInteger,
    val userA: String,
    val userB: String,
    val tokenA: String,
    val tokenB: String,
    val amountA: BigInteger,
    val amountB: BigInteger,
    val userADeposited: Boolean,
    val userBDeposited: Boolean
)