<script setup lang="ts">
const emit = defineEmits<{ explain: [title: string, content: string] }>()
const draft = reactive({ calendar: 'solar', sex: '男', date: '1992-06-18', time: '', place: '', pillars: '', nickname: '', clock: 'local', timezone: 'UTC+08:00', day: '23', leap: false })
const more = ref(false)
const error = ref('')
const errorField = ref('')
const notice = ref('')
const result = ref<{ draft: typeof draft, pairs: string[] } | null>(null)
const inputUi = { base: 'home-control w-full' }
const selectUi = { base: 'home-control w-full', content: 'dao-home bg-white', item: 'min-h-12 text-[15px]' }
const fieldUi = { label: 'home-field-label', container: 'mt-2' }
const calendarItems = [{ label: '公历', value: 'solar' }, { label: '农历', value: 'lunar' }, { label: '四柱', value: 'pillars' }]
const sample = ['庚午', '己卯', '甲子', '己巳']
const labels = ['年柱', '月柱', '日柱', '时柱']
const dayGan = computed(() => result.value?.pairs[2]?.[0] || '甲')
const elements: Record<string, string> = { 甲: '木', 乙: '木', 丙: '火', 丁: '火', 戊: '土', 己: '土', 庚: '金', 辛: '金', 壬: '水', 癸: '水' }
watch(draft, () => { result.value = null; error.value = ''; errorField.value = ''; notice.value = '' })
function focusField(id: string) { document.getElementById(id)?.focus() }
async function fillExample() {
  draft.calendar = 'pillars'
  draft.pillars = sample.join('／')
  draft.sex = '男'
  await nextTick()
  notice.value = '已填入示例四柱，点击“生成基础盘”查看。'
  focusField('chart-pillars')
}
defineExpose({ fillExample })
function invalid(field: string, message: string) {
  error.value = message
  errorField.value = field
  nextTick(() => focusField(`chart-${field}`))
}
async function generate() {
  error.value = ''
  errorField.value = ''
  let pairs = sample
  if (draft.calendar === 'pillars') {
    const raw = draft.pillars.trim().replace(/[／/\s]/g, '')
    if (!/^([甲乙丙丁戊己庚辛壬癸][子丑寅卯辰巳午未申酉戌亥]){4}$/.test(raw)) return invalid('pillars', '请输入四组完整干支，例如庚午／己卯／甲子／己巳。')
    pairs = raw.match(/.{2}/g)!
  }
  else {
    const date = draft.date.trim().replace(/^(\d{4})(\d{2})(\d{2})$/, '$1-$2-$3')
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return invalid('date', '请按年-月-日填写，例如 1992-06-18。')
    const [year = 0, month = 0, day = 0] = date.split('-').map(Number)
    if (year < 1900 || year > 2100 || month < 1 || month > 12 || day < 1 || day > (draft.calendar === 'lunar' ? 30 : new Date(year, month, 0).getDate())) return invalid('date', '请核对有效日期，年份范围为 1900—2100。')
    if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(draft.time)) return invalid('time', '请填写有效的 24 小时制出生时间。')
    if (!draft.place.trim()) return invalid('place', '请填写出生地点。')
  }
  result.value = { draft: { ...draft }, pairs }
  notice.value = ''
  await nextTick()
  document.getElementById('chart-result')?.focus()
}
async function edit() {
  result.value = null
  await nextTick()
  focusField(draft.calendar === 'pillars' ? 'chart-pillars' : 'chart-date')
}
</script>

