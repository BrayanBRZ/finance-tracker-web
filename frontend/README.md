# Finance Tracker Web

Frontend React do Finance Tracker. Ele consome a API Spring Boot do diretório `../backend` para autenticação, carteiras, categorias, transações e resumo financeiro.

## Pré-requisitos

- Node.js 20 ou superior;
- npm;
- API do Finance Tracker em execução, normalmente em `http://localhost:8080`.

## Configuração

Copie o arquivo de exemplo e ajuste a URL da API se necessário:

```powershell
Copy-Item .env.example .env
```

```dotenv
VITE_API_URL=http://localhost:8080/api/v1
```

`VITE_API_URL` é obrigatória porque define a base usada pelos serviços HTTP do frontend. Não versione o arquivo `.env` com configurações locais.

## Execução

```powershell
npm install
npm run dev
```

O Vite exibirá a URL local, normalmente `http://localhost:5173`.

## Scripts

| Comando | Finalidade |
| --- | --- |
| `npm run dev` | Inicia o servidor de desenvolvimento |
| `npm run lint` | Executa o ESLint |
| `npm run build` | Gera o build de produção |
| `npm run preview` | Serve localmente o build de produção |

## Decisões de projeto

- As páginas ficam em `src/pages`, componentes reutilizáveis em `src/components` e chamadas HTTP em `src/services`.
- A sessão autenticada é enviada em `Authorization: Bearer <token>`.
- Requisições de leitura podem ser canceladas ao desmontar uma tela para evitar atualizar estados antigos.
- O estado da carteira selecionada é persistido por usuário no navegador.

Veja o [README da raiz](../README.md) para a configuração completa do backend e do banco de dados.
