import type { components } from '~/types/generated/api';
type HomepageLayoutDTO = components['schemas']['HomepageLayoutDto'];

export default defineEventHandler(async (): Promise<HomepageLayoutDTO> => {
  const config = useRuntimeConfig();
  try {
    return await $fetch<HomepageLayoutDTO>(`${config.apiBase}/homepage/public`);
  } catch {
    return { slots: [] };
  }
});
