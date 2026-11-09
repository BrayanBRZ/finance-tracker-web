# Finance Tracker API

API REST do Finance Tracker. O backend reúne as regras de negócio, o controle de acesso e a persistência em MySQL.

## Execução local

Use Java 21 e MySQL. Prepare o banco e as variáveis de ambiente conforme o [README principal](../README.md#configuração-local). Execute no diretório `backend` com o Maven Wrapper incluído no projeto.

```powershell
.\mvnw.cmd spring-boot:run
```

## Documentação da API

Consulte os contratos das rotas no [Swagger UI](http://localhost:8080/swagger-ui.html) ou na [especificação OpenAPI](http://localhost:8080/v3/api-docs) com o backend em execução.

Os controles de [segurança](../README.md#segurança) e a configuração de [deploy](../README.md#deploy) estão no README principal.
