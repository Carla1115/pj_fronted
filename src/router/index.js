import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import JuegosView from '../views/JuegosView.vue'
import AddJuegoView from '../views/AddJuegoView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', component: LoginView },
    { path: '/juegos', component: JuegosView },
    { path: '/nuevo', component: AddJuegoView },
    { path: '/subir-imagen', component: () => import('../views/AddImageView.vue') },
  ],
})

router.beforeEach((to, from, next) => {
  const isAdmin = localStorage.getItem('isAdmin') === 'true'

  if (to.path === '/nuevo' && !isAdmin) {
    next('/juegos') // 🔒 si no es admin, redirige al panel de juegos
  } else {
    next()
  }
})

export default router
