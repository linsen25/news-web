# news-web

Nuxt 3 新闻展示站，包含首页、`/articles` 列表和 `/articles/:id` 详情。

```bash
npm install
npm run dev
```

`server/api/articles` 在开发阶段作为 BFF，优先代理 NestJS 的 published API，后端不可用时才回退本地 Mock。`/preview/:id?token=...` 不回退 Mock，必须由 Nest 提供草稿数据。正文从 TipTap JSON 渲染，不存储 HTML。

生产环境必须统一使用 `news-web → news-backend → PostgreSQL`，本地 Nitro Mock 只用于开发。
# Generated API types

The backend OpenAPI document is the source of truth. After regenerating
`news-backend/openapi/openapi.json`, run:

```bash
npm run generate:api-types
```

The command writes `types/generated/api.d.ts`. Do not edit that file manually.
Application-friendly aliases such as `ArticleDTO` live in `types/article.ts`.
# Article images

`MediaImage` renders TipTap image nodes as responsive figures with `src`, `alt`,
and optional `caption`. The Web application reads Cloudinary delivery URLs from
article JSON and does not use Cloudinary API credentials.

# Slug URLs and SEO

Published article pages use `/articles/:slug` and the BFF resolves them through
`GET /api/articles/public/slug/:slug`. Nuxt `useSeoMeta` maps `metaTitle`,
`metaDescription`, `keywords`, and `coverImage` to standard, Open Graph, and
Twitter metadata, with title/summary fallbacks.
