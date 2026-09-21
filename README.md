# DaoOne Web

基于 Nuxt 4 官方目录的会员 Web 基础工程。Nuxt UI 提供控件，Tailwind 提供样式，Nitro server 承担轻量 BFF。Java 仍是业务、权限与持久数据的权威来源。

## 固定版本

| 依赖 | 版本 |
| --- | --- |
| Nuxt | 4.5.2 |
| Nuxt UI | 4.11.0 |
| Tailwind CSS | 4.3.3 |
| Vue / Vue Router | 3.5.42 / 5.3.1 |
| TypeScript | 5.9.3 |

Nuxt UI 4.11.0 的 Kit/Schema 依赖为 ^4.5.2，Tailwind/Vite 插件依赖为 ^4.3.3。由 @nuxt/ui 注册 Tailwind 集成，不重复安装旧 Nuxt Tailwind 模块或再注册 Tailwind Vite 插件。升级必须重新检查锁文件、类型、测试和构建。

使用 Node 24.19.0（.nvmrc）和 npm 11.19.1（packageManager）。本机 npm 10.9.3 在解析新增依赖时出现 edgesOut 内部错误，因此 CI 和容器同步固定 npm 11.19.1。Nuxt 允许的 Node 范围为 ^22.19.0 || ^24.11.0 || >=26.0.0，原系统 Node 22.18.0 不符合要求。.npmrc 启用 engine-strict，不通过关闭检查或 --force 绕过。

## 开发

```sh
npm ci
npm run dev
```

按需复制 .env.example 为 .env（Windows：Copy-Item .env.example .env）。不连接后端也能打开首页和进程健康检查；未配置的业务服务明确失败。首页是工程占位，不代表已批准的正式产品设计。

## 项目约定

新增页面或组件前阅读 [AGENTS.md](./AGENTS.md)，遵循 Nuxt 4 官方目录与功能分组，嵌套 composables 显式导入。个人空间组件位于 `app/components/workspace/`，样式位于 `app/assets/css/workspace/`。

## 目录职责

- app/pages：路由和页面组合，按领域分类。
- app/components：复用组件，需要时按领域分类；不重复封装所有 Nuxt UI 控件。
- app/composables：页面查询、主动请求及可复用交互。
- app/layouts：应用外壳。
- app/assets/css、app/app.config.ts：Tailwind、品牌令牌和 Nuxt UI 主题。浅色、系统字体，Lucide 图标本地打包，不依赖远程字体或图标 API。
- app/utils：请求路径等浏览器辅助函数。
- server/api：按领域分组的 HTTP 入口。
- server/utils：固定上游请求、会话、错误与协议适配。
- server/middleware：请求标识与写请求来源校验。
- shared/types、shared/utils：双端纯类型和工具，不放密钥、Vue 状态或环境专属逻辑。
- tests：请求边界与后端协议测试。

不创建空的 features、workflows、services、layers。嵌套 composables/utils 不假设自动扫描，使用显式导入。页面不能导入 server，shared 不能反向依赖 app/server。

## 请求约定

页面查询用 useApiFetch<T>，工作台可传 lazy: true，各区块分别处理 pending、empty、error、retry。点击提交使用 useApi()。默认不自动重试，避免写操作重复。SSR 查询使用 Nuxt payload 复用，不在 setup 中再调用同一份 $fetch。

浏览器请求只接受 /api/... 固定路径，query 单独传入。useApi 支持 AbortSignal；使用者清理轮询和订阅。当前不增加 Pinia 或第二套缓存，有实际需求再引入。

服务端使用 backendRequest(event, fixedPath, schema, options)。默认要求会话，确认的公开接口才能设置 authenticated: false。保留配置中的 App API 前缀，禁止上游重定向、自动重试和用户控制 URL。校验 Java 的 code/msg/data 后解包，并用 Zod 检查数据。

H3 错误 data 结构为 code/message/requestId；前端通过 getApiError(error) 提取。默认不展示上游原始错误，后续按确认的业务错误码映射文案。通用 JSON 客户端不用于文件或 SSE；这些接口接入时单独实现流式转发、取消和超时。

## 认证边界

