<script setup lang="ts">
const nav = [
  { label: '首页', to: '/' },
  { label: '智能体', to: '/' },
  { label: '研究与反思', to: '/' },
  { label: '关于', to: '/' },
]
</script>

<template>
  <div class="flex min-h-dvh flex-col bg-[var(--dao-color-soft)]">
    <a href="#main-content" class="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:bg-white focus:p-3">跳至正文</a>
    <header class="sticky top-0 z-40 border-b border-default bg-[color-mix(in_srgb,var(--dao-color-soft)_85%,transparent)] backdrop-blur-md">
      <UContainer class="flex h-20 items-center justify-between">
        <NuxtLink to="/" class="flex items-baseline gap-3" aria-label="道一首页">
          <span class="font-serif text-2xl font-medium tracking-wide text-[var(--dao-color-primary)]">道一</span>
          <span class="text-[11px] font-medium tracking-[0.34em] text-muted">DAO ONE</span>
        </NuxtLink>
        <nav class="hidden items-center gap-9 text-[15px] md:flex">
          <NuxtLink
            v-for="(item, i) in nav"
            :key="item.label"
            :to="item.to"
            :class="i === 0 ? 'font-medium text-highlighted' : 'text-muted transition-colors hover:text-highlighted'"
          >{{ item.label }}</NuxtLink>
        </nav>
        <UButton color="neutral" variant="outline" size="md">登录 / 注册</UButton>
      </UContainer>
    </header>
    <main id="main-content" class="flex-1" tabindex="-1"><slot /></main>
    <footer class="border-t border-default bg-[var(--dao-color-soft)]">
      <UContainer class="flex flex-wrap items-center justify-between gap-4 py-8 text-sm text-muted">
        <span>以盘为镜，不以盘定命。</span>
        <span>© DaoOne 道一 · 本页为交互演示，命盘与分析使用示例数据。</span>
      </UContainer>
    </footer>
  </div>
</template>
