package com.canhtv05.chatapp.common;

import lombok.*;
import lombok.experimental.FieldDefaults;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Pagination {

    Long total;
    Long count;
    Long perPage;
    Long currentPage;
    Long totalPages;
    Links links;
}
