<template>
  <div>
    <header class="site-header">
      <div class="header-inner">
        <NuxtLink class="logo" to="/">中加网<span>中加新闻</span></NuxtLink>
        <nav>
          <NuxtLink to="/">{{ text.home }}</NuxtLink>
          <NuxtLink to="/articles">{{ text.news }}</NuxtLink>
          <NuxtLink to="/subscribe">{{ text.subscribe }}</NuxtLink>
          <a href="#about">{{ text.about }}</a>
        </nav>
        <div class="header-tools">
          <form class="header-search" role="search" @submit.prevent="search">
            <input v-model="keyword" :placeholder="text.search" :aria-label="text.search">
            <button type="submit" :aria-label="text.submitSearch">⌕</button>
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
          <a href="#about">{{ text.siteIntroduction }}</a>
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
const keyword = ref('');
const copy = {
  zh: {
    home: '首页', news: '全部新闻', subscribe: '订阅服务', about: '关于', search: '搜索新闻', submitSearch: '提交搜索',
    introduction: '关注加拿大与华人社区，提供独立、清晰、有现场感的新闻内容。', aboutUs: '关于我们', siteIntroduction: '网站介绍', contentCooperation: '内容合作',
    contact: '联系我们', phone: '电话', hours: '工作时间：周一至周五 9:00–17:00', services: '服务与订购', business: '广告与商务合作', enterprise: '企业新闻服务', placeholderNotice: '当前联系方式为开发阶段示例信息',
  },
  en: {
    home: 'Home', news: 'All News', subscribe: 'Subscriptions', about: 'About', search: 'Search news', submitSearch: 'Search',
    introduction: 'Independent and clear reporting focused on Canada and Chinese communities.', aboutUs: 'About Us', siteIntroduction: 'Our Story', contentCooperation: 'Editorial Partnerships',
    contact: 'Contact', phone: 'Phone', hours: 'Hours: Monday–Friday, 9:00–17:00', services: 'Services', business: 'Advertising & Partnerships', enterprise: 'Enterprise News Service', placeholderNotice: 'Contact details are placeholders during development',
  },
} as const;
const text = computed(() => copy[language.value]);
const toggleLanguage = () => { language.value = language.value === 'zh' ? 'en' : 'zh'; };
const search = async () => {
  const q = keyword.value.trim();
  await navigateTo({ path: '/articles', query: q ? { q } : {} });
};
</script>
