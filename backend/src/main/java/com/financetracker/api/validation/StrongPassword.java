package com.financetracker.api.validation;

import java.lang.annotation.Documented;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;
import jakarta.validation.ReportAsSingleViolation;
import jakarta.validation.constraints.Size;

@Documented
@Constraint(validatedBy = {})
@Size(min = 8)
@ReportAsSingleViolation
@Target({
        ElementType.FIELD,
        ElementType.PARAMETER,
        ElementType.RECORD_COMPONENT,
        ElementType.ANNOTATION_TYPE
})
@Retention(RetentionPolicy.RUNTIME)
public @interface StrongPassword {

    String message() default "A senha deve conter pelo menos 8 caracteres.";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}