# Sorteos Platform

Plataforma de sorteos verificados para comercios.

## Requisitos

- Node.js >= 20
- pnpm >= 9
- Docker + Docker Compose

## Setup inicial (primera vez)

```bash
# 1. Clonar el repositorio
git clone https://github.com/TU-ORG/sorteos-platform
cd sorteos-platform

# 2. Instalar dependencias
pnpm install

# 3. Levantar base de datos y Redis
pnpm docker:up

# 4. Configurar variables de entorno
cp .env.example .env
# Editar .env con tus valores reales

# 5. Correr migraciones
pnpm db:migrate

# 6. Poblar con datos de prueba
pnpm db:seed

# 7. Levantar la aplicacion
pnpm dev
```

## URLs locales

| Servicio       | URL                              |
|---------------|----------------------------------|
| API            | http://localhost:3001            |
| Swagger Docs  | http://localhost:3001/api/docs   |
| Redis UI      | http://localhost:8081            |

## Usuarios de prueba (seed)

| Email                    | Password    | Rol          |
|--------------------------|-------------|--------------|
| admin@sorteos.dev        | password123 | Admin        |
| techstore@sorteos.dev    | password123 | Comercio     |
| juan@sorteos.dev         | password123 | Participante |

## Estructura del proyecto

```
sorteos-platform/
├── apps/
│   └── api/               # Backend NestJS
│       └── src/
│           ├── modules/
│           │   ├── auth/       # Login, registro, JWT
│           │   ├── sorteos/    # CRUD + motor de sorteo
│           │   └── pagos/      # MercadoPago + webhooks
│           ├── common/         # Filtros, interceptors
│           ├── config/         # Variables de entorno
│           └── database/       # Migraciones y seeds
└── packages/
    └── types/             # Tipos TypeScript compartidos
```

## Comandos utiles

```bash
pnpm db:migrate       # Correr migraciones pendientes
pnpm db:rollback      # Revertir ultima migracion
pnpm db:seed          # Cargar datos de prueba
pnpm docker:up        # Levantar Postgres + Redis
pnpm docker:down      # Bajar contenedores
pnpm test             # Correr tests
```

## Flujo de pago

1. `POST /v1/sorteos/:id/numeros/:numId/reservar` — reserva el numero 10 min
2. `POST /v1/sorteos/:id/numeros/:numId/checkout` — genera URL de pago en MP
3. Usuario paga en MercadoPago
4. MP llama a `POST /v1/webhooks/mercadopago`
5. El sistema confirma la compra de forma atomica

## Variables de entorno requeridas

Ver `.env.example` para la lista completa y documentacion de cada variable.
