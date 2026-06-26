\# Entrega técnica — Sortealo MVP-07.1



\## Proyecto



\*\*Sortealo\*\* es una plataforma profesional de sorteos online orientada a comercios.



Permite que un comercio cree sorteos, venda números, gestione pagos, administre entregas de premios, reciba reclamos y mantenga comunicación directa con los ganadores mediante un chat interno.



Este documento corresponde al estado de entrega:



```text

MVP-07.1

```



Tag en Git:



```bash

MVP-07.1

```



Repositorio:



```text

https://github.com/Fedegtaibo/sorteos-app.git

```



Ruta local de trabajo:



```text

C:\\Users\\fedet\\OneDrive\\Escritorio\\SORTEO\\sorteos-platform-completo\\sorteos

```



\---



\## Stack tecnológico



\* Next.js 15 / App Router

\* React

\* TypeScript

\* TailwindCSS

\* React Query

\* NextAuth

\* NestJS

\* PostgreSQL

\* Knex

\* Redis

\* BullMQ

\* Docker

\* Turborepo / Monorepo



\---



\## Estructura general



```text

sorteos

│

├── apps

│   ├── api        # Backend NestJS

│   └── web        # Frontend Next.js

│

├── packages

│   └── types      # Tipos compartidos

│

├── docker-compose.yml

├── package.json

├── pnpm-workspace.yaml

├── turbo.json

└── README.md

```



\---



\## Requisitos para ejecutar



Antes de levantar el proyecto se necesita:



\* Node.js 20 o superior

\* npm / pnpm instalado

\* Docker Desktop funcionando

\* PostgreSQL y Redis levantados mediante Docker



\---



\## Levantar servicios con Docker



Desde la raíz del proyecto:



```bash

cd C:\\Users\\fedet\\OneDrive\\Escritorio\\SORTEO\\sorteos-platform-completo\\sorteos

```



Verificar contenedores:



```bash

docker ps

```



Si no están corriendo, levantar:



```bash

docker compose up -d

```



Servicios esperados:



```text

sorteos\_db       PostgreSQL

sorteos\_redis    Redis

sorteos\_redis\_ui Redis Commander

```



URLs:



```text

PostgreSQL: localhost:5432

Redis:      localhost:6379

Redis UI:   http://localhost:8081

```



\---



\## Variables de entorno importantes



Archivo principal frontend:



```text

apps/web/.env.local

```



Contenido usado en desarrollo local:



```env

NEXTAUTH\_URL=http://localhost:3000

NEXTAUTH\_SECRET=dev\_nextauth\_secret\_123456789\_abcdefghijklmnopqrstuvwxyz

NEXTAUTH\_API\_URL=http://localhost:3001/v1

NEXT\_PUBLIC\_API\_URL=http://localhost:3001/v1

```



Importante: usar `localhost`, no una IP local tipo `192.168.x.x`, porque puede cambiar al cambiar de red.



\---



\## Migraciones



Ejecutar migraciones:



```bash

npm run db:migrate

```



Última migración relevante del MVP-07:



```text

009\_create\_mensajes\_entregas.ts

```



Tabla creada:



```text

mensajes\_entregas

```



Campos principales:



```text

id

entrega\_id

sender\_id

mensaje

leido

created\_at

```



\---



\## Levantar la aplicación en desarrollo



Desde la raíz del proyecto:



```bash

npm run dev

```



URLs principales:



```text

Frontend: http://localhost:3000

API:      http://localhost:3001

Swagger:  http://localhost:3001/api/docs

```



\---



\## Build de producción



El build fue probado correctamente en el tag:



```text

MVP-07.1

```



Comando:



```bash

npm run build

```



Resultado esperado:



```text

Tasks: 2 successful, 2 total

```



Warnings conocidos:



Next.js muestra advertencias sobre `themeColor` en metadata. No bloquean el build ni rompen la aplicación.



\---



\## Usuarios de prueba



Usuarios usados durante el desarrollo:



```text

admin@sorteos.dev

techstore@sorteos.dev

juan@sorteos.dev

```



Password habitual del seed:



```text

password123

```



Roles:



```text

admin@sorteos.dev      Admin

techstore@sorteos.dev  Comercio

juan@sorteos.dev       Participante / ganador

```



\---



\## MVPs completados



\### MVP-01 — Autenticación



Incluye:



\* Registro

\* Login

\* JWT

\* Roles

\* NextAuth

\* Protección de rutas



Estado:



```text

Terminado

```



\---



\### MVP-02 — Participantes y compra de números



Incluye:



\* Listado de sorteos

\* Selección de números

\* Reserva de números

\* Checkout

\* Participaciones del usuario



Estado:



```text

Terminado

```



\---



\### MVP-03 — Panel comercio



Incluye:



\* Crear sorteos

\* Administrar sorteos

\* Activar sorteos

\* Realizar sorteo

\* Dashboard de comercio



Estado:



```text

Terminado

```



\---



\### MVP-04 — MercadoPago desarrollo



Incluye:



\* Checkout

\* Simulación de pago

\* Webhooks

\* Confirmación de participaciones



Estado:



```text

Funcional en desarrollo

```



Pendiente para producción real:



\* Credenciales reales

\* URLs públicas

\* Webhook real

\* Validaciones finales de producción



\---



\### MVP-05 — Premios, entregas y reclamos



Incluye:



\* Premios ganados

\* Confirmar recepción

\* Reclamar premio

\* Panel admin de reclamos

\* Liberar fondos

\* Poner reclamo en revisión

\* Cerrar reclamo



Estado:



```text

Terminado

```



\---



\### MVP-06 — Dashboard profesional



Incluye:



