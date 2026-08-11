<template>
  <article class="article-card" :class="{ featured }">
    <NuxtLink :to="`/articles/${article.slug}`" class="card-image" :class="{ 'image-placeholder': !article.coverImage }">
      <img v-if="article.coverImage" :src="article.coverImage" :alt="article.title" />
      <span v-else>CHINA CANADA NET</span>
    </NuxtLink>
    <div class="card-copy">
      <NuxtLink class="category" :to="{ path: '/articles', query: { category: article.category.slug } }">{{ localizedName(article.category) }}</NuxtLink>
      <h2><NuxtLink :to="`/articles/${article.slug}`">{{ article.title }}</NuxtLink></h2>
      <p>{{ article.summary }}</p>
      <small>{{ article.byline }} · {{ formatDate(article.articleDate) }}</small>
    </div>
  </article>
</template>

<script setup lang="ts">
import type { ArticleDTO } from '~/types/article';
withDefaults(defineProps<{ article: ArticleDTO; featured?: boolean }>(), { featured: false });
const language = useCookie<'zh' | 'en'>('site-language', { default: () => 'zh' });
const localizedName = (item: { name: string; nameEn?: string }) => language.value === 'en' && item.nameEn ? item.nameEn : item.name;
const formatDate = (date: string | null) => date
  ? new Intl.DateTimeFormat(language.value === 'zh' ? 'zh-CN' : 'en-CA', { month: 'long', day: 'numeric' }).format(new Date(date))
  : language.value === 'zh' ? '未发布' : 'Unpublished';
</script>
