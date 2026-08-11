import { publicArticles } from '../data/articles';
import type { PublicTag } from '~/composables/usePublicCatalog';

export default defineEventHandler(async () => {
  const config = useRuntimeConfig();
  try {
    return await $fetch<PublicTag[]>(`${config.apiBase}/tags`);
  } catch (error) {
    if (!allowDevelopmentMockFallback()) throw productionApiError(error);
    return Array.from(new Map(
      publicArticles.flatMap((article) => article.tags).map((tag) => [tag.id, tag]),
    ).values());
  }
});
