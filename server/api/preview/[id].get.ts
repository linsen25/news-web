import type { ArticleDTO } from '~/types/article';

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id');
  const token = getQuery(event).token;
  if (typeof token !== 'string') {
    throw createError({ statusCode: 401, statusMessage: 'Preview token required' });
  }
  const config = useRuntimeConfig();
  try {
    return await $fetch<ArticleDTO>(`${config.apiBase}/articles/${id}/preview`, {
      query: { token },
    });
  } catch (error) {
    throw createError({
      statusCode: 502,
      statusMessage: 'Preview requires news-backend to be running',
      cause: error,
    });
  }
});
