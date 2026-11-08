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

As entidades de negócio usam um `Long` apenas como chave técnica interna e expõem UUIDs na API. Como esta versão não inclui migração ou backfill para registros anteriores, recrie o schema ao atualizar uma instalação existente:

```sql
DROP DATABASE finance;
CREATE DATABASE finance;
```

Essa operação remove todos os dados locais. Execute-a manualmente somente em um ambiente de desenvolvimento descartável. Depois da atualização, tokens JWT emitidos por versões anteriores deixam de ser válidos e os usuários precisam autenticar novamente.

## Configuração

Copie apenas o arquivo de segredos para o nome local abaixo. Ele é ignorado pelo Git:

```powershell
Copy-Item .\src\main\resources\application-secrets-example.properties .\src\main\resources\application-secrets.properties
```

Configure principalmente estas variáveis, por environment variables ou no arquivo local de secrets:

| Variável                      | Finalidade                                                 |
| ----------------------------- | ---------------------------------------------------------- |
| `DB_URL`                      | URL JDBC, por padrão `jdbc:mysql://localhost:3306/finance` |
| `DB_USERNAME` / `DB_PASSWORD` | Credenciais do MySQL                                       |
| `JWT_SECRET`                  | Chave aleatória obrigatória com pelo menos 32 bytes, sem fallback |
| `JWT_EXPIRATION`              | Validade do JWT em milissegundos; padrão de 24 horas       |
| `MAIL_USERNAME`               | Remetente Gmail, sem conta pré-configurada                 |
| `MAIL_PASSWORD`               | Senha de app do Gmail                                      |
| `FRONTEND_BASE_URL`           | Origem do frontend; padrão `http://localhost:5173`         |
| `CORS_ALLOWED_ORIGINS`        | Origens separadas por vírgula                              |
| `EXPOSE_RESET_TOKEN`          | Padrão `false`; `true` exige `SPRING_PROFILES_ACTIVE=local` |
| `AUTH_RATE_LIMIT_MAX_REQUESTS` | Limite por IP/operação sensível; padrão `10`              |
| `AUTH_RATE_LIMIT_WINDOW_SECONDS` | Janela em segundos; padrão `60`                       |
| `AUTH_RATE_LIMIT_MAX_ENTRIES` | Limite de pares IP/operação em memória; padrão `10000`     |

Para obter `MAIL_PASSWORD`, gere uma senha de app na conta Gmail. Não use a senha normal da conta e não versione esse valor.

Os mapeamentos de variáveis estão em `application.properties`: o arquivo local é opcional quando o ambiente já fornece os segredos. Ele é lido do filesystem durante a execução local (a partir da raiz do projeto ou de `backend`), e o Maven exclui os arquivos de segredos do JAR. A API não inicia sem chave JWT válida. As decisões do requisito 1.6, os limites do rate limiting por instância/proxy e a configuração dos cabeçalhos em produção estão em [SECURITY.md](../SECURITY.md).

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

## Análise financeira por IA

`POST /api/v1/wallets/{walletId}/insights` recebe `startDate` e `endDate` no corpo JSON, exige JWT e associação à carteira. O período é inclusivo, com até 366 dias. Totais são calculados a partir do banco e as despesas são separadas das receitas por categoria, sem alterar o contrato do resumo/PDF.

Configure `AI_ENABLED=true`, `GEMINI_API_KEY` e `AI_MODEL` somente no servidor. O modelo deve suportar `generateContent` e respostas estruturadas. Sem configuração, a rota retorna `503` e as demais funcionalidades continuam disponíveis. As variáveis de timeout, limites, privacidade, formato da resposta e roteiro de validação estão detalhados na seção **Análise financeira por IA** do [README principal](../README.md#análise-financeira-por-ia).

`WalletInsightContextService` monta os dados dentro de uma transação de leitura; `WalletInsightService` chama `FinancialInsightProvider` após essa transação. `GeminiInsightProvider` usa HTTP com timeout e valida o JSON retornado. O cache limitado e os limites por usuário/carteira são em memória e por instância. Não há persistência de prompts nem alterações no schema.

## Decisões de projeto

- Controllers recebem e devolvem DTOs; regras e autorização por recurso ficam nos services.
- IDs numéricos permanecem privados na persistência; rotas, DTOs e o `sub` do JWT usam UUIDs.
- Identidade e timestamps UTC são compartilhados pelas entidades de negócio por meio de uma classe base mapeada pelo JPA.
- Toda carteira possui um proprietário e uma associação de membro `OWNER`.
- `OWNER` administra a carteira e os membros; `EDITOR` altera transações; `VIEWER` apenas consulta.
- A recuperação de senha grava um token de uso único, válido por uma hora, e envia o link por e-mail.
