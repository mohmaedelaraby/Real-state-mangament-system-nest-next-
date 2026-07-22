# Nawy Apartments Listing App

A full-stack apartment listing application: browse, search, view details, and add apartment listings with images.

## Tech Stack

- **Backend**: NestJS 11 + TypeScript (modular monolith), Prisma 7 (via the `@prisma/adapter-pg` driver adapter) ORM, PostgreSQL
- **Object storage**: MinIO (S3-compatible), accessed via `@aws-sdk/client-s3`
- **Frontend**: Next.js 16 (App Router)  + Ant Design 6
- **Containerization**: Docker Compose (`db`, `minio`, `backend`, `frontend`), Node 22 base images

## Prerequisites

- Docker and Docker Compose. Nothing else needs to be installed locally.
- For local (non-Docker) backend dev: Node.js **22.12+** (required by Prisma 7).

## Running the app

```bash
docker-compose up --build
```

This builds and starts all four services. On first run the backend applies Prisma migrations and seeds ~10 sample apartments; MinIO's `apartments` bucket is created automatically (with a public-read policy) if it doesn't already exist.

## URLs

| Service         | URL                                      |
|------------------|-------------------------------------------|
| Frontend         | http://localhost:3000                     |
| Backend API      | http://localhost:3001                     |
| MinIO console    | http://localhost:9001 (user/pass: `minioadmin` / `minioadmin`) |

## Environment variables

Defaults below are wired directly into `docker-compose.yml` and are safe example values for this take-home (not production secrets).

### Backend (`backend/.env.example`)

| Variable | Default | Purpose |
|---|---|---|
| `DATABASE_URL` | `postgresql://nawy:nawy@db:5432/nawy?schema=public` | Postgres connection string |
| `PORT` | `3001` | Backend HTTP port |
| `CORS_ORIGIN` | `http://localhost:3000` | Allowed frontend origin |
| `MINIO_ENDPOINT` | `minio:9000` | Internal MinIO endpoint used by the backend's S3 client, reached via the Docker network (service name, not `localhost`) |
| `MINIO_PUBLIC_URL` | `http://localhost:9000` | Host-mapped MinIO URL used to build the image URLs stored in the DB — this is what the reviewer's browser loads |
| `MINIO_ACCESS_KEY` / `MINIO_SECRET_KEY` | `minioadmin` / `minioadmin` | MinIO credentials |
| `MINIO_BUCKET` | `apartments` | Bucket used for uploaded images |

### Frontend (`frontend/.env.example`)

