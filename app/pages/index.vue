<script setup lang="ts">
import { useHomeDialog } from '~/composables/home/useHomeDialog'
const { show, boundary } = useHomeDialog()
const chart = useTemplateRef('chart')
const stage = ref(2)
const journal = [
  ['最初 · 提问记录', '先留下，此刻的犹豫。', '新机会薪资更高，但通勤更长，值得换吗？', '薪资更高，每天通勤可能增加 40 分钟，团队培养安排还不清楚。'],
  ['接着 · 分析参考', '先把要了解的事列清楚。', '先比较职责、成长机会与通勤成本，再决定是否继续面试。', '向面试官确认职责、导师安排与弹性办公条件。'],
  ['后来 · 面试后的补充', '新的信息，留在新的记录里。', '面试后了解到新团队有导师安排，但每天通勤会增加 40 分钟。先确认弹性办公安排，再与当前岗位比较。', '这是后来补充的内容，不作为最初分析时已经知道的事实。'],
  ['现在 · 下一步计划', '不急着决定，先问清楚。', '先整理哪些条件已经确认、哪些还需了解，再决定下一步。', '当前示例没有记录行动结果；执行之后，再留下真实经历。'],
] as const
const comparison = [
  { own: '希望成长，不只是换个环境。', ownText: '想承担更有挑战的职责，也希望遇到问题时有人可以讨论。', ai: '先了解，成长如何发生。', aiText: '把岗位介绍里的“成长空间”，落实到具体任务、培养安排与支持方式。', common: '都在意成长。个人期待与岗位承诺之间，还需要具体事实。', missing: '入职前三个月做什么？遇到困难时，谁会提供支持？' },
  { own: '多出的通勤，会挤掉什么？', ownText: '工作之外，也想保留陪伴家人的时间。这部分取舍不能只用薪资衡量。', ai: '让时间成本，也进入比较。', aiText: '确认实际通勤和办公安排，再看看新的节奏是否能被日常生活接纳。', common: '时间值得被认真计算，也值得由自己衡量。', missing: '实际需要多久？是否支持弹性办公？每周的生活安排会怎样变化？' },
  { own: '也给留下来，一次认真比较。', ownText: '换工作是一种选择，争取当前岗位的新职责，也可能带来变化。', ai: '用相同的问题，看看两个选择。', aiText: '分别了解新岗位与当前岗位的职责、支持和时间安排，再作取舍。', common: '比较不急着给出胜负，而是帮助发现下一步该了解什么。', missing: '当前团队能否提供新的任务？哪些条件已确认，哪些还只是期待？' },
]
function recordDetail() { show('面试后的补充记录', journal[2][2] + '\n\n下一步：确认弹性办公是否可行，再作比较。') }
function evidence() { show('本例依据', '提问时：薪资、通勤与成长的取舍。\n当时的参考：梳理职责、支持与时间成本。\n面试后补充：导师安排与通勤变化。后续事实不会改写此前分析。') }

const pillars = [
  { label: '年柱', gan: '庚', zhi: '午' },
  { label: '月柱', gan: '己', zhi: '卯' },
  { label: '日柱', gan: '甲', zhi: '子' },
  { label: '时柱', gan: '己', zhi: '巳' },
]

const questions = [
  { icon: 'i-lucide-scale', text: '新机会薪资更高，但通勤更长，值得换吗？', next: '向面试官确认职责、导师安排与弹性办公条件，再与当前岗位比较。' },
  { icon: 'i-lucide-briefcase', text: '现在的工作很熟悉，留下来还有成长空间吗？', next: '列出近一年可争取的项目与轮岗机会，判断成长是否还有增量。' },
  { icon: 'i-lucide-message-square', text: '有了面试机会，我该重点问什么？', next: '优先问团队构成、考核方式与真实工作节奏，而非只看职级名称。' },
]
const selectedQ = ref(0)

const stages = [
  { icon: 'i-lucide-message-square-text', tag: '最初', name: '当时的问题' },
  { icon: 'i-lucide-notebook-pen', tag: '接着', name: '分析参考' },
  { icon: 'i-lucide-file-plus', tag: '后来', name: '面试之后' },
  { icon: 'i-lucide-list-checks', tag: '现在', name: '下一步行动' },
]

