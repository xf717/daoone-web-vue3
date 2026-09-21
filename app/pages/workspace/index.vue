<script setup lang="ts">
import { useWorkspacePreview } from '~/composables/workspace/useWorkspacePreview'
definePageMeta({ layout: 'workspace' })
useHead({ title: '我的空间 · 道一 DaoOne', bodyAttrs: { class: 'workspace-preview' } })
const { name, fresh, signedOut, prototype } = useWorkspacePreview()
const notifications = ref(false)
const questionOpen = ref(false)
const agentOpen = ref(false)
</script>

<template>
  <UDashboardPanel id="home" :ui="{ root: 'workspace-panel', body: 'p-0 gap-0' }">
    <template #header>
      <UDashboardNavbar :ui="{ root: 'workspace-navbar', left: 'gap-3' }">
        <template #left>
          <UDashboardSidebarCollapse class="hidden lg:flex" aria-label="折叠或展开导航" />
          <span class="breadcrumb">个人空间<span>/</span><strong>我的空间</strong></span>
        </template>
        <template #right>
          <span class="preview-tag">示例预览 · 子页为原型</span>
          <UTooltip text="消息与提醒">
            <UButton icon="i-lucide-bell" color="neutral" variant="ghost" aria-label="消息与提醒" class="notification-button" @click="notifications = true" />
          </UTooltip>
        </template>
      </UDashboardNavbar>
    </template>
    <template #body>
      <main id="workspace-content" class="space-content" tabindex="-1">
        <div v-if="signedOut" class="signed-out">
          <UIcon name="i-lucide-door-open" class="size-10 text-primary" />
          <h1>已退出预览</h1><p>这是一张个人空间视觉样板，未连接真实账户。</p>
          <UButton label="重新进入预览" size="xl" @click="signedOut = false" />
        </div>
        <template v-else>
          <header class="welcome">
            <div><p class="welcome-overline">从当下出发，慢慢看清。</p><h1>{{ name }}，{{ fresh ? '欢迎来到道一' : '欢迎回来' }}。</h1><p class="welcome-sub">{{ fresh ? '先排一张命盘，或者记下此刻关心的问题。' : '接着上次的思考，也给新的经历留一点位置。' }}</p></div>
            <div class="welcome-actions">
              <UButton :to="prototype('W30-problems/prototype.html?page=W30')" target="_blank" color="neutral" variant="outline" icon="i-lucide-plus" size="xl" label="记下问题" />
              <UButton :to="prototype('W10-chart/prototype.html')" target="_blank" icon="i-lucide-orbit" size="xl" label="新建排盘" />
            </div>
          </header>
          <div class="workspace-columns">
            <div class="main-column">
              <section aria-labelledby="continue-title">
                <div class="section-heading"><h2 id="continue-title">{{ fresh ? '从一个问题开始' : '接着上次继续' }}</h2><a :href="prototype('W30-problems/prototype.html')" target="_blank" rel="noopener">全部问题 <UIcon name="i-lucide-arrow-up-right" /></a></div>
                <article v-if="!fresh" class="current-question">
                  <div class="question-top"><span class="topic"><UIcon name="i-lucide-briefcase-business" /> 工作与成长</span><span class="small-status">已有新经历</span></div>
                  <h3>新机会，值得我换一份工作吗？</h3>
                  <p class="question-excerpt">薪资更高，通勤也更长。面试之后，我开始重新衡量成长机会与生活的分量。</p>
                  <div class="question-note"><span class="note-rule" /><div><small>最近补充 · 面试之后</small><p>“团队愿意给我更多空间，但我还想问清楚，带教和加班是怎样安排的。”</p></div></div>
                  <div class="question-bottom"><span><span class="mini-avatar">林</span>林先生的换工作记录 <span class="muted-dot">·</span> 教学示例</span><UButton label="继续梳理" trailing-icon="i-lucide-arrow-right" variant="ghost" @click="questionOpen = true" /></div>
                </article>
                <article v-else class="current-question fresh-question"><UIcon name="i-lucide-notebook-pen" class="size-9 text-primary" /><h3>不急着找答案，先把问题说清楚。</h3><p class="question-excerpt">你可以只记录一个问题，也可以结合命盘请 AI 帮你梳理。研究与方法对照，留给想深入的时候。</p><UButton :to="prototype('W30-problems/prototype.html?page=W30')" target="_blank" label="记录第一个问题" size="lg" /><button class="sample-link" @click="questionOpen = true">先看看一个示例</button></article>
              </section>
              <section class="agent-section" aria-labelledby="agent-title">
                <div class="section-heading"><h2 id="agent-title">换个角度，想一想</h2><a :href="prototype('W20-agents/prototype.html')" target="_blank" rel="noopener">全部智能体 <UIcon name="i-lucide-arrow-up-right" /></a></div>
                <button class="agent-card" @click="agentOpen = true">
                  <span class="agent-art" aria-hidden="true"><span /><span /><span /><UIcon name="i-lucide-sparkles" /></span>
                  <span class="agent-copy"><span class="agent-name">真实问题分析 <small>示例应用</small></span><span class="agent-description">把命盘、现实处境和你的疑问放在一起，<br class="desktop-break">整理值得关注的条件与下一步。</span><span class="agent-meta">先核对资料，再决定是否分析</span></span>
                  <span class="agent-arrow"><UIcon name="i-lucide-arrow-up-right" /></span>
                </button>
              </section>
              <section aria-labelledby="recent-title" class="recent-section">
                <div class="section-heading"><h2 id="recent-title">{{ fresh ? '慢慢积累自己的记录' : '最近留下的记录' }}</h2><span class="section-hint">{{ fresh ? '你的记录默认属于自己' : '教学示例' }}</span></div>
                <p v-if="fresh" class="empty-records">记录会出现在这里。每次新的经历，都可以单独补充，不必改写过去的想法。</p>
                <template v-else>
                  <a class="record-row" :href="prototype('W32-question/prototype.html?tab=events')" target="_blank" rel="noopener"><span class="record-icon"><UIcon name="i-lucide-sprout" /></span><span class="record-copy"><strong>面试之后，我补充了这些信息</strong><small>经历反馈 · 林先生考虑换工作</small></span><time>9 月 12 日</time><UIcon name="i-lucide-chevron-right" class="record-chevron" /></a>
                  <a class="record-row" :href="prototype('W32-question/prototype.html?tab=comparison')" target="_blank" rel="noopener"><span class="record-icon"><UIcon name="i-lucide-git-compare-arrows" /></span><span class="record-copy"><strong>把自己的判断与分析参考放在一起</strong><small>方法对照 · 继续整理依据</small></span><time>9 月 10 日</time><UIcon name="i-lucide-chevron-right" class="record-chevron" /></a>
                </template>
              </section>
            </div>
            <aside class="side-column">
              <section class="today-section" aria-labelledby="today-title"><div class="section-heading"><h2 id="today-title">留意一下</h2><UIcon name="i-lucide-sun" class="size-5" /></div><div class="quiet-status"><span class="quiet-check"><UIcon name="i-lucide-check" /></span><strong>暂时没有需要处理的事</strong><p>等待的分析、到期的反馈，<br>会在这里提醒你。</p></div><UButton label="查看实验与任务" color="neutral" variant="link" :to="prototype('W24-history/prototype.html')" target="_blank" trailing-icon="i-lucide-arrow-up-right" /></section>
              <section class="chart-section" aria-labelledby="chart-title"><div class="section-heading"><h2 id="chart-title">{{ fresh ? '我的第一张命盘' : '最近打开的命盘' }}</h2><UIcon name="i-lucide-orbit" class="size-5" /></div>
                <template v-if="!fresh"><div class="chart-person"><strong>林先生</strong><small>教学示例 · 基础盘</small></div><div class="mini-chart" aria-label="教学示例四柱，非实时计算"><div v-for="(pillar, index) in ['庚午', '己卯', '甲子', '己巳']" :key="pillar"><small>{{ ['年柱', '月柱', '日柱', '时柱'][index] }}</small><span>{{ pillar[0] }}</span><span>{{ pillar[1] }}</span></div></div><a class="chart-link" :href="prototype('W11-result/prototype.html')" target="_blank" rel="noopener">打开命盘 <UIcon name="i-lucide-arrow-up-right" /></a></template>
                <div v-else class="empty-chart"><p>还没有保存的命盘。<br>从准确的出生资料开始。</p><UButton label="填写出生资料" color="neutral" variant="outline" :to="prototype('W10-chart/prototype.html')" target="_blank" /></div>
              </section>
              <a class="learning-link" :href="prototype('learning/prototype.html')" target="_blank" rel="noopener"><UIcon name="i-lucide-book-open" /><span><strong>读一份案例，留一点思考。</strong><small>在别人的经历里，练习自己的理解。</small></span><UIcon name="i-lucide-arrow-up-right" /></a>
            </aside>
          </div>
          <footer class="workspace-foot"><span>由术入理，借象明道。</span><small>当前为示例预览；子页在新标签打开现有交互原型。</small></footer>
        </template>
      </main>
      <UModal v-model:open="questionOpen" title="新机会，值得我换一份工作吗？" description="林先生的换工作记录 · 固定教学示例" :ui="{ content: 'max-w-2xl' }">
        <template #body><div class="question-detail"><h3>当时的想法</h3><p>我期待更大的成长空间，但不想用长期加班和通勤交换全部生活。</p><h3>面试后的新信息</h3><p>新岗位的职责更宽，带教安排仍不清楚。通勤单程比现在多约半小时。</p><h3>接下来想问清楚的事</h3><ul><li>前三个月的目标和支持是什么？</li><li>日常加班频率，以及团队如何分配任务？</li></ul><p class="detail-note">新经历单独记录，保留当时判断。是否继续研究，由你决定。</p></div></template>
        <template #footer><UButton label="打开完整问题档案" :to="prototype('W32-question/prototype.html')" target="_blank" trailing-icon="i-lucide-arrow-up-right" /><span class="text-xs text-muted">进入已有交互原型</span></template>
      </UModal>
      <UModal v-model:open="agentOpen" title="真实问题分析" description="示例应用 · 帮助整理条件与可观察事项">
        <template #body><div class="question-detail"><p>带着命盘和一个真实问题开始。分析前，你可以核对使用的资料与消费说明。</p><h3>你会看到什么</h3><ul><li>把已知事实与分析解释分开。</li><li>了解判断需要哪些条件才能成立。</li><li>整理可以进一步了解、观察和行动的事。</li></ul><p class="detail-note">查看应用不会运行 AI 或扣积分；研究和方法对照不是必经步骤。</p></div></template>
        <template #footer><UButton label="选择资料与问题" :to="prototype('W22-ai/prototype.html')" target="_blank" trailing-icon="i-lucide-arrow-up-right" /><span class="text-xs text-muted">进入已有交互原型</span></template>
      </UModal>
      <USlideover v-model:open="notifications" title="消息与提醒" description="当前为教学账户预览">
        <template #body><div class="notification-empty"><UIcon name="i-lucide-bell" class="size-9" /><h3>暂时没有新提醒</h3><p>分析完成、待反馈事项和账户消息会出现在这里。</p><UButton label="打开消息中心原型" color="neutral" variant="outline" :to="prototype('W40-account/prototype.html?page=W41')" target="_blank" /></div></template>
      </USlideover>
    </template>
  </UDashboardPanel>
</template>
