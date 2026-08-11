<template>
  <article v-if="publishedArticle" class="story">
    <header class="story-header">
      <NuxtLink class="category" :to="{ path: '/articles', query: { category: publishedArticle.category.slug } }">{{ localizedName(publishedArticle.category) }}</NuxtLink>
      <h1>{{ publishedArticle.title }}</h1>
      <p class="dek">{{ publishedArticle.summary }}</p>
      <div class="byline"><span v-if="publishedArticle.byline">{{ language === 'zh' ? '文' : 'By' }} / {{ publishedArticle.byline }}</span><time>{{ formatDate(publishedArticle.articleDate) }}</time></div>
    </header>
    <figure v-if="publishedArticle.coverImage"><img :src="publishedArticle.coverImage" :alt="publishedArticle.title" /></figure>
    <div class="story-body" v-html="bodyHtml" />
    <footer class="story-tags">
      <NuxtLink v-for="tag in publishedArticle.tags" :key="tag.id" :to="{ path: '/articles', query: { tag: tag.slug } }"># {{ localizedName(tag) }}</NuxtLink>
    </footer>
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
const { get } = usePublicArticles();
const { data: article } = await useAsyncData(`public-article-${slug}`, () => get(slug));
if (!article.value) throw createError({ statusCode: 404, statusMessage: '文章不存在' });
const withdrawalNotice = computed(() => article.value && 'withdrawn' in article.value ? article.value : null);
const publishedArticle = computed(() => article.value && !('withdrawn' in article.value) ? article.value : null);

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
const formatDate = (date: string | null) => date
  ? new Intl.DateTimeFormat(language.value === 'zh' ? 'zh-CN' : 'en-CA', { dateStyle: 'long' }).format(new Date(date))
  : language.value === 'zh' ? '未发布' : 'Unpublished';
</script>