<template>
  <div class="contents">
    <form id="chart-form" class="rounded-2xl border border-default bg-white p-8 shadow-[var(--dao-shadow-soft)]" novalidate @submit.prevent="generate">
      <h2 class="mb-6 font-serif text-[26px] text-highlighted">八字排盘</h2>
      <div class="flex flex-col gap-5">
        <UFormField label="输入方式" :ui="fieldUi"><USelect v-model="draft.calendar" :items="calendarItems" :ui="selectUi" class="w-full" /></UFormField>
        <div class="grid grid-cols-[110px_1fr_170px] gap-4">
          <UFormField label="排盘性别" :ui="fieldUi"><USelect v-model="draft.sex" :items="['男', '女']" :ui="selectUi" class="w-full" /></UFormField>
          <template v-if="draft.calendar !== 'pillars'">
            <UFormField :label="`出生日期 · ${draft.calendar === 'lunar' ? '农历' : '公历'}`" :error="errorField === 'date' ? error : undefined" :ui="fieldUi"><UInput id="chart-date" v-model="draft.date" placeholder="1992-06-18" :ui="inputUi" class="w-full" /></UFormField>
            <UFormField label="出生时间 · 24小时" :error="errorField === 'time' ? error : undefined" :ui="fieldUi"><UInput id="chart-time" v-model="draft.time" type="time" :ui="inputUi" class="w-full" /></UFormField>
          </template>
          <UFormField v-else label="年柱／月柱／日柱／时柱" class="col-span-2" :error="errorField === 'pillars' ? error : undefined" :ui="fieldUi"><UInput id="chart-pillars" v-model="draft.pillars" placeholder="庚午／己卯／甲子／己巳" :ui="inputUi" class="w-full" /></UFormField>
        </div>
        <UCheckbox v-if="draft.calendar === 'lunar'" v-model="draft.leap" label="闰月" />
        <UFormField v-if="draft.calendar !== 'pillars'" label="出生地点" :error="errorField === 'place' ? error : undefined" :ui="fieldUi"><UInput id="chart-place" v-model="draft.place" placeholder="省 / 市 / 区" :ui="inputUi" class="w-full" /></UFormField>
        <button type="button" class="flex items-center gap-2 text-left text-[13px] text-muted" :aria-expanded="more" aria-controls="chart-settings" @click="more = !more"><UIcon name="i-lucide-sliders-horizontal" class="size-4" />更多设置：昵称、真太阳时与时区<UIcon :name="more ? 'i-lucide-chevron-up' : 'i-lucide-chevron-down'" class="ml-auto size-4" /></button>
        <div v-if="more" id="chart-settings" class="grid grid-cols-2 gap-4 border-t border-default pt-5">
          <UFormField label="昵称" :ui="fieldUi"><UInput v-model="draft.nickname" maxlength="30" placeholder="可选" :ui="inputUi" class="w-full" /></UFormField>
          <UFormField label="时间口径" :ui="fieldUi"><USelect v-model="draft.clock" :items="[{ label: '当地钟表时间', value: 'local' }, { label: '真太阳时', value: 'solar' }]" :ui="selectUi" class="w-full" /></UFormField>
          <UFormField label="时区" :ui="fieldUi"><UInput v-model="draft.timezone" :ui="inputUi" class="w-full" /></UFormField>
          <UFormField label="换日方式" :ui="fieldUi"><USelect v-model="draft.day" :items="[{ label: '23:00 换日', value: '23' }, { label: '00:00 换日', value: '0' }]" :ui="selectUi" class="w-full" /></UFormField>
          <p class="col-span-2 text-xs text-muted">此版本保留设置供核对，尚不执行历法或时间换算。</p>
        </div>
        <p v-if="notice" role="status" class="text-sm text-muted">{{ notice }}</p>
        <p v-if="error" role="alert" class="sr-only">{{ error }}</p>
        <UButton type="submit" class="home-button home-action justify-center" :ui="{ trailingIcon: 'ms-0' }" trailing-icon="i-lucide-arrow-right">生成基础盘</UButton>
        <p class="text-center text-[13px] text-muted">无需登录即可看基础盘；查看更多信息时再登录。</p>
      </div>
    </form>
    <section v-if="result" id="chart-result" tabindex="-1" aria-label="生成的基础盘" class="rounded-2xl border border-default bg-white p-8 shadow-[var(--dao-shadow-soft)] lg:col-span-2">
      <div class="flex items-center justify-between gap-4"><h2 class="font-serif text-2xl">{{ result.draft.nickname || '本次资料' }} · 基础盘</h2><UButton color="neutral" variant="outline" class="home-button" @click="edit">修改资料</UButton></div>
      <p class="mt-4 text-sm text-muted">{{ result.draft.calendar === 'pillars' ? `四柱输入 · ${result.pairs.join('／')}` : `${result.draft.calendar === 'lunar' ? '农历' : '公历'} ${result.draft.date} ${result.draft.time} · ${result.draft.place}` }} · {{ result.draft.sex }}</p>
      <p class="mt-3 text-sm leading-6 text-muted">{{ result.draft.calendar === 'pillars' ? '以下为输入的干支，四柱组合与历法对应尚未核验。' : '以下为固定教学盘，并非根据出生资料计算。' }}</p>
      <div class="my-6 grid grid-cols-4 border-y border-default py-6"><div v-for="(pair, i) in result.pairs" :key="i" class="flex flex-col items-center gap-2"><span class="text-xs text-muted">{{ labels[i] }}</span><span class="font-serif text-3xl">{{ pair[0] }}</span><span class="font-serif text-3xl">{{ pair[1] }}</span></div></div>
      <p>日干：{{ dayGan }} · 五行属性：{{ elements[dayGan] }}</p>
      <div class="mt-5 flex flex-wrap gap-4"><UButton color="neutral" variant="outline" class="home-button" @click="emit('explain', '基础盘怎么看？', '四柱依次是年、月、日、时，每柱上方为天干，下方为地支。日干是日柱上方的字。这里展示的是输入或教学盘面，不据此给出职业、关系等判断。')">这些信息怎么看？</UButton><UButton class="home-button home-action" @click="emit('explain', '查看完整命盘', '完整命盘需要登录后继续。本次仅实现首页静态预览，登录及专业细盘尚未迁移；不会提交你的资料。')">查看完整命盘</UButton></div>
    </section>
  </div>
</template>
