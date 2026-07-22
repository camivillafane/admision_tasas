# Sistema Tributario - Liquidación de Tasas Eventuales

Municipalidad de Concordia - Examen de Admisión

## Stack tecnológico

- **Frontend**: Angular 21 + Angular Material
- **Backend**: NestJS 11 + TypeORM
- **Base de datos**: SQL Server 2022
- **Infraestructura**: Docker Compose

## Requisitos previos

- Docker Desktop instalado y ejecutándose
- Puerto 1433, 3000 y 4200 libres

## Inicio rápido con Docker

```bash
docker compose up --build -d
```

Esperar a que los tres servicios estén healthy (puede tardar 1-2 minutos la primera vez por la descarga de SQL Server).

### URLs

| Servicio | URL |
|----------|-----|
| Frontend | http://localhost:4200 |
| Backend API | http://localhost:3000/api |
| SQL Server | localhost:1433 |

### Usuario de prueba

- **Usuario**: `admin`
- **Contraseña**: `Admin1234!`

## Desarrollo local (sin Docker)

### Backend

```bash
cd backend
npm install
# Crear archivo .env con los datos de conexión
npm run start:dev
```

### Frontend

```bash
cd frontend
npm install
npm start
```

El frontend corre en http://localhost:4200 y consume la API en http://localhost:3000/api.

## Estructura del proyecto

```
├── backend/                 # NestJS API REST
│   ├── src/
│   │   ├── auth/            # Login JWT
│   │   ├── contribuyentes/  # CRUD contribuyentes
│   │   ├── conceptos/       # CRUD conceptos tributarios
│   │   ├── liquidaciones/   # CRUD liquidaciones + PDF
│   │   ├── pagos/           # Registro de pagos
│   │   └── usuarios/        # CRUD usuarios
│   └── Dockerfile
├── frontend/                # Angular SPA
│   ├── src/app/
│   │   ├── core/            # Servicios, guards, interceptores
│   │   ├── features/        # Componentes por módulo
│   │   └── layout/          # Shell con navbar y sidenav
│   ├── nginx.conf
│   └── Dockerfile
├── database/
│   └── script.sql           # Esquema + datos semilla
└── docker-compose.yml
```

## Funcionalidades implementadas

### Requeridos

1. **Listado, Alta y Baja de Liquidaciones** - ABM completo con cálculo automático de totales
2. **Impresión de PDF** - Descarga de comprobante en PDF con datos completos

### Opcionales

3. **ABM de Contribuyentes** - CRUD completo con búsqueda por CUIT
4. **Autenticación JWT** - Login, token expiración 8h, guardia de rutas
5. **ABM de Conceptos** - CRUD de tasas, recargos y exenciones (con soporte %)
6. **Módulo de Pagos** - Registro de pagos parciales, cambio automático de estado
7. **Dashboard** - Resumen de estados y total pendiente de cobro

## Modelo de datos

- **contribuyentes**: CUIT, apellido, nombre, domicilio, activo
- **conceptos**: código, descripción, tipo (tasa/recargo/exención), es_porcentaje, valor, activo
- **liquidaciones**: número, contribuyente, evento, fechas, total, estado
- **liquidaciones_detalles**: concepto, cantidad, base_imponible, monto
- **pagos**: liquidación, fecha, monto, medio, observaciones
- **usuarios**: username, password_hash, nombre, activo

## Reglas de negocio

- Los conceptos pueden ser tasa, recargo o exención
- Los recargos y exenciones pueden aplicarse como porcentaje sobre una base imponible
- El total se calcula automáticamente sumando los montos de los detalles
- El total no puede ser negativo
- No se puede modificar una liquidación pagada o anulada
- No se puede eliminar una liquidación pagada
- Las transiciones de estado tienen validación:
  - `pendiente` → `pagada`, `vencida`, `anulada`
  - `vencida` → `pagada`, `anulada`
  - `pagada` → ninguna
  - `anulada` → ninguna
- Endpoint para marcar automáticamente como vencidas las liquidaciones pasadas de fecha

## API Endpoints

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | /api/auth/login | Login JWT |
| GET | /api/contribuyentes | Listar (filtro ?q=) |
| POST | /api/contribuyentes | Crear |
| GET | /api/contribuyentes/:id | Obtener |
| PATCH | /api/contribuyentes/:id | Actualizar |
| DELETE | /api/contribuyentes/:id | Eliminar |
| GET | /api/conceptos | Listar |
| POST | /api/conceptos | Crear |
| GET | /api/conceptos/:id | Obtener |
| PATCH | /api/conceptos/:id | Actualizar |
| DELETE | /api/conceptos/:id | Eliminar |
| GET | /api/liquidaciones | Listar |
| POST | /api/liquidaciones | Crear con detalles |
| GET | /api/liquidaciones/:id | Obtener con detalles y pagos |
| PATCH | /api/liquidaciones/:id | Actualizar |
| DELETE | /api/liquidaciones/:id | Eliminar |
| POST | /api/liquidaciones/vencidas | Marcar vencidas |
| GET | /api/liquidaciones/:id/pdf | Descargar PDF |
| GET | /api/pagos | Listar |
| POST | /api/pagos | Registrar pago |
| DELETE | /api/pagos/:id | Eliminar pago |
| GET | /api/usuarios | Listar |
| POST | /api/usuarios | Crear |
| GET | /api/usuarios/:id | Obtener |
| PATCH | /api/usuarios/:id | Actualizar |
| DELETE | /api/usuarios/:id | Eliminar |
