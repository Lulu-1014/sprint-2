# Backend - Login e Cadastro

Projeto simples de back-end para estudo, usando Node.js, Express e MySQL.

## 1. Instalar as dependências

No Git Bash, dentro da pasta do projeto:

```bash
npm install
```

## 2. Criar o banco

Abra o MySQL e execute o arquivo:

```text
database/schema.sql
```

Ele cria o banco `login_cadastro` e a tabela `usuarios`.

## 3. Configurar o .env

Confira:

```env
PORT=3000

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=login_cadastro

JWT_SECRET=chave_secreta_do_projeto
```

Se seu MySQL tiver senha, coloque em `DB_PASSWORD`.

## 4. Iniciar

Modo normal:

```bash
npm start
```

Modo desenvolvimento:

```bash
npm run dev
```

A API ficará em:

```text
http://localhost:3000
```

## Endpoints

### Cadastro

POST:

```text
http://localhost:3000/api/auth/cadastro
```

JSON:

```json
{
  "nome_usuario": "Lucas",
  "email": "lucas@email.com",
  "senha": "123456",
  "confirmar_senha": "123456",
  "idade": 16
}
```

### Login

POST:

```text
http://localhost:3000/api/auth/login
```

JSON:

```json
{
  "email": "lucas@email.com",
  "senha": "123456",
  "lembrar": true
}
```

`lembrar: true` faz o token durar 7 dias. Caso seja `false`, dura 1 hora.

### Perfil protegido

GET:

```text
http://localhost:3000/api/auth/perfil
```

Header:

```text
Authorization: Bearer SEU_TOKEN
```

## Organização

- `config`: configurações
- `controllers`: recebem as requisições
- `database`: banco e SQL
- `middlewares`: autenticação
- `models`: estrutura dos dados
- `repositories`: consultas ao banco
- `routes`: URLs da API
- `services`: regras de negócio
- `uploads`: arquivos enviados futuramente
- `utils`: funções auxiliares
- `validators`: validação dos dados