\* KPIs

\* Analytics

\* Ventas últimos 30 días

\* Top sorteos

\* Gráficos

\* Donut de entregas

\* Dashboard visual mejorado



Estado:



```text

Terminado

```



\---



\### MVP-07 — Confianza y comunicación



Incluye:



\* DatabaseModule global

\* KNEX centralizado sin duplicar conexiones

\* Chat entre ganador y comercio

\* Mensajes persistidos en PostgreSQL

\* Chat visible en panel del ganador

\* Chat visible en panel del comercio

\* Mensajes leídos al abrir el chat

\* Estado visual “Enviado / Leído”

\* Notificaciones automáticas al recibir mensajes

\* Click en notificación lleva a la pantalla correspondiente

\* Notificación se marca como leída al hacer click



Estado:



```text

Terminado

```



\---



\### MVP-07.1 — Corrección de build



Incluye:



\* Corrección de `adminApi`

\* Métodos faltantes para pantallas admin

\* Build de producción funcionando



Estado:



```text

Terminado

```



\---



\## Funcionalidades principales actuales



\### Participante / ganador



Puede:



\* Registrarse

\* Iniciar sesión

\* Ver sorteos

\* Comprar o reservar números

\* Ver participaciones

\* Ver premios ganados

\* Confirmar recepción de premio

\* Reclamar premio

\* Chatear con el comercio

\* Recibir notificaciones de mensajes



\---



\### Comercio



Puede:



\* Iniciar sesión

\* Configurar perfil

\* Crear sorteos

\* Activar sorteos

\* Sortear ganador

\* Gestionar entregas

\* Marcar premios como preparando, enviados o entregados

\* Chatear con el ganador

\* Recibir notificaciones de mensajes



\---



\### Administrador



Puede:



\* Ver estadísticas generales

\* Gestionar comercios

\* Aprobar comercios

\* Rechazar comercios

\* Suspender comercios

\* Ver usuarios

\* Bloquear y desbloquear usuarios

\* Ver sorteos

\* Gestionar reclamos

\* Liberar reclamos

\* Poner reclamos en revisión

\* Cerrar reclamos



\---



\## Flujo principal de demo recomendado



\### 1. Login como participante



Entrar con:



```text

juan@sorteos.dev

```



Ver:



```text

/dashboard

/dashboard/participaciones

/dashboard/premios

```



Probar chat desde:



```text

/dashboard/premios

```



\---



\### 2. Login como comercio



Entrar con:



```text

techstore@sorteos.dev

```



Ver:



```text

/dashboard

/dashboard/sorteos

/dashboard/entregas

```



Responder chat desde:



```text

/dashboard/entregas

```



\---



\### 3. Probar notificaciones



Flujo:



```text

Ganador envía mensaje

Comercio recibe notificación

Comercio hace click en campanita

Sistema deriva a /dashboard/entregas

Notificación se marca como leída

Comercio responde mensaje

Ganador recibe notificación

Ganador hace click

Sistema deriva a /dashboard/premios

```



\---



\### 4. Login como admin



Entrar con:



```text

admin@sorteos.dev

```



Ver:



```text

/dashboard/admin/comercios

/dashboard/admin/usuarios

/dashboard/admin/sorteos

/dashboard/admin/reclamos

```



\---



\## Comandos útiles



Ver estado Git:



```bash

git status

```



Ver últimos commits:



```bash

git log --oneline --decorate -5

```



Levantar app:



```bash

npm run dev

```



Build producción:



```bash

npm run build

```



Migraciones:



```bash

npm run db:migrate

```



Ver contenedores:



```bash

docker ps

```



Levantar Docker:



```bash

docker compose up -d

```



Apagar Docker:



```bash

docker compose down

```



\---



\## Estado Git de entrega



Últimos tags:



```text

MVP-07

MVP-07.1

```



Tag recomendado para entrega:



```text

MVP-07.1

```



Últimos commits relevantes:



```text

9a584db MVP-07.1 - Corregir adminApi para build de produccion

b3deb35 MVP-07 - Agregar notificaciones de chat

3832d8b Mostrar estado leido enviado en chat

8ba909c Marcar mensajes de chat como leidos al abrir

567b9d4 Agregar chat de premios al panel comercio

```



\---



\## Estado general del proyecto



Sortealo ya cuenta con un MVP sólido para demo, presentación o entrega técnica.



El sistema incluye autenticación, roles, sorteos, reservas, pagos en modo desarrollo, premios, reclamos, dashboard profesional, entregas, chat entre ganador y comercio, mensajes leídos y notificaciones.



No está todavía preparado para producción pública masiva sin una etapa adicional de hardening, configuración real de MercadoPago, deploy, seguridad final y monitoreo.



\---



\## Próximos MVP sugeridos



\### MVP-08 — Marketplace



\* Mejorar exploración pública de sorteos

\* Filtros

\* Categorías

\* Página pública más comercial



\### MVP-09 — Antifraude



\* Auditoría de acciones

\* Detección de actividad sospechosa

\* Control de múltiples reservas

\* Historial sensible



\### MVP-10 — MercadoPago producción



\* Credenciales reales

\* URLs públicas

\* Webhook real

\* Validación de pagos reales



\### MVP-11 — PWA



\* Instalable como app

\* Manifest

\* Íconos

\* Mejor experiencia móvil



\### MVP-12 — Beta pública



\* Deploy

\* Usuarios reales

\* Monitoreo

\* Feedback

\* Ajustes finales



\---



\## Conclusión



El estado `MVP-07.1` representa una versión estable, demostrable y compilable del proyecto Sortealo.



Es el punto recomendado para entrega técnica o presentación.



