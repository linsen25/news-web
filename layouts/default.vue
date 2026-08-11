<template>
  <div>
    <header class="site-header">
      <div class="header-inner">
        <NuxtLink class="logo" to="/">中加网<span>中加新闻</span></NuxtLink>
        <nav>
          <NuxtLink to="/">首页</NuxtLink>
          <NuxtLink to="/articles">全部新闻</NuxtLink>
          <a href="#about">关于</a>
        </nav>
        <span class="date">{{ today }}</span>
      </div>
    </header>
    <main><slot /></main>
    <footer id="about" class="site-footer">
      <div class="footer-grid">
        <section class="footer-brand">
          <strong>中加网</strong>
          <p>关注加拿大与华人社区，提供独立、清晰、有现场感的新闻内容。</p>
        </section>
        <section>
          <h2>关于我们</h2>
          <a href="#about">网站介绍</a>
          <NuxtLink to="/articles">全部新闻</NuxtLink>
          <span>内容合作</span>
        </section>
        <section>
          <h2>联系我们</h2>
          <span>邮箱：contact@zhongjia.example</span>
          <span>电话：+1 000 000 0000</span>
          <span>工作时间：周一至周五 9:00–17:00</span>
        </section>
        <section>
          <h2>服务与订购</h2>
          <span>订购热线：400-000-0000</span>
          <span>广告与商务合作</span>
          <span>企业新闻服务</span>
        </section>
      </div>
      <div class="footer-bottom">
        <small>© {{ new Date().getFullYear() }} 中加网 版权所有</small>
        <small>当前联系方式为开发阶段示例信息</small>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
const today = new Intl.DateTimeFormat('zh-CN', {
  month: 'long',
  day: 'numeric',
  weekday: 'short',
}).format(new Date());
</script>
