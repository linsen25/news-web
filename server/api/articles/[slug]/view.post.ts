export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug');
  const body = await readBody<{ visitorId?: string }>(event);
  if (!body?.visitorId) throw createError({ statusCode: 400, statusMessage: 'Missing visitor identifier' });
  const config = useRuntimeConfig();
  return $fetch<{ viewCount: number; counted: boolean }>(
    `${config.apiBase}/articles/public/slug/${encodeURIComponent(slug ?? '')}/view`,
    { method: 'POST', body: { visitorId: body.visitorId } },
  );
});
