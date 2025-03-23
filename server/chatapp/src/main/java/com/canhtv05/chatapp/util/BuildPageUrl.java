package com.canhtv05.chatapp.util;

import org.springframework.stereotype.Component;

@Component
public class BuildPageUrl {

    public String buildPageUrl(String url ,String query, int page, int size) {
        return String.format(url, query, page, size);
    }
}
