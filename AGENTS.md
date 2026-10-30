# AGENTS.md — BMW Digital Showroom

## Project
BMW Digital Showroom — website bán xe BMW cao cấp phong cách BMW corporate (Next.js FE + NestJS BE + PostgreSQL). FE chỉ UI/presentation, BE chứa toàn bộ business logic, mỗi feature là module NestJS độc lập. Tất cả chạy Docker trên external network `test_banhang_network`, port bind `127.0.0.1`, env inject runtime (không bake `.env` vào image).

## Stack
- FE: Next.js 14 App Router (React 18), standalone output, plain CSS design system trong `src/app/globals.css`
- BE: NestJS 10 + TypeORM + pg; migration tại `backend/src/migration` (chạy bằng `backend/src/migrate.ts` khi khởi động container)
- DB: PostgreSQL 16 alpine, volume `bmw_showroom_pgdata`, host port 5433
- E2E: Playwright 1.49 trong container `mcr.microsoft.com/playwright:v1.49.0-noble`

## Run / Verify
```bash
cp .env.example .env
docker compose up -d --build     # FE 127.0.0.1:3000 · BE 127.0.0.1:3001/api · DB 127.0.0.1:5433
docker compose logs -f backend   # migration + seed log
```
E2E: `cd e2e && npm i && npx playwright test` (baseURL mặc định `http://frontend:3000` — chạy trong container cùng network). FE proxy API qua `frontend/src/app/api/[...path]/route.ts` (browser gọi same-origin `/api/*`, server chuyển tiếp tới `API_URL`).

## Design rules (BMW corporate — bám sát)
- Nền trắng `#FFFFFF`, soft surface `#FAFAFA/#F7F7F7`, dark hero `#1A2129`, CTA duy nhất BMW Blue `#1C69D4`
- 0px border-radius, KHÔNG drop shadow, chiều sâu bằng ảnh xe + tương phản section
- Inter 700 heading / Inter 300 body; hero ~64px, section ~48px, spacing section 80px, max-width 1440px
- CTA uppercase + letter-spacing; M tricolor CHỈ ở khu vực BMW M
- Dữ liệu xe thật: giữ `sourceUrl`/`sourceName` cho mỗi model; không bịa giá — model không có giá VN hiển thị "Liên hệ đại lý"

## Data model
- `cars` (slug unique, specs jsonb, galleryExterior/galleryInterior jsonb, price bigint nullable)
- `dealers` (15 showroom BMW VN thật, phone từ bmw.vn)
- `test_drive_leads` (lead đăng ký lái thử, status mặc định `new`)
Seed idempotent trong `backend/src/seed/data.ts`, chạy khi `SEED_ON_STARTUP=true` và bảng trống.
