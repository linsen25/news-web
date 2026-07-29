<template>
  <article v-if="article" class="story">
    <header class="story-header">
      <NuxtLink class="category" to="/articles">{{ article.category.name }}</NuxtLink>
      <h1>{{ article.title }}</h1>
      <p class="dek">{{ article.summary }}</p>
      <div class="byline"><span>文 / {{ article.author.name }}</span><time>{{ formatDate(article.publishedAt) }}</time></div>
    </header>
    <figure><img :src="article.coverImage" :alt="article.title" /></figure>
    <div class="story-body" v-html="bodyHtml" />
    <footer class="story-tags"><span v-for="tag in article.tags" :key="tag.id"># {{ tag.name }}</span></footer>
  </article>
</template>

<script setup lang="ts">
const route = useRoute();
const slug = String(route.params.slug);
const { get } = usePublicArticles();
const { data: article } = await useAsyncData(`public-article-${slug}`, () => get(slug));
if (!article.value) throw createError({ statusCode: 404, statusMessage: '文章不存在' });

useSeoMeta({
  title: () => article.value?.metaTitle || article.value?.title || '新闻文章',
  description: () => article.value?.metaDescription || article.value?.summary || '',
  keywords: () => article.value?.keywords.join(', ') || '',
  ogTitle: () => article.value?.metaTitle || article.value?.title || '新闻文章',
  ogDescription: () => article.value?.metaDescription || article.value?.summary || '',
  ogImage: () => article.value?.coverImage || '',
  twitterCard: 'summary_large_image',
});

const bodyHtml = computed(() => article.value ? renderTipTap(article.value.content) : '');
const formatDate = (date: string | null) => date
  ? new Intl.DateTimeFormat('zh-CN', { dateStyle: 'long' }).format(new Date(date))
  : '未发布';
</script>
