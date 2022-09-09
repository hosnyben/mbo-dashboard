import { createRouter, createWebHistory } from 'vue-router'
import Board from '../views/Board.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'welcome',
      component: Board,
    },
    {
      path: '/partenaire/reservations',
      name: 'partner_calendar',
      component: Board,
    },
    {
      path: '/partenaire/reservations-urgentes',
      name: 'partner_calendar_urgent',
      component: Board,
    },
    {
      path: '/partenaire/reservations-a-confirmer',
      name: 'partner_calendar_confirm',
      component: Board,
    },
    {
      path: '/partenaire/reservations-confirme',
      name: 'partner_calendar_confirmed',
      component: Board,
    },
    {
      path: '/partenaire/occupations',
      name: 'partner_closing',
      component: Board,
    },
    {
      path: '/partenaire/occupations/nouvelle',
      name: 'partner_closing_new',
      component: Board,
    },
    {
      path: '/partenaire/occupations/modifier/:id',
      name: 'partner_closing_edit',
      component: Board,
    },
    {
      path: '/partenaire/statistiques',
      name: 'partner_stats',
      component: Board,
    },
    {
      path: '/partenaire/parametres',
      name: 'partner_settings',
      component: Board,
    },
    {
      path: "/login",
      name: "login",
      component: () => import('../views/Login.vue')
    }
  ]
})

router.beforeEach((to, from, next) => {
  const publicPages = ['/login'];
  const authRequired = !publicPages.includes(to.path);
  const loggedIn = localStorage.getItem('user');
  // trying to access a restricted page + not logged in
  // redirect to login page
  if (authRequired && !loggedIn) {
    next('/login');
  } else {
    next();
  }
});
export default router
