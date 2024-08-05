package com.example.ethersktp2potcdesk.controllers

import com.example.ethersktp2potcdesk.models.Deal
import com.example.ethersktp2potcdesk.services.DealsService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RestController

@RestController
class DealsController(
    @Autowired private val dealsService: DealsService,
) {

    @GetMapping("/deals/all")
    fun getDealsForAccount(): List<Deal> = dealsService.fetchAllDeals()
}