useMemberSession 提供 H3 加密签名 Cookie、HttpOnly、生产 Secure、SameSite=Lax、禁用 Header 会话注入，默认有效期 24 小时。密钥至少 32 字符，各实例一致。这是 Cookie 中的加密会话，不是 Redis 会话；不放个人资料、大对象和草稿。

真实登录、登出、刷新令牌和账户接口尚未接入，没有假登录成功或空守卫。接入时核对 Member 契约、令牌有效期、注销撤销和并发刷新；多实例旋转 refresh token 不能只靠进程内 Promise 协调。

写请求 Origin 与 NUXT_PUBLIC_ORIGIN 精确匹配，生产不信任外部 Forwarded Host。浏览器事件中执行 mutation，不在 SSR 渲染中写入。以后接入外部回调需要独立签名校验，不能全局关闭来源校验。

## 检查与部署

```sh
npm run check
npm run build
npm start
```

check 包括 ESLint、Nuxt 类型检查和 Vitest。CI 执行相同检查与构建。本工程使用 Node Server，不提供静态 generate 命令，避免部署时丢失 BFF。生产由部署系统注入环境变量，npm start 不自动读取 .env。

生产进程启动后可以运行 npm run test:smoke。默认地址为 http://localhost:3000，通过 SMOKE_BASE_URL 可覆盖，且必须与 NUXT_PUBLIC_ORIGIN 一致。该检查只访问首页、404 和健康接口，验证被来源校验拒绝的请求也带追踪 ID。

/api/health 仅检查 Nuxt 存活，不证明 Java、数据库或认证就绪。响应带 X-Request-ID，后端请求透传相同 ID。未接入外部监控服务；未来上报禁止记录令牌、Cookie 或完整个人资料。

附带 Dockerfile 和 deploy/nginx.conf.example；Nuxt 与 BFF 同一制品部署。/workspace/** 预设客户端渲染且不缓存；新增私人路由应同步配置缓存和渲染规则。首页默认 SSR，不等待业务接口。

上线前检查 HTTPS、公开 origin、会话密钥、后端地址、租户、深层路由刷新和错误恢复。认证、支付和任务恢复以真实后端联调为验收依据。Docker、Nginx 配置是部署起点，需要在目标环境验证。

参考：[Nuxt 官方目录](https://nuxt.com/docs/4.x/directory-structure)、[Nuxt UI 安装](https://ui.nuxt.com/docs/getting-started/installation/nuxt)。

## 本轮验证记录（2026-09-07）

- Node 24.19.0 + npm 11.19.1 独立运行时；未修改系统默认 Node/npm。
- npm run check：ESLint、Nuxt 类型检查、25 项 Vitest 测试通过。
- npm run build：Nuxt 4.5.2 + Nuxt UI 4.11.0 + Tailwind 4.3.3 生产构建通过。
- npm ci --dry-run --ignore-scripts：锁文件一致性检查通过；这不是 Docker/Linux 实际安装验收。
- 生产进程冒烟：首页 200、缺失页面 404、健康检查、no-store、请求 ID、跨来源与缺少来源写请求拒绝、同来源边界通过。
- 浏览器：桌面首页、390px 移动首页、404 按钮返回首页通过。
- 构建存在第三方依赖 exports 弃用提示与 Vite 插件耗时提示，没有隐藏或关闭这些提示。
- 未执行 Docker 构建、Nginx 部署和真实 Java/Member 联调。上述配置仍需在目标部署环境验证。

## 个人空间视觉样板（2026-09-13）

启动后访问 `/workspace`。样板按需采用 Nuxt UI 官方 Dashboard 的侧栏与菜单组合，使用固定教学数据，未连接真实会员接口。原官网布局独立保留。

- 侧栏折叠、账户菜单、资料预览修改、消息侧栏、问题与应用速览可操作。
- 本页不修改真实会话；账户菜单的退出只展示预览退出状态。
- 子页暂时在新标签打开 `http://127.0.0.1:8765` 的已有设计原型，需在 `engineering/daoone-engineering/docs/design` 启动相应本地 HTTP 服务。
- 该演示状态和 localhost 链接必须在真实业务接入前替换；不是正式登录后的受保护页面实现。
- 模板版权声明：`LICENSE.nuxt-ui-template`。设计和验证记录在既有 `docs/design/product-plan/page-by-page/W04-home/当前方案.md`。
