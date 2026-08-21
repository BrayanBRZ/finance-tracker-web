package com.financetracker.api;

public final class Routes {

    private static final String API_V1 = "/api/v1";

    private Routes() {
    }

    public static final class Actuator {
        public static final String HEALTH = "/actuator/health";

        private Actuator() {
        }
    }

    public static final class Auth {
        public static final String BASE = API_V1 + "/auth";
        public static final String REGISTER = "/register";
        public static final String LOGIN = "/login";
        public static final String FORGOT_PASSWORD = "/forgot-password";
        public static final String RESET_PASSWORD = "/reset-password";

        private Auth() {
        }
    }

    public static final class Users {
        public static final String BASE = API_V1 + "/users";
        public static final String ME = "/me";
        public static final String PASSWORD = ME + "/password";

        private Users() {
        }
    }

    public static final class Categories {
        public static final String BASE = API_V1 + "/categories";
        public static final String BY_ID = "/{categoryId}";

        private Categories() {
        }
    }

    public static final class Wallets {
        public static final String BASE = API_V1 + "/wallets";
        public static final String BY_ID = "/{walletId}";
        public static final String MEMBERS = BASE + BY_ID + "/members";
        public static final String MEMBER_BY_USER_ID = MEMBERS + "/{userId}";
        public static final String TRANSACTIONS = BASE + BY_ID + "/transactions";
        public static final String TRANSACTION_BY_ID = TRANSACTIONS + "/{transactionId}";
        public static final String SUMMARY = BASE + BY_ID + "/summary";

        private Wallets() {
        }
    }
}
