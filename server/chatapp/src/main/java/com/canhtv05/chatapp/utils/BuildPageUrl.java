package com.canhtv05.chatapp.utils;

import org.springframework.stereotype.Component;

@Component
public class BuildPageUrl {

    public String buildPageUrl(String url, String query, int page, int size) {
        return String.format(url, query, page, size);
    }

    public String buildPageUrl(String url, int page, int size) {
        return String.format(url, page, size);
    }
}
