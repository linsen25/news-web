<template>
  <article class="article-card" :class="{ featured }">
    <NuxtLink :to="`/articles/${article.slug}`" class="card-image" :class="{ 'image-placeholder': !cardImage }">
      <img v-if="cardImage" :src="cardImage" :alt="article.title" />
      <span v-else>CHINA CANADA NET</span>
    </NuxtLink>
    <div class="card-copy">
      <NuxtLink class="category" :to="`/category/${article.category.slug}`">{{ localizedName(article.category) }}</NuxtLink>
      <h2><NuxtLink :to="`/articles/${article.slug}`">{{ article.title }}</NuxtLink></h2>
      <p>{{ article.summary }}</p>
      <small><template v-if="article.byline">{{ article.byline }} · </template>{{ formatDate(article.articleDate) }}</small>
    </div>
  </article>
</template>

<script setup lang="ts">
import type { ArticleDTO } from '~/types/article';
const props = withDefaults(defineProps<{ article: ArticleDTO; featured?: boolean }>(), { featured: false });
const language = useCookie<'zh' | 'en'>('site-language', { default: () => 'zh' });
const findFirstImage = (nodes: ArticleDTO['content']['content'] = []): string => {
  for (const node of nodes) {
    if (node.type === 'image' && typeof node.attrs?.src === 'string') return node.attrs.src;
    const nested = node.content ? findFirstImage(node.content) : '';
    if (nested) return nested;
  }
  return '';
};
const cardImage = computed(() => props.article.coverImage || findFirstImage(props.article.content.content));
const localizedName = (item: { name: string; nameEn?: string }) => language.value === 'en' && item.nameEn ? item.nameEn : item.name;
const formatDate = (date: string | null) => date
  ? new Intl.DateTimeFormat(language.value === 'zh' ? 'zh-CN' : 'en-CA', { month: 'long', day: 'numeric' }).format(new Date(date))
  : language.value === 'zh' ? '未发布' : 'Unpublished';
</script>