| Variable | Default | Purpose |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | `http://localhost:3001` | Backend base URL used by the browser (baked in at build time since it's a client-side var) |

## API reference

Base URL: `http://localhost:3001`. No interactive docs (Swagger) are bundled — this section plus the JSDoc comments on `ApartmentsController` are the API's documentation; every route/DTO field is also commented in source (`backend/src/apartments/`).

All error responses (validation failures, 404s, uncaught exceptions) share one shape, produced by the global `AllExceptionsFilter`:

```json
{ "statusCode": 404, "path": "/apartments/does-not-exist", "timestamp": "2026-07-22T10:00:00.000Z", "message": "Apartment with id \"does-not-exist\" not found" }
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
  "data": [ { "id": "uuid", "name": "Sea-view Chalet", "unitNumber": "CH-204", "project": "Marassi", "city": "North Coast", "description": "...", "address": "...", "area": 120, "price": 3000000, "beds": 2, "baths": 2, "images": ["http://localhost:9000/apartments/abc.jpg"], "createdAt": "...", "updatedAt": "..." } ],
  "total": 10,
  "page": 1,
  "limit": 12
}
```

### `GET /apartments/:id`

```bash
curl http://localhost:3001/apartments/<uuid>
```

**200** — the apartment object (same shape as one `data` entry above). **404** — id doesn't exist (see error shape above).

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

```bash
curl -X POST http://localhost:3001/apartments \

```

**201** — the created apartment, with `images` as public MinIO URLs. **400** — validation failure (unknown/missing/malformed fields; `ValidationPipe` runs with `whitelist`/`forbidNonWhitelisted`, so unrecognized fields are rejected, not silently dropped).

## Architecture

### Backend: modular monolith + repository layer

- **Layering**: `ApartmentsController` (HTTP concerns) → `ApartmentsService` (business rules, e.g. turning a missing row into a `NotFoundException`) → `ApartmentsRepository` (all Prisma calls, returns raw data/`null`). The repository exists mainly for consistency/readability (one place for `this.prisma.apartment.*` calls) rather than necessity 

- **Modular monolith**: `PrismaModule` as DB and `StorageModule` as buckets are `@Global()` (DB and MinIO access available everywhere without re-importing), `ApartmentsModule` wires controller/service/repository together. No microservices/queues — out of scope for this app's size.

- **MinIO over local disk**: images upload as in-memory buffers (`FilesInterceptor` + `memoryStorage()`) straight to MinIO via the S3 API, never touching the container's local filesystem — survives container restarts/redeploys and mirrors a real S3 deployment.

- **Internal vs. public MinIO URL**: the backend talks to MinIO over the Docker network (`MINIO_ENDPOINT=minio:9000`), but stores image URLs built from `MINIO_PUBLIC_URL=http://localhost:9000` — the host-mapped address the browser can actually reach. Conflating the two is a common bug in Dockerized MinIO setups.

- **Bucket bootstrap**: on startup, `StorageService` checks whether its bucket exists (`HeadBucketCommand`) and creates it with a public-read policy if not, so a fresh MinIO volume works with no manual setup.

- **Backend-driven search**: filtering happens in Postgres via Prisma (`contains` + `insensitive`), not client-side, so it scales with the dataset and stays consistent with pagination.

- **Prisma 7 driver adapter**: Prisma 7 dropped the bundled query engine binary in favor of driver adapters, so `schema.prisma` has no `url`; the connection string lives in `prisma.config.ts` (CLI/migrations) and is passed explicitly via `@prisma/adapter-pg` (`PrismaService`, `prisma/seed.ts`). Requires Node.js 22.12+.

### Frontend: why the listing and detail pages are SSR (Server Components)

`app/apartments/page.tsx` and `app/apartments/[id]/page.tsx` are `async` Server Components that fetch data directly with `await fetch(...)` on the server — not `useState`/`useEffect` client-side fetching.

- **URL is the source of truth, not React state.** Search text, project/city filters, and the current page all live in the URL's query string (`?search=&project=&city=&page=`), written by `SearchBar`, `FilterSidebar`, and `ApartmentPagination` via `router.push`/`replace`, and read by the page via its `searchParams` prop. This means a refresh doesn't lose your filters, and the URL is shareable/bookmarkable — both expected behaviors for a public search page that a client-state-only version doesn't give you for free.

- **No fetch waterfall / loading flash on first load.** The server renders the page with data already in the HTML; there's no "blank page → spinner → content" step for the initial visit. Subsequent filter/search/page changes still hit the network (a soft navigation re-runs the Server Component with the new `searchParams`), with `loading.tsx` as the Suspense fallback during that fetch — this is a real tradeoff .

- **Per-route `loading.tsx` / `error.tsx` / `not-found.tsx`** (under `app/apartments/` and `app/apartments/[id]/`, plus app-root fallbacks for unmatched routes) replace the old component-local `loading`/`notFound` `useState` flags — Next's routing layer now owns those states instead of hand-rolled booleans, and they only work at all because the fetch happens server-side during the initial render pass.


- **`next.config.js`'s `transpilePackages`** (`antd`, `@ant-design/icons`, `@ant-design/icons-svg`) is a related but separate fix: antd's compiled output places `"use strict"` before `"use client"`, which otherwise stops Next from recognizing the client boundary at all for those packages.

### Frontend feature structure

`src/features/apartments` groups everything by concern: `components/` (UI), `api/apartmentsApi.ts` (typed fetch client — branches its base URL on `typeof window` since server-side calls in Docker must reach the backend via its Compose service name, not the browser-facing URL), `interfaces/` (all TS interfaces/types, one file per domain plus a barrel `index.ts`), `styles/` (one CSS Module per component — no inline `style={{}}` anywhere in this feature), and `hooks/`. `src/app` stays routing-only and composes those pieces; pages are thin.

## Project structure

```
/backend
  /src
    /apartments
      apartments.controller.ts   # HTTP routes (documented per-route above)
      apartments.service.ts      # business rules (404s, etc.)
      apartments.repository.ts   # all Prisma calls
      /dto                       # CreateApartmentDto, QueryApartmentsDto (documented per-field)
    /prisma       # PrismaService (global)
    /storage      # MinIO/S3 service (global)
    /common       # global exception filter
  /prisma         # schema, migrations, seed script
/frontend
  /src
    /app                          # routing only
      /apartments                 # listing: page/loading/error (SSR, searchParams-driven)
        /[id]                     # detail: page/loading/error/not-found (SSR)
      not-found.tsx, error.tsx, loading.tsx   # root fallbacks for unmatched routes
    /features/apartments
      /components                 # PageHeader, SearchBar, FilterSidebar, ApartmentCard,
                                   # ApartmentGallery, ApartmentDetails, ApartmentPagination, ApartmentForm
      /api                        # typed fetch client
      /interfaces                 # all TS interfaces (barrel index.ts)
      /styles                     # one CSS Module per component
      /hooks
docker-compose.yml
```
