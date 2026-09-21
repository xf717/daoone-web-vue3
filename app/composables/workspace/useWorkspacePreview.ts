// 本页仅用于视觉确认，不读取或修改真实会员会话。
export function useWorkspacePreview() {
  const name = useState('workspace-preview-name', () => '林先生')
  const fresh = useState('workspace-preview-fresh', () => false)
  const signedOut = useState('workspace-preview-signed-out', () => false)
  const prototype = (path: string) => `http://127.0.0.1:8765/product-plan/page-by-page/${path}`
  return { name, fresh, signedOut, prototype }
}
