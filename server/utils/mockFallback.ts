export const allowDevelopmentMockFallback = () => process.env.NODE_ENV !== 'production';

export const productionApiError = (cause: unknown) => createError({
  statusCode: 502,
  statusMessage: '新闻服务暂时不可用，请稍后重试',
  cause,
});
