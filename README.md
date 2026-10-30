# BMW Digital Showroom

Website bán xe BMW cao cấp theo phong cách **BMW Digital Showroom chính hãng** — Next.js + NestJS + PostgreSQL, chạy hoàn toàn bằng Docker.

## Stack

| Layer | Công nghệ |
| --- | --- |
| Frontend | Next.js 14 (App Router, React 18) — standalone build |
| Backend | NestJS 10 + TypeORM |
| Database | PostgreSQL 16 (alpine) |
| Infra | docker-compose, external network `test_banhang_network`, port bind `127.0.0.1`, env inject runtime |

## Chạy nhanh

```bash
cp .env.example .env
docker compose up -d --build
```

- Frontend: http://127.0.0.1:3000
- Backend API: http://127.0.0.1:3001/api (Swagger/docs tại `http://127.0.0.1:3001/docs`)
- PostgreSQL: `127.0.0.1:5433` (user `bmw`, db `bmw_showroom`)

Backend tự chạy migration (files trong `backend/src/migration`) và seed 14 mẫu BMW thật + 15 dealer khi khởi động (`SEED_ON_STARTUP=true`).

## Cấu trúc

```text
backend/src/
  cars/        # module Cars — list + detail + filter
  compare/     # module Compare — tối đa 3 xe
  test-drive/  # module Test Drive — lưu lead vào PostgreSQL
  dealers/     # module Dealers — hệ thống phân phối
  seed/        # seed dữ liệu thật (giá/thông số + source URL)
  migration/   # migration TypeORM
frontend/src/
  app/         # pages: Home, Models, Detail, Compare, Test Drive, Dealers, Electric, BMW M
  components/  # Header, Footer, CarCard, Gallery, Filters, CompareClient, TestDriveForm
scripts/
  fetch-images.mjs  # tải ảnh BMW thật từ Wikimedia Commons (press photos)
e2e/           # Playwright E2E (chạy trong container)
```

## Data thật & nguồn

- Giá/thông số: [BMW Việt Nam](https://www.bmw.vn/vi/models/bmw-x1/), [giaxeoto.vn — bảng giá BMW VN](https://giaxeoto.vn/gia-xe-bmw-132), [VnExpress — M4 tại VN](https://vnexpress.net/bmw-m4-competition-xe-the-thao-gia-gan-6-ty-dong-4965863.html), trang chính thức BMW.
- Logo BMW roundel + ảnh ngoại thất/nội thất: press photos chính thức từ Wikimedia Commons, lưu tại `frontend/public/images/cars/`.
- Mỗi xe lưu `sourceUrl`/`sourceName`; model chưa có giá niêm yết VN chính hãng (i5, iX, M2, M3) hiển thị "Liên hệ đại lý".

## Verify

```bash
# E2E đầy đủ hành trình mua xe (chạy trong container Playwright)
cd e2e && npm i && npx playwright test
# hoặc qua docker:
docker run --rm --network test_banhang_network \
  -v "C:\Users\INNOTECH\Documents\bmw-cars:/app" -w /app/e2e \
  mcr.microsoft.com/playwright:v1.49.0-noble npx playwright test
```
