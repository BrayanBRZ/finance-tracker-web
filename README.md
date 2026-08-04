# Finance Tracker

Aplicação financeira com frontend React/Vite e API Spring Boot. Neste primeiro
incremento, o backend cobre autenticação e usuários; carteiras, categorias,
transações e dashboard permanecem em mocks no frontend.

## Requisitos

- JDK 21
- Node.js compatível com Vite 8
- MySQL/MariaDB do XAMPP na porta `3306`

Crie manualmente o banco `financeiro` pelo phpMyAdmin e mantenha o serviço
MySQL/MariaDB iniciado.

## Backend

No PowerShell:

```powershell
cd backend
$env:JWT_SECRET="uma-chave-local-com-pelo-menos-32-bytes"
.\mvnw.cmd spring-boot:run
```

Configuração disponível por variáveis:

| Variável | Padrão local |
| --- | --- |
| `DB_URL` | `jdbc:mysql://localhost:3306/financeiro...` |
| `DB_USERNAME` | `root` |
| `DB_PASSWORD` | vazio |
| `JWT_SECRET` | valor local de desenvolvimento; defina outro fora do ambiente local |
| `JWT_EXPIRATION` | `86400000` (24 horas, em ms) |
| `PASSWORD_RESET_EXPIRATION` | `3600000` (1 hora, em ms) |
| `CORS_ALLOWED_ORIGIN` | `http://localhost:5173` |

O Hibernate usa `ddl-auto=update`; não há Flyway neste incremento. A API fica
em `http://localhost:8080/api/v1`, o Swagger em
`http://localhost:8080/swagger-ui.html` e o health check em
`http://localhost:8080/actuator/health`.

Validações:

```powershell
.\mvnw.cmd test
.\mvnw.cmd package
```

## Frontend

Copie `frontend/.env.example` para `frontend/.env` quando quiser alterar o
provider. O padrão é manter toda a experiência atual em mocks:

```dotenv
VITE_AUTH_PROVIDER=mock
VITE_API_URL=http://localhost:8080/api/v1
```

Para autenticação real, use `VITE_AUTH_PROVIDER=api`. Nesse modo, autenticação
e usuário usam o backend, enquanto os recursos financeiros continuam locais.
“Lembre-se de mim” grava a sessão em `localStorage`; sem a marcação, a gravação
fica em `sessionStorage`.

```powershell
cd frontend
npm install
npm run dev
```

Validações:

```powershell
npm run lint
npm run build
```

## Recuperação de senha local

O endpoint sempre responde com uma mensagem neutra. Quando o e-mail existir,
o backend também retorna `debugToken` nesta etapa. O frontend imprime no
console do navegador o link completo
`/redefinir-senha/{debugToken}` para permitir o teste sem envio de e-mail.
