export function useHomeDialog() {
  const dialog = useState('home-preview-dialog', () => ({ open: false, title: '', content: '' }))
  function show(title: string, content: string) { dialog.value = { open: true, title, content } }
  function boundary(title: string) { show(title, '此入口在完整产品中进入登录后的相应页面。本次为首页静态预览，该业务页尚未迁移；不会启动 AI、扣费或提交资料。') }
  return { dialog, show, boundary }
}
