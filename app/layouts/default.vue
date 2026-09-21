<template>
  <div class="flex min-h-dvh flex-col">
    <a href="#main-content" class="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:bg-white focus:p-3">跳至正文</a>
    <header class="border-b border-default">
      <UContainer class="flex h-20 items-center justify-between">
        <NuxtLink to="/" class="text-xl font-semibold tracking-wide text-primary" aria-label="道一首页">道一 <span class="ml-2 text-sm font-normal text-muted">DaoOne</span></NuxtLink>
        <span class="text-sm text-muted">由术入理，借象明道</span>
      </UContainer>
    </header>
    <main id="main-content" class="flex-1" tabindex="-1"><slot /></main>
    <footer class="border-t border-default py-6">
      <UContainer class="text-sm text-muted">以盘为镜，不以盘定命。</UContainer>
    </footer>
  </div>
</template>
