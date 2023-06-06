import type { App } from 'vue'
import Scan from './scan.vue'

// 使用install方法，在app.use挂载
Scan.install = (app: App): void => {
  app.component(Scan.__name as string, Scan)
}

export default Scan