const dimensions = ['成长机会', '生活与时间', '去留选择']
const dimension = ref(0)
function dimensionKey(event: KeyboardEvent, index: number) {
  if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return
  event.preventDefault()
  const next = event.key === 'Home' ? 0 : event.key === 'End' ? 2 : (index + (event.key === 'ArrowRight' ? 1 : 2)) % 3
  dimension.value = next
  document.getElementById(`dimension-${next}`)?.focus()
}

const faqs = [
  { label: '不登录可以看什么？', content: '无需登录即可排出基础盘、查看四柱与日主五行。涉及专业细盘、运程与智能体分析时，再登录即可，本次输入会被保留。' },
  { label: '智能体会用到哪些资料？', content: '仅使用你主动填写的出生资料与提出的问题。它给出的是可核对的参考，而非结论；每一步的依据都会明确标注来源。' },
  { label: '我的命盘和问题会公开吗？', content: '默认完全私密。命盘、提问与反思记录只属于你，除非你主动选择分享到研究与反思版块，否则不会对外可见。' },
  { label: '必须做研究吗？使用是否收费？', content: '研究与反思是可选的进阶路径，不做也能正常使用。具体功能、价格与权益以正式上线说明为准。此处为静态示例，不计费。' },
]

const card = 'rounded-2xl border border-default bg-white shadow-[var(--dao-shadow-soft)]'
</script>

