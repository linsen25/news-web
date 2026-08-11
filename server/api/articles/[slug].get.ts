import { publicArticles } from '../../data/articles';
import type { ArticleDTO } from '~/types/article';

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug');
  const config = useRuntimeConfig();
  try {
    return await $fetch<ArticleDTO>(`${config.apiBase}/articles/public/slug/${encodeURIComponent(slug ?? '')}`);
  } catch (error) {
    if (!allowDevelopmentMockFallback()) throw productionApiError(error);
    const article = publicArticles.find((item) => item.slug === slug && item.status === 'published');
    if (!article) throw createError({ statusCode: 404, statusMessage: 'Article not found' });
    return article;
  }
});
