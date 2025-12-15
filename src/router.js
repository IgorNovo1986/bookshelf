import { createWebHistory , createRouter } from 'vue-router'

import Login from './components/Login.vue'
import Register from './components/Register.vue'
import Cart from './components/Cart.vue'
import Bookshelf from "@/components/Bookshelf.vue";
import BookshelfIDetailsBook from "@/components/BookshelfIDetailsBook.vue";

import CustomLayout from "@/layouts/CustomLayout.vue";
import DefaultLayout from "@/layouts/DefaultLayout.vue";

const routes = [
    {
        path: '/book-shelf',
        component: Bookshelf,
        name: 'bookShelf',
        meta: {
            header: "Помічник з пошуку літератури",
            layout: CustomLayout
        },
    },
    {
        path: '/book-shelf/:id',
        component: BookshelfIDetailsBook,
        name: 'bookShelfDetails',
        meta: {
            header: "Помічник з пошуку літератури книга: 'Some book'",
            layout: CustomLayout
        },
    },
    {
        path: '/login',
        component: Login,
        meta: {
            header: "Логін",
            layout: DefaultLayout
        }
    },
    {
        path: '/register',
        component: Register,
        meta: {
            header: "Реєстрація",
            layout: DefaultLayout
        }
    },
    {
        path: '/cart',
        name: 'cart',
        component: Cart,
        meta: {
            header: "Кошик",
            layout: CustomLayout
        },
    },
]

const router = createRouter({
    history: createWebHistory (),
    routes,
})

export default router