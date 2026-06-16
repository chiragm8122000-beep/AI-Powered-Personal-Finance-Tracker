package com.finance.tracker.controller;

import com.finance.tracker.entity.Category;
import com.finance.tracker.entity.TransactionType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/meta")
public class MetaController {
    @GetMapping
    public ResponseEntity<Map<String, Object>> getMetaData() {
        return ResponseEntity.ok(Map.of(
                "categories", Category.values(),
                "transactionTypes", TransactionType.values()
        ));
    }
}
