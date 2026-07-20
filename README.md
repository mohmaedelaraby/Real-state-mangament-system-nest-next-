# Nawy Apartments Listing App

A full-stack apartment listing application: browse, search, view details, and add apartment listings with images.

## Tech Stack

- **Backend**: NestJS 11 + TypeScript (modular monolith), Prisma 7 (via the `@prisma/adapter-pg` driver adapter) ORM, PostgreSQL
- **Object storage**: MinIO (S3-compatible), accessed via `@aws-sdk/client-s3`
- **Frontend**: Next.js 16 (App Router) + React 19 + TypeScript + Ant Design 6
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

## API

- `GET /apartments?search=&project=&page=&limit=` — paginated list; `search` matches `name`, `unitNumber`, or `project` (case-insensitive, partial).
- `GET /apartments/:id` — apartment details, 404 if not found.
- `POST /apartments` — create an apartment (`multipart/form-data`: text fields + `images[]`).

No interactive API docs are bundled (Swagger was intentionally left out) — use Postman or curl against the routes above.

## Architecture notes

- **Modular monolith**: The backend is a single NestJS app split into `PrismaModule` (global DB access), `StorageModule` (global MinIO/S3 access), and `ApartmentsModule` (controller/service/DTOs). This keeps the scope appropriate for the assignment while staying easy to split into services later if needed — no microservices/queues were introduced, per the assignment's non-goals.
- **MinIO over local disk**: Images are uploaded as in-memory buffers (`FilesInterceptor` + `memoryStorage()`) straight to MinIO via the S3 API, rather than written to the container's local filesystem. This avoids losing uploads on container restarts/redeploys and mirrors how a real deployment would use S3.
- **Internal vs. public MinIO URL**: The backend talks to MinIO over the Docker network (`MINIO_ENDPOINT=minio:9000`), but the URLs it stores in the `images` column are built from `MINIO_PUBLIC_URL=http://localhost:9000` — the host-mapped address the reviewer's browser can actually reach. Conflating the two is a common bug in Dockerized MinIO setups.
- **Bucket bootstrap**: On startup, the backend checks whether its target bucket exists (`HeadBucketCommand`) and creates it with a public-read policy if not, so a completely fresh MinIO volume works without any manual setup step.
- **Uploaded images are host-local**: Images live in the `minio_data` Docker volume. A fresh clone + fresh `docker-compose up` starts with an empty bucket (seed data ships with no images) — this is expected, not a bug.
- **Backend-driven search**: Search/filtering happens in the database via Prisma (`contains` + `insensitive` mode), not client-side, so it scales with the dataset and stays consistent with pagination.
- **Frontend feature structure**: `src/features/apartments` groups components, the typed API client, and types together; `src/app` is routing-only and composes those feature pieces. This keeps the "pages" thin and the domain logic colocated.
- **Prisma 7 driver adapter**: Prisma 7 removed the bundled query engine binary in favor of driver adapters, so `schema.prisma` no longer holds a `url`; the connection string instead lives in `prisma.config.ts` (used by the CLI for migrations) and is passed explicitly to `PrismaClient` via `@prisma/adapter-pg` (`PrismaService`, `prisma/seed.ts`). Requires Node.js 22.12+.
- **TypeScript pinned to 6.x, not 7.x**: TypeScript 7.0 shipped without its programmatic compiler API (only the `tsc` binary), which both `nest build` and Next's type-checking step depend on — the ecosystem hasn't caught up yet. TS 6.0.3 is the newest version that still works with this toolchain.
- **No Swagger**: API docs were intentionally left out in favor of manual testing via Postman/curl; see the API section above for the route list.

## Project structure

```
/backend
  /src
    /apartments   # controller, service, DTOs
    /prisma       # PrismaService (global)
    /storage      # MinIO/S3 service (global)
    /common       # global exception filter
  /prisma         # schema, migrations, seed script
/frontend
  /src
    /app          # routing (listing, details, add)
    /features/apartments
      /components
      /api
      /types
      /hooks
docker-compose.yml
```
