# Finance Tracker API

API REST para controle financeiro pessoal e compartilhado. A aplicação usa Spring Boot, Spring Security com JWT, JPA/Hibernate, MySQL e Spring Mail.

## Requisitos

- Java 21;
- MySQL em execução (o MySQL do XAMPP é compatível);
- conta Gmail com verificação em duas etapas e senha de app;
- Maven Wrapper incluído no projeto.

## Banco de dados

Crie o banco local antes de iniciar a API:

```sql
CREATE DATABASE finance;
```

O Hibernate cria e atualiza as tabelas automaticamente em desenvolvimento por meio de `spring.jpa.hibernate.ddl-auto=update`.

## Configuração

Copie os arquivos de exemplo para os nomes locais abaixo. Eles são ignorados pelo Git:

```powershell
Copy-Item .\src\main\resources\application-example.properties .\src\main\resources\application.properties
Copy-Item .\src\main\resources\application-secrets-example.properties .\src\main\resources\application-secrets.properties
```

Configure principalmente estas variáveis, por environment variables ou no arquivo local de secrets:

| Variável                      | Finalidade                                                 |
| ----------------------------- | ---------------------------------------------------------- |
| `DB_URL`                      | URL JDBC, por padrão `jdbc:mysql://localhost:3306/finance` |
| `DB_USERNAME` / `DB_PASSWORD` | Credenciais do MySQL                                       |
| `JWT_SECRET`                  | Chave com pelo menos 32 caracteres                         |
| `JWT_EXPIRATION`              | Validade do JWT em milissegundos; padrão de 24 horas       |
| `MAIL_USERNAME`               | Remetente Gmail; padrão `brayanbarrosdm@gmail.com`         |
| `MAIL_PASSWORD`               | Senha de app do Gmail                                      |
| `FRONTEND_BASE_URL`           | Origem do frontend; padrão `http://localhost:5173`         |
| `CORS_ALLOWED_ORIGINS`        | Origens separadas por vírgula                              |
| `EXPOSE_RESET_TOKEN`          | Expõe `debugToken` no ambiente local                       |

Para obter `MAIL_PASSWORD`, gere uma senha de app na conta Gmail. Não use a senha normal da conta e não versione esse valor.

## Execução

No diretório `backend`:

```powershell
.\mvnw.cmd spring-boot:run
```

## Endpoints e documentação

- Swagger: `http://localhost:8080/swagger-ui.html`
- Health check: `http://localhost:8080/actuator/health`
- Base da API: `http://localhost:8080/api/v1`

As rotas protegidas exigem o header:

```http
Authorization: Bearer <accessToken>
```

## Decisões de projeto

- Controllers recebem e devolvem DTOs; regras e autorização por recurso ficam nos services.
- Toda carteira possui um proprietário e uma associação de membro `OWNER`.
- `OWNER` administra a carteira e os membros; `EDITOR` altera transações; `VIEWER` apenas consulta.
- A recuperação de senha grava um token de uso único, válido por uma hora, e envia o link por e-mail.
