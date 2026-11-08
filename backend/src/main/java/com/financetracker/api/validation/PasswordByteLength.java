package com.financetracker.api.validation;

import java.lang.annotation.*;
import java.nio.charset.StandardCharsets;

import jakarta.validation.Constraint;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import jakarta.validation.Payload;

/** BCrypt's limit is measured in UTF-8 bytes, not Java characters. */
@Documented
@Constraint(validatedBy = PasswordByteLength.Validator.class)
@Target({ ElementType.FIELD, ElementType.PARAMETER, ElementType.RECORD_COMPONENT, ElementType.ANNOTATION_TYPE })
@Retention(RetentionPolicy.RUNTIME)
public @interface PasswordByteLength {
    String message() default "A senha deve ter no máximo 72 bytes em UTF-8.";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};

    class Validator implements ConstraintValidator<PasswordByteLength, String> {
        @Override
        public boolean isValid(String value, ConstraintValidatorContext context) {
            return value == null || value.getBytes(StandardCharsets.UTF_8).length <= 72;
        }
    }
}
