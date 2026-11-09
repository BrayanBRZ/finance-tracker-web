# Finance Tracker Web

Interface web do Finance Tracker, desenvolvida em React e integrada à API do projeto.

## Pré-requisitos

- Node.js 20 ou superior e npm
- API do Finance Tracker em execução, normalmente em `http://localhost:8080`

## Configuração

Copie o arquivo de exemplo e ajuste a URL da API se necessário:

```powershell
Copy-Item .env.example .env
```

```dotenv
VITE_API_URL=http://localhost:8080/api/v1
```

`VITE_API_URL` é obrigatória e define o endereço base da API. Configure o valor para o ambiente de destino antes de executar `npm run build`.

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

## Instalação e modo offline

O build gera `manifest.json` e um service worker para instalação e abertura offline da interface. O cache contém arquivos estáticos. Os dados da aplicação dependem da API.

Para verificar o modo offline localmente, execute `npm run build` e `npm run preview`, abra a aplicação e recarregue a página com o navegador em modo offline.

Consulte o README principal para a [configuração do sistema](../README.md#configuração-local) e o [deploy](../README.md#deploy).
