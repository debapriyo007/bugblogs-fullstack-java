package com.blogapp.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class ViewController {

    @RequestMapping(value = {
        "/",
        "/{path:(?!api|assets|favicon|vite|uploads)[^\\.]*}",
        "/{path:(?!api|assets|favicon|vite|uploads)[^\\.]*}/**"
    })
    public String forward() {
        return "forward:/index.html";
    }
}
