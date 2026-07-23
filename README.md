# Nawy Apartments Listing App

A full-stack apartment listing application: browse, search, view details, and add apartment listings with images.

This is a **monorepo**: the NestJS backend (`/backend`) and the Next.js frontend (`/frontend`) live side by side in one repository, each with its own `package.json`/dependencies/Dockerfile, and are orchestrated together by the root `docker-compose.yml`. There's no shared/published package between them — the two apps only talk over HTTP.

## Contents

- [Tech stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Running the app](#running-the-app)
  - [Running the frontend locally](#running-the-frontend-locally-optional)
  - [Running the backend locally](#running-the-backend-locally-optional)
- [URLs](#urls)
- [Environment variables](#environment-variables)
- [API reference](#api-reference)
- [Architecture](#architecture)
- [Project structure](#project-structure)

## Tech stack

| Layer | Stack |
| --- | --- |
| Backend | NestJS 11 + TypeScript (modular monolith), Prisma , PostgreSQL |
| Object storage | Multer+ MinIO (S3-compatible) |
| Frontend | Next.js  + Ant Design 6 |
| Containerization | Docker Compose (`db`, `minio`, `backend`, `frontend`), Node 22 base images |

## Prerequisites

- Docker and Docker Compose — nothing else needs to be installed locally.
- For local (non-Docker) backend dev: Node.js **22.12+** (required by Prisma 7).

## Running the app

```bash
docker-compose up --build
```

This builds and starts all four services. On first run the backend applies Prisma migrations and seeds ~10 sample apartments; MinIO's `apartments` bucket is created automatically (with a public-read policy) if it doesn't already exist.

### Running the frontend locally (optional)

Only needed if you want hot-reload on the frontend instead of rebuilding the container on every change.

```bash
docker-compose up -d db minio backend   # keep the backend + its deps in Docker
cd frontend
cp .env.example .env                    # NEXT_PUBLIC_API_URL already points at http://127.0.0.1:3001
npm install
npm run dev                             # http://localhost:3000, hot-reloading
```

### Running the backend locally (optional)

Requires Node.js **22.12+**. Postgres and MinIO still run in Docker — only the NestJS process runs on the host.

```bash
docker-compose up -d db minio
cd backend
cp .env.example .env
```

Edit `.env` so `DATABASE_URL` and `MINIO_ENDPOINT` point at `localhost` instead of the Docker service names `db`/`minio` (those only resolve *inside* the Compose network, not from the host):

```dotenv
DATABASE_URL=postgresql://nawy:nawy@localhost:5432/nawy?schema=public
MINIO_ENDPOINT=localhost:9000
```

Then:

```bash
npm install
npm run prisma:generate
npm run prisma:migrate:deploy
npm run prisma:seed              # optional — seeds ~10 sample apartments
npm run start:dev                # http://localhost:3001, restarts on file changes
```

## URLs

| Service | URL |
| --- | --- |
| Frontend | <http://localhost:3000> |
| Backend API | <http://localhost:3001> |
| MinIO console | <http://localhost:9001> (user/pass: `minioadmin` / `minioadmin`) |

## Environment variables

Defaults below are wired directly into `docker-compose.yml` and are safe example values for this take-home (not production secrets).

### Backend (`backend/.env.example`)

| Variable | Default | Purpose |
| --- | --- | --- |
| `DATABASE_URL` | `postgresql://nawy:nawy@db:5432/nawy?schema=public` | Postgres connection string |
| `PORT` | `3001` | Backend HTTP port |
| `CORS_ORIGIN` | `http://localhost:3000` | Allowed frontend origin |
| `MINIO_ENDPOINT` | `minio:9000` | Internal MinIO endpoint, reached via the Docker network (service name, not `localhost`) |
| `MINIO_PUBLIC_URL` | `http://localhost:9000` | Host-mapped MinIO URL used to build image URLs stored in the DB — this is what the reviewer's browser loads |
| `MINIO_ACCESS_KEY` / `MINIO_SECRET_KEY` | `minioadmin` / `minioadmin` | MinIO credentials |
| `MINIO_BUCKET` | `apartments` | Bucket used for uploaded images |

### Frontend (`frontend/.env.example`)

| Variable | Default | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_API_URL` | `http://localhost:3001` | Backend base URL used by the browser (baked in at build time since it's a client-side var) |

## API reference

Base URL: `http://localhost:3001`. No interactive docs (Swagger) are bundled — this section plus the JSDoc comments on `ApartmentsController` are the API's documentation; every route/DTO field is also commented in source (`backend/src/apartments/`).

### Response envelope

Every response — success or error — shares one shape.

**Success**, wrapped by the global `ResponseInterceptor` ([backend/src/common/interceptors/response.interceptor.ts](backend/src/common/interceptors/response.interceptor.ts)):

```json
{ "status": "success", "message": "Apartment retrieved successfully", "data": { "...": "..." } }
```

**Error** (validation failures, 404s, uncaught exceptions), produced by the global `AllExceptionsFilter`:

```json
{ "status": "error", "statusCode": 404, "path": "/apartments/does-not-exist", "timestamp": "2026-07-22T10:00:00.000Z", "message": "Apartment with id \"does-not-exist\" not found" }
```

### `GET /apartments`

Paginated, filtered listing. All query params optional.

| Param | Type | Default | Notes |
| --- | --- | --- | --- |
| `search` | string | — | Matches `name`, `unitNumber`, or `project` (OR'd, case-insensitive, partial) |
| `project` | string | — | Case-insensitive partial match, AND'd with `search` |
| `city` | string | — | Case-insensitive partial match, AND'd with `search` |
| `page` | int ≥ 1 | `1` | |
| `limit` | int, 1–100 | `12` | Capped at 100 to prevent unbounded queries |

```bash
curl "http://localhost:3001/apartments?search=marassi&page=1&limit=12"
```

**200** response:

```json
{
  "status": "success",
  "message": "Apartments retrieved successfully",
  "data": {
    "data": [ { "id": "uuid", "name": "Sea-view Chalet", "unitNumber": "CH-204", "project": "Marassi", "city": "North Coast", "description": "...", "address": "...", "area": 120, "price": 3000000, "beds": 2, "baths": 2, "images": ["http://localhost:9000/apartments/abc.jpg"], "createdAt": "...", "updatedAt": "..." } ],
    "total": 10,
    "page": 1,
    "limit": 12
  }
}
```

### `GET /apartments/:id`

```bash
curl http://localhost:3001/apartments/<uuid>
```

**200** — `data` is the apartment object (same shape as one entry above). **404** — id doesn't exist (see error shape above).

### `POST /apartments`

`multipart/form-data`. Text fields per `CreateApartmentDto` (all required except images) + up to 10 files under the `images` field.

| Field | Type | Constraints |
| --- | --- | --- |
| `name` | string | non-empty, ≤200 chars |
| `unitNumber` | string | non-empty, ≤50 chars |
| `project` | string | non-empty, ≤200 chars |
| `city` | string | non-empty, ≤200 chars |
| `description` | string | non-empty |
| `address` | string | non-empty, ≤300 chars |
| `area` | number | positive |
| `price` | number | positive |
| `beds` | int | ≥0 |
| `baths` | int | ≥0 |
| `images` | file[] | optional, up to 10 |



**201** — `data` is the created apartment, with `images` as public MinIO URLs. **400** — validation failure (unknown/missing/malformed fields; `ValidationPipe` runs with `whitelist`/`forbidNonWhitelisted`, so unrecognized fields are rejected, not silently dropped).

## Architecture

### Backend

#### Layering

`ApartmentsController` (HTTP concerns) → `ApartmentsService` (business rules, e.g. turning a missing row into a `NotFoundException`) → `ApartmentsRepository` (all Prisma calls, returns raw data/`null`). The repository exists mainly for consistency/readability

#### Response shape as a cross-cutting concern

- `ResponseInterceptor` is registered globally as an `APP_INTERCEPTOR` provider in `AppModule` It wraps every successful handler return value into `{ status: 'success', message, data }`.

- `AllExceptionsFilter` thrown exceptions through filters, in formatting way.

#### Modular monolith

`PrismaModule` (DB) and `StorageModule` (MinIO) are `@Global()`, so DB/storage access is available everywhere without re-importing. 

#### MinIO over local disk

Images upload as in-memory buffers (`FilesInterceptor` + `memoryStorage()`) straight to MinIO via the S3 API, to mirror a real S3 deployment.

- **Fresh installs start empty**: MinIO's storage is a local Docker volume, so a new clone/run has no images until someone uploads via the app — expected behavior, not a bug.

#### Backend-driven search

Filtering happens in Postgres via Prisma (`contains` + `insensitive`), not client-side, so it scales with the dataset and stays consistent with pagination.

#### Prisma 7 

 the connection string lives in `prisma.config.ts` (CLI/migrations) and is passed explicitly via `@prisma/adapter-pg` (`PrismaService`, `prisma/seed.ts`). 

### Frontend: why the listing and detail pages are SSR

`app/apartments/page.tsx` and `app/apartments/[id]/page.tsx` are `async` Server Components that fetch data directly with `await fetch(...)` on the server — not `useState`/`useEffect` client-side fetching.

- **URL is the source of truth, not React state.** Search text, project/city filters, and the current page all live in the URL's query string (`?search=&project=&city=&page=`), written by `SearchBar`, `FilterSidebar`, and `ApartmentPagination` via `router.push`/`replace`, and read by the page via its `searchParams` prop. so a refresh doesn't lose your filters

- **No fetch waterfall / loading flash on first load.** The server renders the page with data already in the HTML — no "blank page →Filter/search/page changes  spinner → content" step on the initial visit. still hit the network
.
- **Per-route `loading.tsx` / `error.tsx` / `not-found.tsx`** (under `app/apartments/` and `app/apartments/[id]/`, plus app-root fallbacks for unmatched routes) replace component-local `loading`/`notFound` `useState` flags — Next's routing layer owns those states, which only works because the fetch happens server-side during the initial render pass.

### Frontend feature structure

`src/features/apartments` groups everything by concern:

| Folder | Contents |
| --- | --- |
| `components/` | UI only — logic/state/routing lives in `hooks/`, components just call a hook and render |
| `hooks/` | Feature-specific state, side effects, and routing logic (one hook per component that needs one) |
| `api/apartmentsApi.ts` | Typed fetch client — branches its base URL on `typeof window` since server-side calls in Docker must reach the backend via its Compose service name, not the browser-facing URL |
| `interfaces/` | All TS interfaces/types, one file per domain plus a barrel `index.ts` |
| `styles/` | One CSS Module per component — no inline `style={{}}` anywhere in this feature |

Generic, feature-agnostic hooks (e.g. `useDebouncedValue`) live in `src/common/hooks` instead, not inside the `apartments` feature.

`src/app` stays routing-only and composes those pieces; pages are thin.

## Project structure

```text
/backend
  /src
    /apartments
      apartments.controller.ts   # HTTP routes (documented per-route above)
      apartments.service.ts      # business rules (404s, etc.)
      apartments.repository.ts   # all Prisma calls
      /dto                       # CreateApartmentDto, QueryApartmentsDto (documented per-field)
    /prisma       # PrismaService (global)
    /storage      # MinIO/S3 service (global)
    /common
      /exceptions     # AllExceptionsFilter (global error shape)
      /interceptors   # ResponseInterceptor (global success shape), ImageUploadInterceptor
      /decorators     # @ResponseMessage(...)
  /prisma         # schema, migrations, seed script
/frontend
  /src
    /app                          # routing only
      /apartments                 # listing: page/loading/error (SSR, searchParams-driven)
        /[id]                     # detail: page/loading/error/not-found (SSR)
      not-found.tsx, error.tsx, loading.tsx   # root fallbacks for unmatched routes
    /common
      /hooks                       # feature-agnostic hooks (e.g. useDebouncedValue)
    /features/apartments
      /components                  # PageHeader, SearchBar, FilterSidebar, ApartmentCard,
                                    # ApartmentGallery, ApartmentDetails, ApartmentPagination, ApartmentForm
      /hooks                       # per-component state/logic (useSearchBar, useApartmentForm, ...)
      /api                         # typed fetch client
      /interfaces                  # all TS interfaces (barrel index.ts)
      /styles                      # one CSS Module per component
docker-compose.yml
```
