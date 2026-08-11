<template>
  <article class="article-card" :class="{ featured }">
    <NuxtLink :to="`/articles/${article.slug}`" class="card-image"><img :src="article.coverImage" :alt="article.title" /></NuxtLink>
    <div class="card-copy">
      <NuxtLink class="category" :to="{ path: '/articles', query: { category: article.category.slug } }">{{ article.category.name }}</NuxtLink>
      <h2><NuxtLink :to="`/articles/${article.slug}`">{{ article.title }}</NuxtLink></h2>
      <p>{{ article.summary }}</p>
      <small>{{ article.author.name }} · {{ formatDate(article.publishedAt) }}</small>
    </div>
  </article>
</template>

<script setup lang="ts">
import type { ArticleDTO } from '~/types/article';
withDefaults(defineProps<{ article: ArticleDTO; featured?: boolean }>(), { featured: false });
const formatDate = (date: string | null) => date ? new Intl.DateTimeFormat('zh-CN', { month: 'long', day: 'numeric' }).format(new Date(date)) : '未发布';
</script>
