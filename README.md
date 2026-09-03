# Finance Tracker

Aplicação web para controle financeiro pessoal e compartilhado. Usuários podem registrar receitas e despesas, acompanhar o resumo financeiro de cada carteira e compartilhar carteiras com outros usuários de acordo com suas permissões.

## Arquitetura

| Projeto | Tecnologias | Responsabilidade |
| --- | --- | --- |
| [`frontend/`](./frontend/) | React, Vite, React Router, Tailwind CSS e Recharts | Interface, autenticação do cliente e consumo da API REST |
| [`backend/`](./backend/) | Java 21, Spring Boot, Spring Security, JWT, JPA/Hibernate e MySQL | Regras de negócio, persistência, autorização e documentação da API |

O frontend usa `VITE_API_URL` para se comunicar com a API. O backend expõe as rotas sob `/api/v1` e protege as rotas privadas com JWT Bearer.

## Pré-requisitos

- Node.js 20 ou superior e npm;
- Java 21;
- MySQL em execução;
- uma conta Gmail com senha de app caso queira habilitar o envio real de e-mails de recuperação de senha.

## Configuração local

### 1. Banco de dados

Crie o banco utilizado pela API:

```sql
CREATE DATABASE finance;
```

### 2. Backend

No diretório `backend`, crie o arquivo local de segredos a partir do exemplo:

```powershell
Copy-Item .\src\main\resources\application-secrets-example.properties .\src\main\resources\application-secrets.properties
```

Configure as variáveis abaixo no ambiente ou em `application-secrets.properties`:

| Variável | Descrição | Valor local padrão |
| --- | --- | --- |
| `DB_URL` | URL JDBC do MySQL | `jdbc:mysql://localhost:3306/finance` |
| `DB_USERNAME` / `DB_PASSWORD` | Credenciais do banco | `root` / vazio |
| `JWT_SECRET` | Chave de assinatura JWT, com pelo menos 32 caracteres | — |
| `JWT_EXPIRATION` | Validade do token em milissegundos | `86400000` |
| `MAIL_USERNAME` / `MAIL_PASSWORD` | Conta Gmail e senha de app para recuperação de senha | — |
| `FRONTEND_BASE_URL` | URL usada nos links enviados por e-mail | `http://localhost:5173` |
| `CORS_ALLOWED_ORIGINS` | Origens liberadas pelo CORS, separadas por vírgula | `http://localhost:3000,http://localhost:5173` |

Inicie a API:

```powershell
cd backend
.\mvnw.cmd spring-boot:run
```

### 3. Frontend

No diretório `frontend`, copie o exemplo de ambiente:

```powershell
Copy-Item .env.example .env
```

O valor necessário é:

```dotenv
VITE_API_URL=http://localhost:8080/api/v1
```

Instale as dependências e inicie o Vite:

```powershell
cd frontend
npm install
npm run dev
```

O frontend ficará disponível em `http://localhost:5173` e a API em `http://localhost:8080`.

## Comandos úteis

| Diretório | Comando | Finalidade |
| --- | --- | --- |
| `frontend` | `npm run lint` | Verifica regras de qualidade do código |
| `frontend` | `npm run build` | Gera o build de produção |
| `backend` | `.\mvnw.cmd test` | Executa os testes do backend |
| `backend` | `.\mvnw.cmd spring-boot:run` | Inicia a API localmente |

## API e observabilidade

- Swagger UI: [`http://localhost:8080/swagger-ui.html`](http://localhost:8080/swagger-ui.html)
- Health check: [`http://localhost:8080/actuator/health`](http://localhost:8080/actuator/health)
- Base da API: `http://localhost:8080/api/v1`

As rotas privadas exigem o cabeçalho abaixo:

```http
Authorization: Bearer <accessToken>
```

## Decisões de projeto

- Controllers recebem e retornam DTOs; regras de negócio e autorização por recurso ficam nos services.
- O banco usa identificadores numéricos internos, enquanto a API expõe UUIDs.
- Toda carteira tem um membro com papel `OWNER`; `EDITOR` pode alterar transações e `VIEWER` pode apenas consultá-las.
- Categorias são opcionais nas transações. No resumo, transações sem categoria são agrupadas como `Sem categoria`.
- O frontend armazena a sessão no `localStorage` quando o usuário opta por ser lembrado, ou no `sessionStorage` em sessões temporárias.
- Arquivos `.env` e `application-secrets.properties` são locais e não devem ser versionados.

Para detalhes específicos da API, consulte também o [README do backend](./backend/README.md). Para o frontend, consulte o [README do frontend](./frontend/README.md).
