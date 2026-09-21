# DaoOne 会员 Web 工作规范

适用本工程。它承载官网和个人空间；管理后台属于独立 `daoone-ui-admin-vue3`。先读本 README 及工程 `engineering/daoone-engineering/docs/design/README.md`，按本轮明确授权确定范围。用户最新确认优先于历史阶段安排。

## 官方结构与功能归档

沿用 Nuxt 4 的 app / server / shared 根结构。目录按职责存在，不为“完整”创建空目录。官方规则和下面的 DaoOne 项目约定分别看待。

- `app/pages/` 只放路由页面。相关页面放同一功能目录，首页用 `index.vue`，动态详情用 `[id].vue`。当前 `/workspace` 对应 `app/pages/workspace/index.vue`。
- 未来个人空间设置可组织为 `app/pages/workspace/settings/index.vue`、`security.vue` 等。只有需要父级设置容器时，才增加同级 `settings.vue` 并在其中使用 `<NuxtPage />`；不要复制父页内容给每个子页。不提前生成这些未授权页面。
- `app/layouts/default.vue` 服务官网，`app/layouts/workspace.vue` 服务个人空间。页面通过 `definePageMeta` 选择；布局不能承担业务查询和整页内容。
- `app/components/<功能>/` 放该功能的组件。如 `workspace/AccountMenu.vue`，Nuxt 默认目录前缀生成 `WorkspaceAccountMenu`。真正跨功能的基础组件再放共同位置；不为每个 UButton 重复包装一层。
- `app/composables/<功能>/` 放相关状态与交互逻辑。Nuxt 默认只扫描 composables 顶层；嵌套文件使用显式 import，或经有依据的顶层导出，不能假定自动发现。本页显式导入 `~/composables/workspace/useWorkspacePreview`。
- `app/assets/css/main.css` 负责公共入口；功能样式放 `app/assets/css/<功能>/index.css`，由对应布局或组件加载。可读格式维护，不堆叠压缩 CSS 或多段互相覆盖的临时补丁。主题用语义变量，优先复用；Nuxt UI 组件级公共配置位于 `app/app.config.ts`。
- `app/utils/` 放浏览器纯工具；`public/` 放无需构建处理的静态文件，`app/assets/` 放由构建处理的样式／图片／字体。
- `server/api/<领域>/` 为固定 BFF 入口；`server/utils/` 为会话、错误、上游协议适配；`server/middleware/` 为请求边界。
- `shared/types` 与 `shared/utils` 只放双端纯类型和工具，不能导入 app/server 或放密钥。
- `tests/` 放正式测试；设计截图、评审、临时预览验证脚本统一在现有 `docs/design`，不建第二套设计根目录。
- `.nuxt`、`.output`、node_modules 是生成或安装目录，不手动编辑。不得为引入模板覆盖锁文件、重建工程或批量删目录。

## 模板与工程边界

`frontend/nuxt-app` 为参考模板；按需引入其结构与组件组合，保留要求的许可证声明。主工程仍使用 package.json / 锁文件指定的 Nuxt、Nuxt UI、Tailwind、Node 和 npm，不能顺带迁入模板的 pnpm、TypeScript 版本、示例业务或宽泛 CORS 配置。

页面不绕开 `useApiFetch`、`useApi` 和服务端固定上游边界。真实登录、AI、支付、权限和数据持久化必须按已确认后端契约接入；禁止把演示 toast、静态内容或本地 useState 冒充业务完成。

## 设计与交互

1. 原型规定业务语义与返回关系；UI 可以重新设计布局和控件，不照抄说明框、调试按钮和重复关闭按钮。
2. 官网和个人空间共同遵循已确认 D5：墨绿 #123F3C、暖白 #FCFBF8、浅底 #F5F3EE、选中浅青绿 #DCECE8，白色用于内容卡片。公共品牌变量在 main.css，功能样式引用变量；不得用模板的鲜绿覆盖品牌。中文衬线标题、无衬线正文、克制动效保持一致；首页重阅读，个人空间重操作密度，通过表面、边界和留白区分层次。
3. 改一页前读取项目 `daoone-page-design`、frontend-design、UI Skills 及精准 UI Pro Max 检索，记录采用规则。本轮浏览器样板授权优先于旧“先全量绘制 Figma”的阶段限制。
4. 简单会员页可直接在 Nuxt UI 模板上设计并浏览器确认。Figma 用于复杂布局、视觉方向比较、共享设计规范或用户明确要求；不强制双份逐页维护，也不宣布永久不用 Figma。设计源和状态以当前页面记录标明。
5. 用户希望后续逐步补充 Skill；先维护本规范和现有技能引用，不未经需要安装大量插件或复制一套冲突的技能体系。
6. 菜单、弹窗、表单继承组件语义、键盘和焦点行为；图标按钮有名称。颜色之外保留文字／图标／位置线索。错误、空态和未保存状态按真实任务决定。
7. 动画用于解释交互和状态，支持减少动画。悬停、预览不能触发模型、计费或业务写入。功能查询按用户任务加载，不为每个视觉块建立独立 API。
8. 原型与教学页面明确标示；本机 8765 子页链接只用于当前视觉审查，部署和真实业务接入前必须替换，不当作正式公开路由或认证实现。

## 验证与记录

- 改动后运行适用的 ESLint、类型检查；目录移动后检查组件注册、显式导入和路由，不能只证明文件存在。
- UI 改动实际截图查看 PC1440/1366和手机390，并检查320/768/1024；弹层、导航、状态切换做定向操作；测试范围据实记录。
- 按项目页面技能执行两位独立 AI 评审，主代理修复有证据的问题；工具不可用时如实说明，不虚称专家全部通过。
- 构建／测试通过不代表视觉验收或真实业务联调。使用固定 Mock 时明确哪些任务／状态还未覆盖。
- 记录改动、来源、证据和下一步到 `docs/design` 的现有页面记录，待用户确认后再扩展其他 UI 页面。

## 官方依据

2026-09-13 定向核对：[Pages](https://nuxt.com/docs/4.x/directory-structure/app/pages)、[Components](https://nuxt.com/docs/4.x/directory-structure/app/components)、[Composables](https://nuxt.com/docs/4.x/directory-structure/app/composables)。这些说明文件路由、嵌套组件命名和 composables 扫描；具体 workspace 分组是本项目约定。
