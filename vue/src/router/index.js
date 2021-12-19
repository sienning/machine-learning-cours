import Vue from 'vue'
import Router from 'vue-router'
import Pokemon from '@/components/Pokemon'
import Threejs from'@/components/Threejs'
import Puissance4 from'@/components/Puissance4'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Pokemon',
      component: Pokemon
    },
    {
      path: '/three/',
      name: 'Threejs',
      component: Threejs
    },
    {
      path: '/puissance/',
      name: 'Puissance4',
      component: Puissance4
    }
  ]
})
