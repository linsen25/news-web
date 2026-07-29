<template>
  <div>
    <header class="site-header">
      <div class="header-inner">
        <NuxtLink class="logo" to="/">THE CURRENT<span>当下新闻</span></NuxtLink>
        <nav><NuxtLink to="/">首页</NuxtLink><NuxtLink to="/articles">全部新闻</NuxtLink><a href="#about">关于</a></nav>
        <span class="date">{{ today }}</span>
      </div>
    </header>
    <main><slot /></main>
    <footer id="about"><div><strong>THE CURRENT</strong><p>独立、清晰、有现场感。</p></div><small>新闻 CMS 第一阶段 Mock 展示 · {{ new Date().getFullYear() }}</small></footer>
  </div>
</template>

<script setup lang="ts">
const today = new Intl.DateTimeFormat('zh-CN', { month: 'long', day: 'numeric', weekday: 'short' }).format(new Date());
</script>
