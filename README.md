# Finance Tracker

Aplicação web para controle financeiro pessoal e compartilhado. Permite organizar receitas e despesas em carteiras e compartilhar o acesso com outros usuários.

## Arquitetura

| Projeto | Tecnologias | Responsabilidade |
| --- | --- | --- |
| [`frontend/`](./frontend/) | React, Vite e Tailwind CSS | Interface web e consumo da API |
| [`backend/`](./backend/) | Java 21, Spring Boot, Spring Security, JPA/Hibernate e MySQL | Regras de negócio, controle de acesso e persistência |

O frontend se comunica com a API em `/api/v1`. A API usa JWT Bearer para autenticar as rotas protegidas.

## Pré-requisitos

- Node.js 20 ou superior e npm
- Java 21
- MySQL em execução
- Conta Gmail com senha de app para habilitar o envio de e-mails

## Configuração local

### 1. Banco de dados

Crie o banco utilizado pela API:

```sql
CREATE DATABASE finance;
```

### 2. Backend

A partir da raiz do repositório, configure as variáveis de ambiente ou copie o exemplo para um arquivo local ignorado pelo Git:

```powershell
Copy-Item .\backend\src\main\resources\application-secrets-example.properties .\backend\src\main\resources\application-secrets.properties
```

Defina as variáveis no ambiente. Para usar o arquivo local, preencha as propriedades correspondentes aos valores que precisar configurar.

| Variável | Descrição | Valor local padrão |
| --- | --- | --- |
| `DB_URL` | URL JDBC do MySQL | `jdbc:mysql://localhost:3306/finance` |
| `DB_USERNAME` / `DB_PASSWORD` | Credenciais do banco | `root` / vazio |
| `JWT_SECRET` | Chave obrigatória de assinatura JWT, aleatória e com pelo menos 32 bytes | — |
| `MAIL_USERNAME` / `MAIL_PASSWORD` | Conta Gmail e senha de app para recuperação de senha | — |
| `FRONTEND_BASE_URL` | URL usada nos links enviados por e-mail | `http://localhost:5173` |
| `CORS_ALLOWED_ORIGINS` | Origens liberadas pelo CORS, separadas por vírgula | `http://localhost:3000,http://localhost:5173` |
| `AI_ENABLED` | Habilita a integração com a API Gemini | `false` |
| `GEMINI_API_KEY` | Chave da API Gemini, usada somente no backend | — |

Para habilitar a IA com Gemini, defina `AI_ENABLED=true` e `GEMINI_API_KEY` no ambiente do backend. No arquivo local, use `app.ai.enabled=true` e preencha `app.ai.api-key` com a chave. Mantenha segredos fora das variáveis `VITE_`. Os ajustes opcionais e seus padrões estão em [application.properties](./backend/src/main/resources/application.properties).

Inicie a API:

```powershell
cd backend
.\mvnw.cmd spring-boot:run
```

### 3. Frontend

Em outro terminal, a partir da raiz do repositório, copie o exemplo de ambiente:

