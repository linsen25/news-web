<template>
  <div>
    <div class="preview-banner">预览模式 · 此页面可显示尚未发布的草稿</div>
    <article v-if="article" class="story">
      <header class="story-header">
        <span class="category">{{ article.category.name }}</span>
        <h1>{{ article.title }}</h1>
        <p class="dek">{{ article.summary }}</p>
        <div class="byline">
          <span v-if="article.byline">文 / {{ article.byline }}</span>
          <time>{{ formatDate(article.articleDate) }}</time>
        </div>
      </header>
      <figure v-if="article.coverImage">
        <img :src="article.coverImage" :alt="article.title" />
        <figcaption>文章封面预览</figcaption>
      </figure>
      <div class="story-body" v-html="bodyHtml" />
      <footer class="story-tags"><span v-for="tag in article.tags" :key="tag.id"># {{ tag.name }}</span></footer>
    </article>
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
const token = typeof route.query.token === 'string' ? route.query.token : '';
if (!token) throw createError({ statusCode: 401, statusMessage: '缺少预览 token' });
const { preview } = usePublicArticles();
const { data: article } = await useAsyncData(
  `preview-${route.params.id}-${token}`,
  () => preview(String(route.params.id), token),
);
const bodyHtml = computed(() => article.value ? renderTipTap(article.value.content) : '');
const formatDate = (date: string) => new Intl.DateTimeFormat('zh-CN', { dateStyle: 'long' }).format(new Date(date));
useHead({ title: () => article.value ? `预览：${article.value.title}` : '文章预览' });
</script>
