<script setup lang="ts">
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

const faqs = [
  { label: '不登录可以看什么？', content: '无需登录即可排出基础盘、查看四柱与日主五行。涉及专业细盘、运程与智能体分析时，再登录即可，本次输入会被保留。' },
  { label: '智能体会用到哪些资料？', content: '仅使用你主动填写的出生资料与提出的问题。它给出的是可核对的参考，而非结论；每一步的依据都会明确标注来源。' },
  { label: '我的命盘和问题会公开吗？', content: '默认完全私密。命盘、提问与反思记录只属于你，除非你主动选择分享到研究与反思版块，否则不会对外可见。' },
  { label: '必须做研究吗？使用是否收费？', content: '研究与反思是可选的进阶路径，不做也能正常使用。基础排盘与查看永久免费，专业功能提供按需的套餐与权益。' },
]

const card = 'rounded-2xl border border-default bg-white shadow-[var(--dao-shadow-soft)]'
</script>

<template>
  <div>
    <!-- ============================ Hero ============================ -->
    <section class="relative overflow-hidden">
      <div class="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(70%_55%_at_15%_-5%,rgba(18,63,60,0.06),transparent_60%)]" />
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
          <div class="relative flex flex-col gap-7 overflow-hidden rounded-2xl bg-[var(--color-brand-950)] p-8 text-white shadow-[var(--dao-shadow-lift)]">
            <span class="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--color-brand-400)]/70 to-transparent" />
            <div class="flex items-center justify-between">
              <span class="font-serif text-[22px]">命盘示例</span>
              <span class="text-[11px] tracking-[0.24em] text-white/40">EXAMPLE</span>
            </div>
            <p class="text-[15px] text-white/85">下一份工作，我更看重什么？</p>
            <div class="grid grid-cols-4 border-y border-white/10 py-6">
              <div v-for="p in pillars" :key="p.label" class="flex flex-col items-center gap-2">
                <span class="text-[12px] text-white/45">{{ p.label }}</span>
                <span class="font-serif text-[34px] leading-tight">{{ p.gan }}</span>
                <span class="font-serif text-[34px] leading-tight">{{ p.zhi }}</span>
              </div>
            </div>
            <UButton color="neutral" variant="link" class="self-start px-0 text-white/90 hover:text-white" trailing-icon="i-lucide-arrow-right">用这个四柱示例体验</UButton>
          </div>

          <!-- 八字排盘表单 -->
          <div :class="card" class="flex flex-col gap-6 p-8">
            <h2 class="font-serif text-[26px] text-highlighted">八字排盘</h2>
            <div class="grid gap-4 sm:grid-cols-2">
              <UFormField label="输入方式"><UInput model-value="公历" class="w-full" trailing-icon="i-lucide-chevron-down" /></UFormField>
              <UFormField label="排盘性别"><UInput model-value="男" class="w-full" trailing-icon="i-lucide-chevron-down" /></UFormField>
              <UFormField label="出生日期 · 公历"><UInput model-value="1992-06-18" class="w-full" /></UFormField>
              <UFormField label="出生时间 · 24h"><UInput placeholder="--:--" class="w-full" trailing-icon="i-lucide-clock" /></UFormField>
            </div>
            <UFormField label="出生地点"><UInput placeholder="省 / 市 / 区" class="w-full" /></UFormField>
            <UButton color="neutral" variant="link" class="self-start px-0" icon="i-lucide-sliders-horizontal" trailing-icon="i-lucide-chevron-down">更多设置：昵称、真太阳时与时区</UButton>
            <UButton color="primary" size="xl" block trailing-icon="i-lucide-arrow-right">生成基础盘</UButton>
            <p class="text-center text-[13px] text-dimmed">无需登录即可看基础盘；查看更多信息时再登录。</p>
          </div>
        </div>
      </UContainer>
    </section>

    <!-- ======================== 基础盘结果 ======================== -->
    <section>
      <UContainer class="py-16">
        <div :class="card" class="p-8 lg:p-10">
          <div class="flex flex-wrap items-center justify-between gap-4">
            <h2 class="font-serif text-[26px] text-highlighted">本次资料 · 基础盘</h2>
            <UButton color="neutral" variant="outline">修改资料</UButton>
          </div>
          <p class="mt-3 text-[15px] text-muted">公历 1992-06-18 09:00 · 男 · 教学地点</p>

          <div class="mt-5 flex items-start gap-2.5 rounded-xl bg-[var(--dao-color-soft)] px-4 py-3">
            <UIcon name="i-lucide-notebook-pen" class="mt-0.5 size-[17px] shrink-0 text-dimmed" />
            <p class="text-[14px] leading-6 text-muted">原型尚未接入历法算法。以下为固定教学盘，非根据你的出生资料计算；资料已保留供详情核对。</p>
          </div>

          <div class="mt-8 grid gap-10 lg:grid-cols-2">
            <div class="grid grid-cols-4 overflow-hidden rounded-xl border border-default">
              <div v-for="(p, i) in pillars" :key="p.label" class="flex flex-col items-center gap-3 py-8" :class="i > 0 ? 'border-l border-default' : ''">
                <span class="text-[13px] text-dimmed">{{ p.label }}</span>
                <span class="font-serif text-[34px] text-highlighted">{{ p.gan }}</span>
                <span class="font-serif text-[34px] text-highlighted">{{ p.zhi }}</span>
              </div>
            </div>
            <div class="flex flex-col items-start gap-5">
              <p class="font-serif text-[22px] text-highlighted">日干：甲 · 五行属性 <span class="text-primary">木</span></p>
              <p class="text-[15px] leading-7 text-muted">基础页不展示专业细盘、运程和分析。</p>
              <UButton color="neutral" variant="outline" trailing-icon="i-lucide-chevron-right">这些信息怎么看？</UButton>
            </div>
          </div>

          <div class="mt-8 flex flex-wrap items-center gap-5 border-t border-default pt-6">
            <UButton color="primary" size="lg" trailing-icon="i-lucide-arrow-right">查看完整命盘</UButton>
            <p class="text-[14px] text-muted">登录后继续查看专业细盘，保留本次输入。</p>
          </div>
        </div>
      </UContainer>
    </section>

    <!-- ======================== 职业选择分析 ======================== -->
    <section>
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
              :class="selectedQ === i ? 'border-default bg-white shadow-[var(--dao-shadow-soft)]' : 'border-transparent bg-[var(--dao-color-selection)]/40 hover:bg-white'"
              @click="selectedQ = i"
            >
              <UIcon :name="q.icon" class="size-5" :class="selectedQ === i ? 'text-primary' : 'text-dimmed'" />
              <span class="text-[16px] leading-6" :class="selectedQ === i ? 'font-medium text-highlighted' : 'text-muted'">{{ q.text }}</span>
            </button>
          </div>
          <div class="mt-1 flex items-center gap-5">
            <UButton color="primary" size="lg" trailing-icon="i-lucide-arrow-right">我也有一个问题</UButton>
            <a href="#records" class="text-[15px] text-muted underline decoration-default underline-offset-4 transition-colors hover:text-highlighted">看看后来的记录</a>
          </div>
        </div>

        <div class="flex flex-col gap-6">
          <div :class="card" class="p-8">
            <div class="flex items-center gap-3">
              <UIcon name="i-lucide-message-square" class="size-[22px] text-highlighted" />
              <span class="text-[17px] font-medium text-highlighted">职业选择分析</span>
            </div>
            <p class="mt-5 font-serif text-[26px] leading-[1.5] text-highlighted">{{ questions[selectedQ].text }}</p>
            <div class="mt-6 rounded-xl border-l-2 border-primary bg-[var(--dao-color-soft)] px-5 py-4">
              <p class="text-[13px] font-medium text-dimmed">下一步可以做</p>
              <p class="mt-1 text-[16px] leading-7 text-highlighted">{{ questions[selectedQ].next }}</p>
            </div>
            <UButton color="neutral" variant="link" class="mt-5 px-0" trailing-icon="i-lucide-chevron-right">展开这次分析</UButton>
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
              <UButton color="neutral" variant="link" class="self-start px-0 text-[12px]" trailing-icon="i-lucide-chevron-right">核对命盘资料</UButton>
            </div>
            <div :class="card" class="flex flex-col gap-3 p-6">
              <p class="font-serif text-[22px] leading-[1.5] text-highlighted">比起职位名称，我更在意成长空间。</p>
              <p class="text-[15px] leading-7 text-muted">面试后了解到新团队有导师安排，但每天通勤会增加 40 分钟。先确认弹性办公安排，再与当前岗位比较。</p>
              <UButton color="neutral" variant="link" class="mt-auto self-start px-0" icon="i-lucide-file-plus" trailing-icon="i-lucide-chevron-right">阅读这次反馈</UButton>
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
          <UButton color="neutral" variant="outline" trailing-icon="i-lucide-arrow-right">查看我的档案</UButton>
        </div>
        <p class="mt-3 text-[16px] text-muted">留下当时的想法，用后来的经历回看。</p>

        <div class="mt-10 grid gap-8 lg:grid-cols-[200px_320px_1fr]">
          <ol class="flex flex-col gap-1">
            <li v-for="(s, i) in stages" :key="i" class="flex items-center gap-3 rounded-xl p-3 transition-colors" :class="i === 2 ? 'bg-white shadow-[var(--dao-shadow-soft)]' : ''">
              <span class="flex size-9 items-center justify-center rounded-lg border" :class="i === 2 ? 'border-primary text-primary' : 'border-default text-dimmed'">
                <UIcon :name="s.icon" class="size-[18px]" />
              </span>
              <span class="flex flex-col">
                <span class="text-[12px] text-dimmed">{{ s.tag }}</span>
                <span class="text-[16px]" :class="i === 2 ? 'font-medium text-highlighted' : 'text-muted'">{{ s.name }}</span>
              </span>
            </li>
          </ol>
          <div :class="card" class="flex flex-col gap-5 p-6">
            <p class="text-[13px] text-dimmed">当时留下的问题</p>
            <p class="font-serif text-[23px] leading-[1.55] text-highlighted">“新机会薪资更高，但通勤更长，值得换吗？”</p>
            <p class="text-[15px] leading-7 text-muted">薪资更高，每天通勤可能增加 40 分钟，团队培养安排还不清楚。</p>
            <p class="mt-auto text-[14px] font-medium text-highlighted">林先生</p>
          </div>
          <div :class="card" class="flex flex-col gap-5 p-7">
            <div class="flex items-center justify-between text-[13px] text-dimmed"><span>后来 · 面试后的补充</span><span>3 / 4</span></div>
            <p class="font-serif text-[26px] leading-[1.5] text-highlighted">新的信息，留在新的记录里。</p>
            <p class="text-[16px] leading-7 text-highlighted">面试后了解到新团队有导师安排，但每天通勤会增加 40 分钟。先确认弹性办公安排，再与当前岗位比较。</p>
            <div class="rounded-xl border-l-2 border-primary bg-[var(--dao-color-soft)] p-4">
              <p class="text-[12px] font-medium text-dimmed">回看时保留的区别</p>
              <p class="mt-1 text-[14px] leading-6 text-muted">这是后来补充的内容，不作为最初分析时已经知道的事实。</p>
            </div>
            <div class="flex flex-wrap gap-6">
              <UButton color="neutral" variant="link" class="px-0" icon="i-lucide-notebook-pen" trailing-icon="i-lucide-chevron-right">查看本例依据</UButton>
              <UButton color="neutral" variant="link" class="px-0" icon="i-lucide-file-plus" trailing-icon="i-lucide-chevron-right">阅读面试后的补充</UButton>
            </div>
          </div>
        </div>
      </UContainer>
    </section>

    <!-- ==================== 研究与反思 · 同题对照 ==================== -->
    <section>
      <UContainer class="py-20">
        <p class="flex items-center gap-2.5 text-[13px] font-semibold tracking-[0.14em] text-primary">
          <span class="h-px w-6 bg-primary/60" />想深入时，再多看一层
        </p>
        <div class="mt-4 flex flex-wrap items-end justify-between gap-6">
          <h2 class="max-w-[720px] font-serif text-[36px] leading-[1.4] text-highlighted">比较不同判断，看清各自依据。</h2>
          <UButton color="neutral" variant="outline" trailing-icon="i-lucide-arrow-right">进入研究与反思</UButton>
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
              :key="d"
              type="button"
              class="h-11 rounded-lg px-5 text-[15px] font-medium transition-colors"
              :class="dimension === i ? 'bg-primary text-inverted' : 'text-muted hover:text-highlighted'"
              @click="dimension = i"
            >{{ d }}</button>
          </div>
        </div>

        <div class="mt-6 grid gap-6 lg:grid-cols-2">
          <article :class="card" class="flex flex-col gap-4 p-6">
            <div class="flex items-center gap-3">
              <span class="flex size-9 items-center justify-center rounded-lg bg-[var(--dao-color-soft)] text-muted"><UIcon name="i-lucide-user" class="size-[18px]" /></span>
              <span class="text-[15px] font-medium text-highlighted">我的理解</span>
            </div>
            <p class="font-serif text-[26px] leading-[1.5] text-highlighted">希望成长，不只是换个环境。</p>
            <p class="text-[16px] leading-7 text-muted">想承担更有挑战的职责，也希望遇到问题时有人可以讨论。</p>
            <button type="button" class="mt-1 flex items-center justify-between border-t border-default pt-4 text-[14px] font-medium text-highlighted transition-colors hover:text-primary">这份理解的背景 <UIcon name="i-lucide-plus" class="size-[18px] text-dimmed" /></button>
          </article>
          <article :class="card" class="flex flex-col gap-4 p-6">
            <div class="flex items-center gap-3">
              <span class="flex size-9 items-center justify-center rounded-lg bg-[var(--dao-color-selection)] text-primary"><UIcon name="i-lucide-message-square" class="size-[18px]" /></span>
              <span class="text-[15px] font-medium text-highlighted">AI 参考</span>
            </div>
            <p class="font-serif text-[26px] leading-[1.5] text-highlighted">先了解，成长如何发生。</p>
            <p class="text-[16px] leading-7 text-muted">把岗位介绍里的“成长空间”，落实到具体任务、培养安排与支持方式。</p>
            <button type="button" class="mt-1 flex items-center justify-between border-t border-default pt-4 text-[14px] font-medium text-highlighted transition-colors hover:text-primary">这份参考的范围 <UIcon name="i-lucide-plus" class="size-[18px] text-dimmed" /></button>
          </article>
        </div>

        <div :class="card" class="mt-6 flex flex-col gap-6 p-6 lg:flex-row lg:items-center lg:justify-between">
          <div class="max-w-[600px]">
            <p class="text-[13px] font-medium text-dimmed">放在一起看</p>
            <p class="mt-1 text-[16px] leading-7 text-highlighted">都在意成长。个人期待与岗位承诺之间，还需要具体事实。</p>
          </div>
          <UButton color="neutral" variant="outline" trailing-icon="i-lucide-chevron-down">还有什么需要了解？</UButton>
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
            <UButton color="neutral" variant="outline" class="w-fit" trailing-icon="i-lucide-arrow-right">回到排盘</UButton>
            <UButton color="neutral" variant="link" class="w-fit px-0" trailing-icon="i-lucide-arrow-right">查看帮助与协议</UButton>
          </div>
        </div>
        <div :class="card" class="px-6">
          <UAccordion :items="faqs" :default-value="'0'" :ui="{ item: 'border-default', trigger: 'py-6 text-[19px] font-medium text-highlighted', content: 'text-[16px] leading-8 text-muted' }" />
        </div>
      </UContainer>
    </section>
  </div>
</template>
