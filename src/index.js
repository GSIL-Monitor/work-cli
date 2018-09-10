import dva from 'dva'
import router from './router'
import models from './models'
// 1. Initialize
const app = dva()
// 2. Plugins
// app.use({});

// 3. Model
if (Object.prototype.toString.call(models) === '[object Array]') {
  models.forEach(model => {
    app.model(model)
  })
} else {
  throw new Error('models must be array')
}

// 4. Router
app.router(router)

// 5. Start
app.start('#root')
