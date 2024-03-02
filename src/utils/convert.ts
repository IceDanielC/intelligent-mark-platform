export function convertBytesToSize(bytes: number): string {
  const sizes = ['B', 'KB', 'MB'] // 定义单位的大小写
  if (bytes === 0) return '0 B'
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return (bytes / Math.pow(1024, i)).toFixed(1) + ' ' + sizes[i]
}
