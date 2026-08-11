import { publicArticles } from '../../data/articles';
import type { ArticleDTO, WithdrawalNoticeDTO } from '~/types/article';

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug');
  const config = useRuntimeConfig();
  try {
    return await $fetch<ArticleDTO>(`${config.apiBase}/articles/public/slug/${encodeURIComponent(slug ?? '')}`);
  } catch (error) {
    try {
      const notice = await $fetch<Omit<WithdrawalNoticeDTO, 'withdrawn'>>(`${config.apiBase}/articles/public/withdrawn/slug/${encodeURIComponent(slug ?? '')}`);
      return { ...notice, withdrawn: true as const };
    } catch {
      if (!allowDevelopmentMockFallback()) throw productionApiError(error);
    }
    const article = publicArticles.find((item) => item.slug === slug && item.status === 'published');
    if (!article) throw createError({ statusCode: 404, statusMessage: 'Article not found' });
    return article;
  }
});
