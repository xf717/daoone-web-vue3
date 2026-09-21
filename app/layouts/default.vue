<script setup lang="ts">
import '~/assets/css/home/index.css'
import { useHomeDialog } from '~/composables/home/useHomeDialog'
const { dialog, boundary, show } = useHomeDialog()
const menuOpen = ref(false)
</script>

<template>
  <div class="dao-home flex min-h-dvh flex-col bg-[var(--dao-color-soft)]">
    <a href="#main-content" class="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:bg-white focus:p-3">跳至正文</a>
    <header class="sticky top-0 z-40 border-b border-default bg-[color-mix(in_srgb,var(--dao-color-soft)_85%,transparent)] backdrop-blur-md">
      <UContainer class="flex h-20 items-center justify-between">
        <NuxtLink to="/" class="flex items-baseline gap-3" aria-label="道一首页">
          <span class="font-serif text-2xl font-medium tracking-wide text-[var(--dao-color-primary)]">道一</span>
          <span class="text-[11px] font-medium tracking-[0.34em] text-muted">DAO ONE</span>
        </NuxtLink>
        <nav class="hidden items-center gap-9 text-[15px] md:flex">
          <a href="#top" class="font-medium text-highlighted">首页</a>
          <UPopover v-model:open="menuOpen" :ui="{ content: 'dao-home rounded-2xl bg-white p-6 shadow-lg' }">
            <button type="button" class="text-muted hover:text-highlighted">智能体</button>
            <template #content><div class="grid w-[560px] grid-cols-2 gap-8"><div class="flex flex-col gap-5"><a href="#agents" class="flex gap-3" @click="menuOpen = false"><UIcon name="i-lucide-message-square" class="mt-1 size-5 text-primary" /><span><strong class="block font-medium">八字智能体</strong><span class="mt-1 block text-sm text-muted">从现实问题出发，梳理值得核对的条件。</span></span></a><a href="#records" class="flex gap-3" @click="menuOpen = false"><UIcon name="i-lucide-notebook-pen" class="mt-1 size-5 text-primary" /><span><strong class="block font-medium">人生反馈</strong><span class="mt-1 block text-sm text-muted">记录经历，回看当时的判断。</span></span></a></div><div class="border-l border-default pl-6"><p class="font-serif text-xl">以盘为镜，不以盘定命。</p><p class="mt-3 text-sm leading-6 text-muted">先看一个问题，如何连接分析、经历与下一步行动。</p><a href="#agents" class="mt-4 inline-block text-sm" @click="menuOpen = false">查看使用示例 →</a></div></div></template>
          </UPopover>
          <a href="#research" class="text-muted hover:text-highlighted">研究与反思</a>
          <a href="#about" class="text-muted hover:text-highlighted">关于</a>
        </nav>
        <UButton color="neutral" variant="outline" class="home-button" @click="boundary('登录 / 注册')">登录 / 注册</UButton>
      </UContainer>
    </header>
    <main id="main-content" class="flex-1" tabindex="-1"><slot /></main>
    <footer id="about" class="border-t border-default bg-[var(--dao-color-soft)]">
      <UContainer class="flex flex-wrap items-center justify-between gap-4 py-8 text-sm text-muted">
        <span>以盘为镜，不以盘定命。</span>
        <nav aria-label="页脚" class="flex gap-5"><button type="button" @click="show('隐私政策 · 预览', '本页不提交个人资料。正式服务的数据用途、保存期限和删除方式以上线后的隐私政策为准。')">隐私政策</button><button type="button" @click="show('用户协议 · 预览', '本页为静态交互演示，正式服务条款尚未生效。')">用户协议</button><button type="button" @click="show('帮助与联系', '可先查阅首页常见问题。正式联系渠道待确认。')">帮助与联系</button><button type="button" @click="boundary('套餐与权益')">套餐与权益</button></nav>
        <span>© DaoOne 道一 · 本页为交互演示，命盘与分析使用示例数据。</span>
      </UContainer>
    </footer>
    <UModal v-model:open="dialog.open" :title="dialog.title" description="首页静态预览" :ui="{ content: 'dao-home rounded-2xl bg-white', title: 'font-serif text-2xl', body: 'text-base leading-8' }"><template #body><p class="whitespace-pre-line">{{ dialog.content }}</p></template></UModal>
  </div>
</template>
