import { createWebHistory, createRouter } from 'vue-router'
import routes from 'virtual:generated-pages'

//import Home from './views/Home.vue'
//import Explore from './views/Explore.vue'
//import Docs from './views/Docs.vue'
//
//import GettingStarted from './docs/getting-started.md'
//import JavaScriptLibrary from './docs/javascript.md'
//import ElixirLibrary from './docs/elixir.md'
//
//const routes = [
//  {
//    path: '/',
//    component: Home
//  },
//  {
//    path: '/explore',
//    component: Explore
//  },
//  {
//    path: '/docs',
//    component: Docs,
//    //redirect: '/docs/getting-started',
//    children: [
//      {
//        path: 'getting-started',
//        component: GettingStarted
//      },
//      {
//        path: 'javascript-library',
//        components: JavaScriptLibrary
//      },
//      {
//        path: 'elixir',
//        components: ElixirLibrary
//      },
//      {
//        path: 'envelope',
//        components: GettingStarted
//      },
//      {
//        path: 'signatures',
//        components: GettingStarted
//      },
//      {
//        path: 'encryption',
//        components: GettingStarted
//      },
//      {
//        path: 'algorithms',
//        components: GettingStarted
//      },
//      {
//        path: 'keys',
//        components: GettingStarted
//      }
//    ]
//  }
//]

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router