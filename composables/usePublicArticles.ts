import type { ArticleDTO } from '~/types/article';

export const usePublicArticles = () => ({
  list: () => $fetch<ArticleDTO[]>('/api/articles'),
  get: (slug: string) => $fetch<ArticleDTO>(`/api/articles/${encodeURIComponent(slug)}`),
  preview: (id: string, token: string) =>
    $fetch<ArticleDTO>(`/api/preview/${id}`, { query: { token } }),
});
