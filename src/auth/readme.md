# Auth Module

Este módulo contém toda a lógica de autenticação da aplicação, estruturada de forma modular, extensível e segura.

---

## Estrutura

```
auth/
├── handlers/           # Handlers HTTP que lidam com os fluxos de autenticação
├── schemas/            # Esquemas Zod para validação de entrada
├── strategies/         # Estratégias de autenticação por tipo de role
└── validators/         # Validação de tokens JWT por role
    └── rules/          # Implementações específicas de validação contextual
```

---

## handlers/

Handlers HTTP utilizados nas rotas de autenticação (`/auth/login`, `/auth/token`, `/dispositivos`, etc).

- Recebem os dados validados por `zod` (via `schemas/`)
- Usam uma `AuthStrategy` para processar a autenticação
- Geram e retornam `access_token` e `refresh_token`
- Não tratam erros diretamente — erros são propagados para o `setErrorHandler` do Fastify

---

## schemas/

Esquemas Zod que definem e validam os dados de entrada para os handlers.
Eles precisam ser usados em conjunto de validateRequestWithZod (src/middlewares/validate-request.ts).

- Validam `request.body` de forma segura e tipada
- Exportam também os tipos inferidos com `z.infer`
- Garantem que os dados usados nas `AuthStrategy` já estão limpos

---

## strategies/

Contém as estratégias reais de autenticação implementando a interface `AuthStrategy<T>`.

Cada strategy:

- Valida credenciais (login por email, terminal PDV, client credentials, etc)
- Gera o payload JWT com tipagem específica
- (Opcionalmente) Gera um refresh token

---

## validators/

Responsáveis por validar **tokens JWT já emitidos**.

- Contêm `TokenValidator<T>` por role
- Garantem que o token não foi clonado, modificado ou invalidado no contexto atual
- Utilizados após o `jwt.verify` no fluxo de autenticação de rotas privadas

### validators/rules/

Implementações específicas por tipo de token (`role`).

Exemplo: validar se o `hardware_id` do POS ainda é válido ou se o terminal ainda está ativo.

---

## Benefícios da arquitetura

- Fluxos independentes por tipo de `role`
- Segurança contextual por token
- Validação forte e declarativa via Zod
- Fácil de testar e manter
- Altamente reutilizável e extensível

---

> Mantenha os handlers enxutos e toda a lógica de negócio dentro das strategies e validators.
