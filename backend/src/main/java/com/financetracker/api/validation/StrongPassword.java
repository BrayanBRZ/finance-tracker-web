package com.financetracker.api.validation;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;
import jakarta.validation.constraints.Pattern;
import java.lang.annotation.*;

@Documented
@Constraint(validatedBy = {})
@Pattern(
    regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^A-Za-z0-9]).{8,100}$",
    message = "Use pelo menos 8 caracteres, incluindo maiúscula, minúscula, número e símbolo"
)
@Target({ElementType.FIELD, ElementType.PARAMETER, ElementType.RECORD_COMPONENT, ElementType.ANNOTATION_TYPE})
@Retention(RetentionPolicy.RUNTIME)
public @interface StrongPassword {
    String message() default "Use pelo menos 8 caracteres, incluindo maiúscula, minúscula, número e símbolo";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}
