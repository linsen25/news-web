export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const pageUrl = getQuery(event).url;
  if (typeof pageUrl !== 'string' || !pageUrl) {
    throw createError({ statusCode: 400, statusMessage: '缺少分享页面地址' });
  }
  return $fetch(`${config.apiBase}/wechat/jssdk-config`, { query: { url: pageUrl } });
});
