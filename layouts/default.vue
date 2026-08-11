<template>
  <div>
    <header class="site-header">
      <div class="header-inner">
        <NuxtLink class="logo" to="/">中加网<span>中加新闻</span></NuxtLink>
        <nav>
          <NuxtLink to="/">{{ text.home }}</NuxtLink>
          <NuxtLink to="/articles">{{ text.news }}</NuxtLink>
          <NuxtLink to="/subscribe">{{ text.subscribe }}</NuxtLink>
          <NuxtLink to="/about">{{ text.about }}</NuxtLink>
        </nav>
        <div class="header-tools">
          <form class="header-search" role="search" @submit.prevent="search" @focusin="searchOpen = true" @focusout="closeSearch">
            <input
              v-model="keyword"
              :placeholder="text.search"
              :aria-label="text.search"
              autocomplete="off"
              @keydown.down.prevent="moveSuggestion(1)"
              @keydown.up.prevent="moveSuggestion(-1)"
              @keydown.esc="searchOpen = false"
            >
            <button v-if="keyword" class="search-clear" type="button" :aria-label="text.clearSearch" @click="clearSearch">×</button>
            <button class="search-submit" type="submit" :aria-label="text.submitSearch">
              <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="6.5"/><path d="m16 16 4 4"/></svg>
            </button>
            <div v-if="searchOpen && keyword.trim()" class="search-suggestions">
              <template v-if="suggestions.length">
                <button
                  v-for="(article, index) in suggestions"
                  :key="article.id"
                  type="button"
                  :class="{ active: index === activeSuggestion }"
                  @mousedown.prevent="openArticle(article.slug)"
                >
                  <strong>{{ article.title }}</strong>
                  <span>{{ article.category.name }} · {{ formatSuggestionDate(article.articleDate) }}</span>
                </button>
                <button class="search-all" type="submit" @mousedown.prevent="search">{{ text.viewResults }}</button>
              </template>
              <p v-else>{{ text.noSuggestions }}</p>
            </div>
          </form>
          <button class="language-toggle" type="button" @click="toggleLanguage">
            {{ language === 'zh' ? 'EN' : '中文' }}
          </button>
        </div>
      </div>
    </header>
    <main><slot /></main>
    <footer id="about" class="site-footer">
      <div class="footer-grid">
        <section class="footer-brand">
          <strong>中加网</strong>
          <p>{{ text.introduction }}</p>
        </section>
        <section>
          <h2>{{ text.aboutUs }}</h2>
          <NuxtLink to="/about">{{ text.siteIntroduction }}</NuxtLink>
          <NuxtLink to="/articles">{{ text.news }}</NuxtLink>
          <span>{{ text.contentCooperation }}</span>
        </section>
        <section>
          <h2>{{ text.contact }}</h2>
          <span>Email: contact@zhongjia.example</span>
          <span>{{ text.phone }}: +1 000 000 0000</span>
          <span>{{ text.hours }}</span>
        </section>
        <section>
          <h2>{{ text.services }}</h2>
          <NuxtLink to="/subscribe">{{ text.subscribe }}</NuxtLink>
          <span>{{ text.business }}</span>
          <span>{{ text.enterprise }}</span>
        </section>
      </div>
      <div class="footer-bottom">
        <small>© {{ new Date().getFullYear() }} 中加网</small>
        <small>{{ text.placeholderNotice }}</small>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
const language = useCookie<'zh' | 'en'>('site-language', { default: () => 'zh' });
const route = useRoute();
const keyword = ref('');
const searchOpen = ref(false);
const activeSuggestion = ref(-1);
const { list } = usePublicArticles();
const { data: searchableArticles } = await useAsyncData('header-search-articles', list, { default: () => [] });
const copy = {
  zh: {
    home: '首页', news: '全部新闻', subscribe: '订阅服务', about: '关于', search: '搜索新闻', submitSearch: '提交搜索', clearSearch: '清除搜索', viewResults: '查看全部搜索结果 →', noSuggestions: '没有匹配的文章',
    introduction: '关注加拿大与华人社区，提供独立、清晰、有现场感的新闻内容。', aboutUs: '关于我们', siteIntroduction: '网站介绍', contentCooperation: '内容合作',
    contact: '联系我们', phone: '电话', hours: '工作时间：周一至周五 9:00–17:00', services: '服务与订购', business: '广告与商务合作', enterprise: '企业新闻服务', placeholderNotice: '当前联系方式为开发阶段示例信息',
  },
  en: {
    home: 'Home', news: 'All News', subscribe: 'Subscriptions', about: 'About', search: 'Search news', submitSearch: 'Search', clearSearch: 'Clear search', viewResults: 'View all search results →', noSuggestions: 'No matching stories',
    introduction: 'Independent and clear reporting focused on Canada and Chinese communities.', aboutUs: 'About Us', siteIntroduction: 'Our Story', contentCooperation: 'Editorial Partnerships',
    contact: 'Contact', phone: 'Phone', hours: 'Hours: Monday–Friday, 9:00–17:00', services: 'Services', business: 'Advertising & Partnerships', enterprise: 'Enterprise News Service', placeholderNotice: 'Contact details are placeholders during development',
  },
} as const;
const text = computed(() => copy[language.value]);
const toggleLanguage = () => { language.value = language.value === 'zh' ? 'en' : 'zh'; };
const suggestions = computed(() => {
  const query = keyword.value.trim().toLocaleLowerCase();
  if (!query) return [];
  return searchableArticles.value
    .map((article) => {
      const title = article.title.toLocaleLowerCase();
      const secondary = [article.summary, article.category.name, ...article.tags.map((tag) => tag.name)].join(' ').toLocaleLowerCase();
      return { article, score: title === query ? 0 : title.startsWith(query) ? 1 : title.includes(query) ? 2 : secondary.includes(query) ? 3 : 99 };
    })
    .filter(({ score }) => score < 99)
    .sort((a, b) => a.score - b.score)
    .slice(0, 6)
    .map(({ article }) => article);
});
const formatSuggestionDate = (date: string | null) => date
  ? new Intl.DateTimeFormat(language.value === 'zh' ? 'zh-CN' : 'en-CA', { year: 'numeric', month: 'short', day: 'numeric' }).format(new Date(date))
  : language.value === 'zh' ? '未发布' : 'Unpublished';
const moveSuggestion = (step: number) => {
  if (!suggestions.value.length) return;
  searchOpen.value = true;
  activeSuggestion.value = (activeSuggestion.value + step + suggestions.value.length) % suggestions.value.length;
};
const openArticle = async (slug: string) => {
  searchOpen.value = false;
  activeSuggestion.value = -1;
  await navigateTo(`/articles/${slug}`);
};
const closeSearch = () => { window.setTimeout(() => { searchOpen.value = false; activeSuggestion.value = -1; }, 120); };
const clearSearch = async () => {
  keyword.value = '';
  searchOpen.value = false;
  if (route.path === '/articles' && route.query.q) await navigateTo('/articles');
};
const search = async () => {
  const q = keyword.value.trim();
  if (activeSuggestion.value >= 0 && suggestions.value[activeSuggestion.value]) {
    await openArticle(suggestions.value[activeSuggestion.value].slug);
    return;
  }
  searchOpen.value = false;
  await navigateTo({ path: '/articles', query: q ? { q } : {} });
};
watch(() => route.fullPath, () => {
  if (!route.query.q) keyword.value = '';
  searchOpen.value = false;
  activeSuggestion.value = -1;
});
</script>