```powershell
Copy-Item .\frontend\.env.example .\frontend\.env
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

- [Swagger UI](http://localhost:8080/swagger-ui.html)
- [Especificação OpenAPI](http://localhost:8080/v3/api-docs)
- [Health check](http://localhost:8080/actuator/health)

As rotas privadas exigem o cabeçalho abaixo:

```http
Authorization: Bearer <accessToken>
```

## Decisões de projeto

- Controllers recebem e retornam DTOs. Regras de negócio e autorização por recurso ficam nos services.
- O banco usa identificadores numéricos internos, enquanto a API expõe UUIDs.
- O acesso às carteiras é controlado por papéis e verificado no backend.

## Segurança

- A API autentica com JWT Bearer, verifica permissões por recurso e protege senhas com BCrypt. A autenticação usa o cabeçalho `Authorization` e funciona sem cookies de sessão.
- A API valida entradas e usa consultas parametrizadas via JPA. A aplicação escapa conteúdo dinâmico e usa cabeçalhos de segurança, incluindo CSP, para reduzir o risco de XSS. `CORS_ALLOWED_ORIGINS` define as origens autorizadas.
- Rotas sensíveis têm limite de requisições. Em produção, guarde as credenciais no ambiente do backend e mantenha `EXPOSE_RESET_TOKEN=false`.

## Deploy

Para a demonstração, use o plano gratuito do TiDB Cloud Starter para o banco compatível com MySQL, do Render para a API e do Cloudflare Pages para o frontend. Após 15 minutos sem tráfego, o Render suspende a API e a primeira requisição seguinte pode levar cerca de um minuto. [TiDB Cloud Starter](https://docs.pingcap.com/tidbcloud/select-cluster-tier/) · [Render Free](https://render.com/docs/free) · [Cloudflare Pages](https://developers.cloudflare.com/pages/)

1. Envie a versão que deseja publicar para uma branch do GitHub. No TiDB Cloud, crie uma instância **Starter** com **MySQL Compatible** e limite de gastos `0`. Em **Connect**, selecione **Public** e copie o host, a porta e o usuário completo com o prefixo mostrado no painel. Defina a senha e use o banco vazio `test` para a demonstração. [Criação da instância](https://docs.pingcap.com/tidbcloud/create-tidb-cluster-serverless/) · [Conexão TLS](https://docs.pingcap.com/tidbcloud/secure-connections-to-serverless-clusters/)
2. No workspace **Hobby** do Render, crie um **Web Service** a partir dessa branch. Selecione **Docker** e a instância **Free**. Deixe **Root Directory** em branco e selecione `backend/Dockerfile` em **Dockerfile Path**. Em **Advanced**, configure `backend` como **Docker Build Context Directory** e `/actuator/health` como **Health Check Path**. Se o seletor mostrar `backend/` sem o `Dockerfile`, confirme que o arquivo foi enviado ao GitHub na branch selecionada e recarregue o formulário. A API usa a porta indicada pelo Render. Configure as variáveis abaixo. Para evitar cobranças por exceder a franquia do Render, mantenha o workspace sem forma de pagamento. [Docker no Render](https://render.com/docs/docker) · [Diretório raiz](https://render.com/docs/monorepo-support) · [Franquia do plano Free](https://render.com/docs/faq#all-of-my-services-run-on-free-instances-can-i-still-be-billed)
3. No serviço do Render, abra **Connect > Outbound**. Adicione as faixas CIDR listadas às regras de acesso do endpoint público do TiDB. Se a primeira tentativa falhar enquanto o acesso ao banco está sendo configurado, inicie um novo deploy no Render após adicionar as faixas. Aguarde `/actuator/health` retornar `UP`. [IPs de saída do Render](https://render.com/docs/outbound-ip-addresses) · [Endpoint público do TiDB](https://docs.pingcap.com/tidbcloud/connect-via-standard-connection-serverless/)
4. No Cloudflare, abra **Workers & Pages > Create application > Pages > Import an existing Git repository** e selecione a mesma branch. Use `frontend` como **Root directory**, `npm ci && npm run build` como **Build command** e `dist` como **Build output directory**. Defina `SKIP_DEPENDENCY_INSTALL=1` e `VITE_API_URL=https://<api>.onrender.com/api/v1`. Pages aplica o arquivo `_headers` gerado pelo build e serve `index.html` nas rotas do React. [Ambiente de build](https://developers.cloudflare.com/pages/configuration/build-image/) · [Cabeçalhos](https://developers.cloudflare.com/pages/configuration/headers/) · [Rotas SPA](https://developers.cloudflare.com/pages/configuration/serving-pages/)
5. Confirme a URL pública do frontend em `FRONTEND_BASE_URL` e `CORS_ALLOWED_ORIGINS` no Render. Valide `/swagger-ui.html`, cadastro, login, recuperação de senha, persistência, SSE entre dois membros de uma carteira, geração de PDF, Gemini e instalação da PWA. Acrescente os links públicos do frontend e do Swagger a este README após a validação.

### Variáveis da API no Render

| Variável | Valor |
| --- | --- |
| `DB_URL` | URL JDBC com TLS e verificação de identidade, conforme o modelo abaixo |
| `DB_USERNAME` / `DB_PASSWORD` | Usuário completo (por exemplo, `<prefixo>.root`, sem aspas) e senha do TiDB Cloud |
| `SPRING_JPA_DATABASE_PLATFORM` | `org.hibernate.dialect.TiDBDialect` |
| `JWT_SECRET` | Chave aleatória de pelo menos 32 bytes, exclusiva deste ambiente |
| `FRONTEND_BASE_URL` / `CORS_ALLOWED_ORIGINS` | `https://<projeto>.pages.dev`, sem barra no final |
| `SERVER_FORWARD_HEADERS_STRATEGY` | `native`, para que o Tomcat processe os cabeçalhos do proxy |
| `MANAGEMENT_HEALTH_MAIL_ENABLED` | `false`, para que o health check da API seja independente do SMTP |
| `EXPOSE_RESET_TOKEN` | `false` |
| `AI_ENABLED` / `GEMINI_API_KEY` | `true` e uma chave do [plano gratuito do Gemini](https://ai.google.dev/gemini-api/docs/pricing) para a demonstração de IA |

Substitua `<host>` pelo hostname mostrado em **Connect** e ajuste a porta se o painel indicar outra.

```text
jdbc:mysql://<host>:4000/test?sslMode=VERIFY_IDENTITY
```

Use o painel do Render para guardar as credenciais do banco, a chave JWT e a chave do Gemini. `VITE_API_URL` é pública. No PowerShell 7, gere o segredo JWT com o comando abaixo e copie o valor diretamente para o painel.

```powershell
[Convert]::ToBase64String([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(32))
```

### E-mail na hospedagem gratuita

O Render Free bloqueia a porta `587` usada pelo Gmail. Para habilitar boas-vindas e recuperação de senha, configure um remetente verificado no [Brevo Free](https://help.brevo.com/hc/en-us/articles/208589409-About-Brevo-s-pricing-plans) e use o [relay SMTP](https://help.brevo.com/hc/en-us/articles/7924908994450-Send-transactional-emails-using-Brevo-SMTP) na porta `2525`.

| Variável | Valor |
| --- | --- |
| `MAIL_HOST` | `smtp-relay.brevo.com` |
| `MAIL_PORT` | `2525` |
| `MAIL_USERNAME` | Login SMTP mostrado no painel do Brevo |
| `MAIL_PASSWORD` | Chave SMTP do Brevo |
| `MAIL_FROM` | Endereço do remetente verificado |
