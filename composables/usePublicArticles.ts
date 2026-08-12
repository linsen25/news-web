import type { ArticleDTO, PublicArticleDetail } from '~/types/article';

export const usePublicArticles = () => ({
  list: () => $fetch<ArticleDTO[]>('/api/articles'),
  get: (slug: string) => $fetch<PublicArticleDetail>(`/api/articles/${encodeURIComponent(slug)}`),
  recordView: (slug: string, visitorId: string) =>
    $fetch<{ viewCount: number; counted: boolean }>(`/api/articles/${encodeURIComponent(slug)}/view`, { method: 'POST', body: { visitorId } }),
  preview: (id: string, token: string) =>
    $fetch<ArticleDTO>(`/api/preview/${id}`, { query: { token } }),
});
