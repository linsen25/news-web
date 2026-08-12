<template>
  <article v-if="publishedArticle" class="story">
    <nav class="story-breadcrumb" :aria-label="language === 'zh' ? '文章层级导航' : 'Breadcrumb'">
      <NuxtLink to="/">{{ language === 'zh' ? '首页' : 'Home' }}</NuxtLink>
      <span aria-hidden="true">›</span>
      <NuxtLink :to="`/category/${publishedArticle.category.slug}`">{{ localizedName(publishedArticle.category) }}</NuxtLink>
      <template v-if="publishedArticle.tags.length">
        <span aria-hidden="true">›</span>
        <NuxtLink :to="{ path: `/category/${publishedArticle.category.slug}`, query: { tag: publishedArticle.tags[0].slug } }">{{ localizedName(publishedArticle.tags[0]) }}</NuxtLink>
      </template>
      <span aria-hidden="true">›</span>
      <span class="current" aria-current="page">{{ publishedArticle.title }}</span>
    </nav>
    <header class="story-header">
      <NuxtLink class="category" :to="`/category/${publishedArticle.category.slug}`">{{ localizedName(publishedArticle.category) }}</NuxtLink>
      <h1>{{ publishedArticle.title }}</h1>
      <p class="dek">{{ publishedArticle.summary }}</p>
      <div class="byline"><span v-if="publishedArticle.byline">{{ language === 'zh' ? '文' : 'By' }} / {{ publishedArticle.byline }}</span><time>{{ formatDate(publishedArticle.articleDate) }}</time></div>
    </header>
    <figure v-if="publishedArticle.coverImage"><img :src="publishedArticle.coverImage" :alt="publishedArticle.title" :style="coverPosition" /></figure>
    <div class="story-body" v-html="bodyHtml" />
    <footer class="story-tags">
      <NuxtLink v-for="tag in publishedArticle.tags" :key="tag.id" :to="{ path: `/category/${publishedArticle.category.slug}`, query: { tag: tag.slug } }"># {{ localizedName(tag) }}</NuxtLink>
      <span class="story-view-count" :aria-label="language === 'zh' ? '文章阅读量' : 'Article views'">{{ language === 'zh' ? '阅读' : 'Views' }} {{ publishedArticle.viewCount.toLocaleString(language === 'zh' ? 'zh-CN' : 'en-CA') }}</span>
    </footer>
    <section class="story-recommendations">
      <div class="up-next">
        <header><h2>{{ language === 'zh' ? '接下来阅读' : 'Up next' }}</h2></header>
        <div class="recommendation-grid">
          <ArticleCard v-for="item in relatedArticles" :key="item.id" :article="item" />
        </div>
      </div>
      <RankedStories
        :title="language === 'zh' ? '热门推荐' : 'Most popular'"
        :articles="popularArticles"
        :limit="6"
        compact
      />
    </section>
  </article>
  <article v-else-if="withdrawalNotice" class="story withdrawal-notice">
    <header><p class="eyebrow">ARTICLE WITHDRAWN</p><h1>{{ withdrawalNotice.title }}</h1><p>{{ language === 'zh' ? '本文已撤回' : 'This article has been withdrawn' }}</p></header>
    <section><strong>{{ language === 'zh' ? '撤稿说明' : 'Withdrawal notice' }}</strong><p>{{ withdrawalNotice.reason }}</p><time>{{ formatDate(withdrawalNotice.withdrawnAt) }}</time></section>
    <NuxtLink to="/articles">← {{ language === 'zh' ? '返回全部新闻' : 'Back to All News' }}</NuxtLink>
  </article>
</template>

<script setup lang="ts">
const route = useRoute();
const language = useCookie<'zh' | 'en'>('site-language', { default: () => 'zh' });
const localizedName = (item: { name: string; nameEn?: string }) => language.value === 'en' && item.nameEn ? item.nameEn : item.name;
const slug = String(route.params.slug);
const { get, list, recordView } = usePublicArticles();
const [{ data: article }, { data: allArticles }] = await Promise.all([
  useAsyncData(`public-article-${slug}`, () => get(slug)),
  useAsyncData('story-recommendation-articles', list, { default: () => [] }),
]);
if (!article.value) throw createError({ statusCode: 404, statusMessage: '文章不存在' });
const withdrawalNotice = computed(() => article.value && 'withdrawn' in article.value ? article.value : null);
const publishedArticle = computed(() => article.value && !('withdrawn' in article.value) ? article.value : null);
const coverPosition = computed(() => publishedArticle.value ? ({ objectPosition: `${publishedArticle.value.coverFocalX ?? 50}% ${publishedArticle.value.coverFocalY ?? 50}%` }) : undefined);
const relatedArticles = computed(() => publishedArticle.value
  ? allArticles.value.filter((item) => item.id !== publishedArticle.value?.id && item.category.id === publishedArticle.value?.category.id).slice(0, 6)
  : []);
const popularArticles = computed(() => allArticles.value
  .filter((item) => item.id !== publishedArticle.value?.id)
  .sort((a, b) => new Date(b.publishedAt || b.articleDate || 0).getTime() - new Date(a.publishedAt || a.articleDate || 0).getTime()));

useSeoMeta({
  title: () => publishedArticle.value?.metaTitle || article.value?.title || '新闻文章',
  description: () => publishedArticle.value?.metaDescription || publishedArticle.value?.summary || withdrawalNotice.value?.reason || '',
  keywords: () => publishedArticle.value?.keywords.join(', ') || '',
  ogTitle: () => publishedArticle.value?.metaTitle || article.value?.title || '新闻文章',
  ogDescription: () => publishedArticle.value?.metaDescription || publishedArticle.value?.summary || withdrawalNotice.value?.reason || '',
  ogImage: () => publishedArticle.value?.coverImage || '',
  twitterCard: 'summary_large_image',
});

const bodyHtml = computed(() => publishedArticle.value ? renderTipTap(publishedArticle.value.content) : '');
onMounted(async () => {
  if (!publishedArticle.value) return;
  const visitorStorageKey = 'news-visitor-id';
  let visitorId = localStorage.getItem(visitorStorageKey);
  if (!visitorId) {
    visitorId = `visitor-${crypto.randomUUID()}`;
    localStorage.setItem(visitorStorageKey, visitorId);
  }
  try {
    const result = await recordView(slug, visitorId);
    publishedArticle.value.viewCount = result.viewCount;
  } catch {
    // Reading the article must remain available when analytics is unavailable.
  }
});
const formatDate = (date: string | null) => date
  ? new Intl.DateTimeFormat(language.value === 'zh' ? 'zh-CN' : 'en-CA', { dateStyle: 'long' }).format(new Date(date))
  : language.value === 'zh' ? '未发布' : 'Unpublished';
</script>
