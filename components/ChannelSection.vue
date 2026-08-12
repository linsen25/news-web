<template>
  <section v-if="articles.length" class="channel-section" :class="`channel-layout-${variant}`">
    <header class="channel-heading">
      <NuxtLink :to="`/category/${category.slug}`">{{ localizedName(category) }}</NuxtLink>
      <NuxtLink :to="`/category/${category.slug}`">{{ language === 'zh' ? '查看全部' : 'View all' }} →</NuxtLink>
    </header>
    <div class="channel-stories">
      <article v-for="(article, index) in articles.slice(0, 4)" :key="article.id" class="channel-story" :class="{ lead: index === 0 }">
        <NuxtLink class="card-image" :to="`/articles/${article.slug}`">
          <img v-if="articleImage(article)" :src="articleImage(article)" :alt="article.title">
          <span v-else>CHINA CANADA NET</span>
        </NuxtLink>
        <div>
          <NuxtLink class="channel-tag" :to="{ path: `/category/${category.slug}`, query: { tag: article.tags[0]?.slug } }">
            {{ article.tags[0] ? localizedName(article.tags[0]) : localizedName(category) }}
          </NuxtLink>
          <h2><NuxtLink :to="`/articles/${article.slug}`">{{ article.title }}</NuxtLink></h2>
          <p>{{ article.summary }}</p>
          <small>{{ article.byline }}<template v-if="article.byline"> · </template>{{ formatDate(article.articleDate) }}</small>
        </div>
      </article>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { ArticleDTO } from '~/types/article';
import type { PublicCategory } from '~/composables/usePublicCatalog';

defineProps<{ category: PublicCategory; articles: ArticleDTO[]; variant: number }>();
const language = useCookie<'zh' | 'en'>('site-language', { default: () => 'zh' });
const localizedName = (item: { name: string; nameEn?: string }) => language.value === 'en' && item.nameEn ? item.nameEn : item.name;
const articleImage = (article: ArticleDTO) => article.coverImage || '';
const formatDate = (date: string | null) => date
  ? new Intl.DateTimeFormat(language.value === 'zh' ? 'zh-CN' : 'en-CA', { month: 'long', day: 'numeric' }).format(new Date(date))
  : '';
</script>
