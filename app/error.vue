<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{ error: NuxtError }>()
const notFound = computed(() => props.error.statusCode === 404)

/** 通过 Nuxt 清理错误状态并返回首页。 */
function returnHome() {
  return clearError({ redirect: '/' })
}
</script>

<template>
  <UApp>
    <main class="grid min-h-dvh place-items-center px-6">
      <div class="max-w-md text-center">
        <p class="text-sm font-medium text-primary">{{ error.statusCode }}</p>
        <h1 class="mt-4 text-3xl font-semibold">{{ notFound ? '页面不存在' : '页面暂时无法打开' }}</h1>
        <p class="mt-4 text-muted">{{ notFound ? '请检查地址，或返回首页继续浏览。' : '请稍后重试。若问题持续出现，请联系平台支持。' }}</p>
        <UButton class="mt-8" size="lg" @click="returnHome">返回首页</UButton>
      </div>
    </main>
  </UApp>
</template>
