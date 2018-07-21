import DialogComponent from './components/dialogBox.vue'

const DialogObj = {}

DialogObj.install = function (Vue) {
  const DialogConstructor = Vue.extend(DialogComponent)
  const instance = new DialogConstructor()
  instance.$mount(document.createElement('div'))
  document.body.appendChild(instance.$el)
  Vue.prototype.showDialog = (msg, duration = 1500) => {
    instance.message = msg
    instance.visible = true
    setTimeout(() => { instance.visible = false }, duration)
  }
}
export default DialogObj