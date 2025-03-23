package com.canhtv05.chatapp.controller;

import com.canhtv05.chatapp.common.Links;
import com.canhtv05.chatapp.common.Meta;
import com.canhtv05.chatapp.common.Pagination;
import com.canhtv05.chatapp.dto.ApiResponse;
import com.canhtv05.chatapp.dto.response.UserDetailResponse;
import com.canhtv05.chatapp.dto.response.UserResponse;
import com.canhtv05.chatapp.entity.User;
import com.canhtv05.chatapp.service.UserService;
import com.canhtv05.chatapp.util.BuildPageUrl;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class UserController {

    UserService userService;
    BuildPageUrl buildPageUrl;

    @GetMapping("/search")
    public ApiResponse<List<UserResponse>> searchUsersByFullNameOrEmail(@RequestParam(value = "q") String query,
                                                                        @RequestParam(value = "page", defaultValue =
                                                                                "1", required = false) int page,
                                                                        @RequestParam(value = "size", defaultValue =
                                                                                "10", required = false) int size) {
        if (page < 1) page = 1;
        if (size < 1) size = 10;
        if (size > 100) size = 100;

        Page<UserResponse> userPage = userService.searchUserByFullNameOrEmail(query, page, size);
        List<UserResponse> users = userPage.getContent();

        String url = "/users/search?q=%s&page=%d&size=%d";

        Links links = Links.builder()
                .previous(page > 1 ? buildPageUrl.buildPageUrl(url, query, page - 1, size) : null)
                .next(page < userPage.getTotalPages() ? buildPageUrl.buildPageUrl(url, query, page + 1, size) : null)
                .build();

        Pagination pagination = Pagination.builder()
                .total(userPage.getTotalElements())
                .count((long) userPage.getNumberOfElements())
                .perPage((long) userPage.getSize())
                .currentPage((long) page)
                .totalPages((long) userPage.getTotalPages())
                .links(links)
                .build();

        var meta = Meta.builder().pagination(pagination).build();

        return ApiResponse.<List<UserResponse>>builder()
                .message("Users found!")
                .data(users)
                .meta(meta)
                .build();
    }
}
