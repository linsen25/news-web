import { publicArticles } from '../data/articles';
import type { PublicCategory } from '~/composables/usePublicCatalog';

export default defineEventHandler(async () => {
  const config = useRuntimeConfig();
  try {
    return await $fetch<PublicCategory[]>(`${config.apiBase}/categories`);
  } catch {
    return Array.from(new Map(
      publicArticles.map((article) => [article.category.id, article.category]),
    ).values());
  }
});