<template>
  <div>
    <!-- ============================ Hero ============================ -->
    <section id="top" class="relative overflow-hidden">
      <UContainer class="py-16">
        <div class="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div class="max-w-[720px]">
            <p class="flex items-center gap-2.5 text-[13px] font-semibold tracking-[0.14em] text-primary">
              <span class="h-px w-6 bg-primary/60" />八字排盘 · AI 智能体 · 人生反馈
            </p>
            <h1 class="mt-5 font-serif text-[44px] font-medium leading-[1.32] text-highlighted md:text-[54px]">
              从命盘出发，<br class="hidden md:block">在生活中验证。
            </h1>
          </div>
          <p class="max-w-[400px] text-[16px] leading-8 text-muted">
            排八字、问智能体，记录真实反馈。<br>不止得到分析，也能持续回看与修正。
          </p>
        </div>

        <div class="mt-12 grid gap-6 lg:grid-cols-[420px_1fr]">
          <!-- 命盘示例 · 唯一深绿焦点面板 -->
          <div class="relative flex flex-col gap-7 overflow-hidden rounded-2xl bg-[#0F1518] p-8 text-white shadow-[var(--dao-shadow-lift)]">
            <div class="flex items-center justify-between">
              <span class="font-serif text-[22px]">命盘示例</span>
              <span class="text-[11px] tracking-[0.24em] text-white/70">EXAMPLE</span>
            </div>
            <p class="text-[15px] text-white/85">下一份工作，我更看重什么？</p>
            <div class="grid grid-cols-4 border-y border-white/10 py-6">
              <div v-for="p in pillars" :key="p.label" class="flex flex-col items-center gap-2">
                <span class="text-[12px] text-white/70">{{ p.label }}</span>
                <span class="font-serif text-[34px] leading-tight">{{ p.gan }}</span>
                <span class="font-serif text-[34px] leading-tight">{{ p.zhi }}</span>
              </div>
            </div>
            <UButton color="neutral" variant="link" class="self-start px-0 text-white/90 hover:text-white" trailing-icon="i-lucide-arrow-right" @click="chart?.fillExample()">用这个四柱示例体验</UButton>
          </div>

          <HomeChart ref="chart" @explain="show" />
        </div>
      </UContainer>
    </section>

    <!-- ======================== 职业选择分析 ======================== -->
    <section id="agents">
      <UContainer class="grid gap-14 py-20 lg:grid-cols-[400px_1fr]">
        <div class="flex flex-col gap-6">
          <p class="flex items-center gap-2.5 text-[13px] font-semibold tracking-[0.14em] text-primary">
            <span class="h-px w-6 bg-primary/60" />八字智能体 · 职业选择分析
          </p>
          <h2 class="font-serif text-[34px] leading-[1.45] text-highlighted">考虑换工作，<br>先把值得比较的事看清楚。</h2>
          <p class="text-[16px] leading-7 text-muted">结合命盘与现实处境，梳理选择的条件。</p>
          <div class="mt-1 flex flex-col gap-3">
            <button
              v-for="(q, i) in questions"
              :key="i"
              type="button"
              class="flex items-center gap-3 rounded-xl border px-4 py-4 text-left transition-all"
              :aria-pressed="selectedQ === i"
              :class="selectedQ === i ? 'border-primary bg-white shadow-[var(--dao-shadow-soft)]' : 'border-transparent hover:bg-white'"
              @click="selectedQ = i"
            >
              <UIcon :name="q.icon" class="size-5" :class="selectedQ === i ? 'text-primary' : 'text-dimmed'" />
              <span class="text-[16px] leading-6" :class="selectedQ === i ? 'font-medium text-highlighted' : 'text-muted'">{{ q.text }}</span>
            </button>
          </div>
          <div class="mt-1 flex items-center gap-5">
            <UButton color="primary" size="lg" class="home-button home-action" trailing-icon="i-lucide-arrow-right" @click="boundary('提出我的问题')">我也有一个问题</UButton>
            <a href="#records" class="text-[15px] text-muted underline decoration-default underline-offset-4 transition-colors hover:text-highlighted">看看后来的记录</a>
          </div>
        </div>

        <div class="flex flex-col gap-6">
          <div :class="card" class="p-8">
            <div class="flex items-center gap-3">
              <UIcon name="i-lucide-message-square" class="size-[22px] text-highlighted" />
              <span class="text-[17px] font-medium text-highlighted">职业选择分析</span>
            </div>
            <p class="mt-5 font-serif text-[26px] leading-[1.5] text-highlighted">{{ questions[selectedQ]!.text }}</p>
            <div class="mt-6 rounded-xl border-l-2 border-primary bg-[var(--dao-color-soft)] px-5 py-4">
              <p class="text-[13px] font-medium text-dimmed">下一步可以做</p>
              <p class="mt-1 text-[16px] leading-7 text-highlighted">{{ questions[selectedQ]!.next }}</p>
            </div>
            <UButton color="neutral" variant="link" class="mt-5 px-0" trailing-icon="i-lucide-chevron-right" @click="show('职业选择分析', questions[selectedQ]!.text + '\n\n' + questions[selectedQ]!.next + '\n\n这是预置的条件整理示例，不运行模型，也不作命理判断。')">展开这次分析</UButton>
          </div>
          <div class="grid gap-6 sm:grid-cols-[280px_1fr]">
            <div :class="card" class="flex flex-col gap-4 p-6">
              <p class="font-serif text-[22px] text-highlighted">林先生的命盘</p>
              <div class="grid grid-cols-4">
                <div v-for="p in pillars" :key="p.label" class="flex flex-col items-center gap-1.5">
                  <span class="text-[11px] text-dimmed">{{ p.label }}</span>
                  <span class="font-serif text-[24px] text-highlighted">{{ p.gan }}</span>
                  <span class="font-serif text-[24px] text-highlighted">{{ p.zhi }}</span>
                </div>
              </div>
              <UButton color="neutral" variant="link" class="self-start px-0 text-[12px]" trailing-icon="i-lucide-chevron-right" @click="show('林先生的命盘资料', '教学四柱：庚午／己卯／甲子／己巳。此命盘用于演示，不来自当前表单输入，也不代表已核验的历法结果。')">核对命盘资料</UButton>
            </div>
            <div :class="card" class="flex flex-col gap-3 p-6">
              <p class="font-serif text-[22px] leading-[1.5] text-highlighted">比起职位名称，我更在意成长空间。</p>
              <p class="text-[15px] leading-7 text-muted">{{ journal[2][2] }}</p>
              <UButton color="neutral" variant="link" class="mt-auto self-start px-0" icon="i-lucide-file-plus" trailing-icon="i-lucide-chevron-right" @click="recordDetail()">阅读这次反馈</UButton>
            </div>
          </div>
        </div>
      </UContainer>
    </section>

    <!-- ======================== 换工作时间线 ======================== -->
    <section id="records">
      <UContainer class="py-20">
        <p class="flex items-center gap-2.5 text-[13px] font-semibold tracking-[0.14em] text-primary">
          <span class="h-px w-6 bg-primary/60" />林先生的换工作记录
        </p>
        <div class="mt-4 flex flex-wrap items-end justify-between gap-6">
          <h2 class="max-w-[720px] font-serif text-[36px] leading-[1.4] text-highlighted">有些答案，要在后来的经历里看清。</h2>
          <UButton color="neutral" variant="outline" class="home-button" trailing-icon="i-lucide-arrow-right" @click="boundary('查看我的档案')">查看我的档案</UButton>
        </div>
        <p class="mt-3 text-[16px] text-muted">留下当时的想法，用后来的经历回看。</p>

        <div class="mt-10 grid gap-8 lg:grid-cols-[200px_320px_1fr]">
          <ol class="flex flex-col gap-1">
            <li v-for="(s, i) in stages" :key="i" ><button type="button" class="flex w-full items-center gap-3 rounded-xl p-3 text-left transition-colors" :aria-pressed="stage === i" :class="stage === i ? 'bg-white shadow-[var(--dao-shadow-soft)]' : ''" @click="stage = i">
              <span class="flex size-9 items-center justify-center rounded-lg border" :class="stage === i ? 'border-primary text-primary' : 'border-default text-dimmed'">
                <UIcon :name="s.icon" class="size-[18px]" />
              </span>
              <span class="flex flex-col">
                <span class="text-[12px] text-dimmed">{{ s.tag }}</span>
                <span class="text-[16px]" :class="stage === i ? 'font-medium text-highlighted' : 'text-muted'">{{ s.name }}</span>
              </span>
            </button></li>
          </ol>
          <div :class="card" class="flex flex-col gap-5 p-6">
            <p class="text-[13px] text-dimmed">当时留下的问题</p>
            <p class="font-serif text-[23px] leading-[1.55] text-highlighted">“新机会薪资更高，但通勤更长，值得换吗？”</p>
            <p class="text-[15px] leading-7 text-muted">薪资更高，每天通勤可能增加 40 分钟，团队培养安排还不清楚。</p>
            <p class="mt-auto text-[14px] font-medium text-highlighted">林先生</p>
          </div>
          <div :class="card" class="flex flex-col gap-5 p-7">
            <div class="flex items-center justify-between text-[13px] text-dimmed"><span>{{ journal[stage]![0] }}</span><span>{{ stage + 1 }} / 4</span></div>
            <p class="font-serif text-[26px] leading-[1.5] text-highlighted">{{ journal[stage]![1] }}</p>
            <p class="text-[16px] leading-7 text-highlighted">{{ journal[stage]![2] }}</p>
            <div class="rounded-xl border-l-2 border-primary bg-[var(--dao-color-soft)] p-4">
              <p class="text-[12px] font-medium text-dimmed">回看时保留的区别</p>
              <p class="mt-1 text-[14px] leading-6 text-muted">{{ journal[stage]![3] }}</p>
            </div>
            <div class="flex flex-wrap gap-6">
              <UButton color="neutral" variant="link" class="px-0" icon="i-lucide-notebook-pen" trailing-icon="i-lucide-chevron-right" @click="evidence()">查看本例依据</UButton>
              <UButton color="neutral" variant="link" class="px-0" icon="i-lucide-file-plus" trailing-icon="i-lucide-chevron-right" @click="recordDetail()">阅读面试后的补充</UButton>
            </div>
          </div>
        </div>
      </UContainer>
    </section>

    <!-- ==================== 研究与反思 · 同题对照 ==================== -->
    <section id="research">
      <UContainer class="py-20">
        <p class="flex items-center gap-2.5 text-[13px] font-semibold tracking-[0.14em] text-primary">
          <span class="h-px w-6 bg-primary/60" />想深入时，再多看一层
        </p>
        <div class="mt-4 flex flex-wrap items-end justify-between gap-6">
          <h2 class="max-w-[720px] font-serif text-[36px] leading-[1.4] text-highlighted">比较不同判断，看清各自依据。</h2>
          <UButton color="neutral" variant="outline" class="home-button" trailing-icon="i-lucide-arrow-right" @click="boundary('研究与反思')">进入研究与反思</UButton>
        </div>
        <p class="mt-3 text-[16px] text-muted">把自己的理解与 AI 参考放在一起，核对各自依据。</p>

        <div class="mt-10 flex flex-wrap items-center justify-between gap-6">
          <div>
            <p class="text-[13px] text-dimmed">同一个问题</p>
            <p class="mt-1 font-serif text-[24px] text-highlighted">新机会，值得我换一份工作吗？</p>
          </div>
          <div class="flex gap-1 rounded-xl border border-default bg-white p-1 shadow-[var(--dao-shadow-soft)]">
            <button
              v-for="(d, i) in dimensions"
              :id="`dimension-${i}`"
              :key="d"
              type="button"
              class="h-11 rounded-lg px-5 text-[15px] font-medium transition-colors"
              :aria-pressed="dimension === i"
              :class="dimension === i ? 'home-action' : 'text-muted hover:text-highlighted'"
              @click="dimension = i"
              @keydown="dimensionKey($event, i)"
            >{{ d }}</button>
          </div>
        </div>

        <div class="mt-6 grid gap-6 lg:grid-cols-2">
          <article :class="card" class="flex flex-col gap-4 p-6">
            <div class="flex items-center gap-3">
              <span class="flex size-9 items-center justify-center rounded-lg bg-[var(--dao-color-soft)] text-muted"><UIcon name="i-lucide-user" class="size-[18px]" /></span>
              <span class="text-[15px] font-medium text-highlighted">我的理解</span>
            </div>
            <p class="font-serif text-[26px] leading-[1.5] text-highlighted">{{ comparison[dimension]!.own }}</p>
            <p class="text-[16px] leading-7 text-muted">{{ comparison[dimension]!.ownText }}</p>
            <details :key="dimension" class="home-details border-t border-default pt-4 text-sm"><summary>这份理解的背景</summary><p class="mt-3 leading-7 text-muted">{{ comparison[dimension]!.ownText }} 这里保留个人关注，不代表每个人的价值排序。</p></details>
          </article>
          <article :class="card" class="flex flex-col gap-4 p-6">
            <div class="flex items-center gap-3">
              <span class="flex size-9 items-center justify-center rounded-lg bg-[var(--dao-color-selection)] text-primary"><UIcon name="i-lucide-message-square" class="size-[18px]" /></span>
              <span class="text-[15px] font-medium text-highlighted">AI 参考</span>
            </div>
            <p class="font-serif text-[26px] leading-[1.5] text-highlighted">{{ comparison[dimension]!.ai }}</p>
            <p class="text-[16px] leading-7 text-muted">{{ comparison[dimension]!.aiText }}</p>
            <details :key="dimension" class="home-details border-t border-default pt-4 text-sm"><summary>这份参考的范围</summary><p class="mt-3 leading-7 text-muted">{{ comparison[dimension]!.aiText }} 这是固定对照示意，不展示命理推断，不运行模型。</p></details>
          </article>
        </div>

        <div :class="card" class="mt-6 flex flex-col gap-6 p-6 lg:flex-row lg:items-center lg:justify-between">
          <div class="max-w-[600px]">
            <p class="text-[13px] font-medium text-dimmed">放在一起看</p>
            <p class="mt-1 text-[16px] leading-7 text-highlighted">{{ comparison[dimension]!.common }}</p>
          </div>
          <UButton color="neutral" variant="outline" class="home-button" trailing-icon="i-lucide-chevron-down" @click="show('还有什么需要了解？', comparison[dimension]!.missing)">还有什么需要了解？</UButton>
        </div>
      </UContainer>
    </section>

    <!-- ============================ FAQ ============================ -->
    <section>
      <UContainer class="grid gap-16 py-20 lg:grid-cols-[360px_1fr]">
        <div class="flex flex-col gap-5">
          <h2 class="font-serif text-[36px] leading-[1.4] text-highlighted">开始之前，<br>你可能想知道。</h2>
          <p class="text-[16px] leading-7 text-muted">以盘为镜，不以盘定命。</p>
          <div class="mt-4 flex flex-col gap-3">
            <UButton color="neutral" variant="outline" class="home-button w-fit" trailing-icon="i-lucide-arrow-right" to="#top">回到排盘</UButton>
            <UButton color="neutral" variant="link" class="w-fit px-0" trailing-icon="i-lucide-arrow-right" @click="show('帮助与协议', '当前为设计预览，正式条款尚未生效。此页不发送表单资料、不调用 AI、不计费。正式服务的数据用途、保存期限及删除方式须以上线协议为准。')">查看帮助与协议</UButton>
          </div>
        </div>
        <div :class="card" class="px-6">
          <UAccordion :items="faqs" type="multiple" trailing-icon="i-lucide-plus" :ui="{ item: 'border-default', trigger: 'py-6 text-[19px] font-medium text-highlighted', content: 'text-[16px] leading-8 text-muted' }" />
        </div>
      </UContainer>
    </section>
  </div>
</template>


