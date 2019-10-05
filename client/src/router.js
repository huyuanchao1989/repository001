import Vue from 'vue'
import Router from 'vue-router'

import { Message } from 'element-ui';

Vue.use(Router)

const router = new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [{
        path: '/',
        redirect: '/login'
    }, {
        path: '/login',
        name: 'login',
        component: () => import('./views/Login.vue')
    },
    {
        path: '/register',
        name: 'register',
        component: () => import('./views/Register.vue')
    },
    {
        path: '*',
        name: 'notfound',
        component: () => import('./views/404.vue')
    }, {
        path: '/index',
        name: 'index',
        component: () => import('./views/Index.vue'),
        children: [
            {
                path: '/index/service',
                name: 'service',
                component: () => import('./components/Service.vue')
            }, {
                path: '/index/materials',
                name: 'materials',
                component: () => import('./components/Materials.vue')
            }, {
                path: '/index/familyguest',
                name: 'familyguest',
                component: () => import('./components/FamilyGuest.vue')
            }, {
                path: '/index/files',
                name: 'files',
                component: () => import('./components/Files.vue')
            }, {
                path: '/index/system',
                name: 'system',
                component: () => import('./components/System.vue'),
                children: [
                    {
                        path: '/system/allrecords',
                        name: 'allrecords',
                        component: () => import('./components/system/AllRecords.vue')
                    }, {
                        path: '/system/pendingrecords',
                        name: 'pendingrecords',
                        component: () => import('./components/system/PendingRecords.vue')
                    }, {
                        path: '/system/serverinfo',
                        name: 'serinfo',
                        component: () => import('./components/system/ServerInfo.vue')
                    }, {
                        path: '/system/userfootmark',
                        name: 'userfootmark',
                        component: () => import('./components/system/UserFootMark.vue')
                    }, {
                        path: '/system/usermanage',
                        name: 'usermanage',
                        component: () => import('./components/system/UserManage.vue')
                    }, {
                        path: '/system/singleuser/:id',
                        name: 'singleuser',
                        component: () => import('./components/system/singleUser.vue'),
                        // meta: { keepAlive: false }  //keep-alive对该组件无效,但带路由参数时无用
                    }
                ]
            }
        ]
    }

    ]
})

router.beforeEach((to, from, next) => {
    const isLogin = !!localStorage.getItem('gssf_token')
    if (to.path === '/login' || to.path === '/register' || isLogin) {
        next()
    } else {
        next('/login')
    }
    Message.closeAll()  //路由跳转前关闭所的有el-message
})

export default router
