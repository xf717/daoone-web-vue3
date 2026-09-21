<script setup lang="ts">
import { useWorkspacePreview } from '~/composables/workspace/useWorkspacePreview'
import type { NavigationMenuItem } from '@nuxt/ui'
const open = ref(false)
const { prototype } = useWorkspacePreview()
const item = (label: string, icon: string, path: string): NavigationMenuItem => ({
  label, icon, to: prototype(path), target: '_blank',
  title: `${label} · 在新标签页打开交互原型`, onSelect: () => { open.value = false },
})
const primary: NavigationMenuItem[] = [
  { label: '我的空间', icon: 'i-lucide-house', to: '/workspace', exact: true, onSelect: () => { open.value = false } },
  item('我的命盘', 'i-lucide-orbit', 'W12-cases/prototype.html'),
  item('我的问题', 'i-lucide-notebook-pen', 'W30-problems/prototype.html'),
  item('智能体', 'i-lucide-sparkles', 'W20-agents/prototype.html'),
]
const secondary: NavigationMenuItem[] = [
  item('研究与对照', 'i-lucide-git-compare-arrows', 'W32-question/prototype.html?tab=comparison'),
  item('方法库', 'i-lucide-library', 'W37-methods/prototype.html'),
  item('学习案例', 'i-lucide-book-open', 'learning/prototype.html'),
]
const services: NavigationMenuItem[] = [
  item('积分与权益', 'i-lucide-ticket', 'W50-commerce/prototype.html?page=W50'),
  item('帮助与协议', 'i-lucide-circle-help', 'W02-help/prototype.html'),
]
const navUi = { link: 'min-h-11 px-3 rounded-lg', linkLabel: 'text-sm', linkLeadingIcon: 'size-[18px]' }
</script>

<template>
  <div class="workspace-shell">
    <a href="#workspace-content" class="workspace-skip">跳至正文</a>
    <UDashboardGroup unit="rem" storage-key="daoone-workspace-preview">
      <UDashboardSidebar id="member" v-model:open="open" collapsible :default-size="15.5" :collapsed-size="4.5" :min-size="4.5" :menu="{ title: '个人空间导航', description: '主要功能与账户入口' }" :ui="{ root: 'workspace-sidebar', header: 'h-24 px-5', body: 'px-3 gap-1', footer: 'p-3' }">
        <template #header="{ collapsed }">
          <NuxtLink to="/workspace" class="workspace-brand" aria-label="道一 · 我的空间">
            <span class="brand-mark" aria-hidden="true">一</span>
            <span v-if="!collapsed" class="brand-word">道一<span>DaoOne</span></span>
          </NuxtLink>
        </template>
        <template #default="{ collapsed }">
          <UNavigationMenu :collapsed="collapsed" :items="primary" orientation="vertical" tooltip :ui="navUi" />
          <p v-if="!collapsed" class="nav-caption">探索与积累</p>
          <div v-else class="nav-divider" />
          <UNavigationMenu :collapsed="collapsed" :items="secondary" orientation="vertical" tooltip :ui="navUi" />
          <div class="mt-auto pt-8">
            <UNavigationMenu :collapsed="collapsed" :items="services" orientation="vertical" tooltip :ui="navUi" />
          </div>
          <p v-if="!collapsed" class="sidebar-thought">以盘为镜，不以盘定命。</p>
        </template>
        <template #footer="{ collapsed }">
          <WorkspaceAccountMenu :collapsed="collapsed" />
        </template>
      </UDashboardSidebar>
      <slot />
    </UDashboardGroup>
  </div>
</template>

<style src="~/assets/css/workspace/index.css" />
