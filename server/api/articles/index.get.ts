import { publicArticles } from '../../data/articles';
import type { ArticleDTO } from '~/types/article';

export default defineEventHandler(async () => {
  const config = useRuntimeConfig();
  try {
    return await $fetch<ArticleDTO[]>(`${config.apiBase}/articles/public`);
  } catch {
    return publicArticles.filter((article) => article.status === 'published');
  }
});
