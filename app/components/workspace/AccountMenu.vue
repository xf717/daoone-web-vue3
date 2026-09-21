<script setup lang="ts">
import { useWorkspacePreview } from '~/composables/workspace/useWorkspacePreview'
import type { DropdownMenuItem } from '@nuxt/ui'
defineProps<{ collapsed?: boolean }>()
const { name, fresh, signedOut, prototype } = useWorkspacePreview()
const profileOpen = ref(false)
const exitOpen = ref(false)
const nickname = ref(name.value)
const error = ref('')
const items = computed<DropdownMenuItem[][]>(() => [
  [{ label: name.value, type: 'label' }],
  [{ label: '个人资料', icon: 'i-lucide-user-round', onSelect: () => { error.value = ''; profileOpen.value = true } },
    { label: '我的订单', icon: 'i-lucide-receipt-text', to: prototype('W50-commerce/prototype.html?page=W56'), target: '_blank' }],
  [{ label: fresh.value ? '切换已有记录预览' : '切换新用户预览', icon: 'i-lucide-scan-eye', onSelect: () => { fresh.value = !fresh.value } }],
  [{ label: '退出登录', icon: 'i-lucide-log-out', onSelect: () => { exitOpen.value = true } }],
])
function save() {
  const value = nickname.value.trim()
  if (!value || value.length > 20) { error.value = '请输入 1–20 个字符的昵称'; return }
  name.value = value
  profileOpen.value = false
}
</script>
<template>
  <UDropdownMenu :items="items" :content="{ align: 'start', side: 'top', sideOffset: 12 }" :ui="{ content: 'w-60', item: 'min-h-10' }">
    <button class="account-trigger" :class="{ compact: collapsed }" aria-label="打开个人账户菜单">
      <span class="account-avatar">{{ Array.from(name)[0] }}</span>
      <span v-if="!collapsed" class="account-copy"><strong>{{ name }}</strong><small>个人账户</small></span>
      <UIcon v-if="!collapsed" name="i-lucide-chevrons-up-down" class="size-4 ml-auto" />
    </button>
  </UDropdownMenu>
  <UModal v-model:open="profileOpen" title="个人资料" description="此处修改仅用于本次页面预览，不会更新真实账户。">
    <template #body>
      <form id="preview-profile" class="space-y-5" @submit.prevent="save">
        <UFormField label="昵称" name="nickname" :error="error || undefined">
          <UInput v-model="nickname" class="w-full" size="xl" maxlength="20" autocomplete="nickname" />
        </UFormField>
        <p class="text-sm text-muted">未应用的输入在关闭后暂存；刷新或离开页面后不保留。</p>
      </form>
    </template>
    <template #footer><UButton type="submit" form="preview-profile" label="应用到预览" size="lg" /></template>
  </UModal>
  <UModal v-model:open="exitOpen" title="退出当前预览？" description="本页未接入真实登录。此操作仅展示退出状态，不会注销其他页面的账户。">
    <template #footer>
      <UButton label="继续浏览" color="neutral" variant="outline" @click="exitOpen = false" />
      <UButton label="退出预览" @click="exitOpen = false; signedOut = true" />
    </template>
  </UModal>
</template>
