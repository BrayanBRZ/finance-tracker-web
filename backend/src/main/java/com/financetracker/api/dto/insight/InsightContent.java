package com.financetracker.api.dto.insight;

import java.util.List;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record InsightContent(
        @NotBlank @Size(max = 1200) String summary,
        @NotNull @Size(min = 1, max = 3) List<@NotBlank @Size(max = 400) String> observations,
        @NotNull @Size(min = 1, max = 3) List<@NotBlank @Size(max = 400) String> suggestions) {
}
