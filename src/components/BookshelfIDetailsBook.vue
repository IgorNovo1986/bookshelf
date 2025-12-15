<template>
    <div class="book-item">
      <img :src="getBook.img" :alt="getBook.name" class="book-img" />
      <div>
        <h3>{{ getBook.name }}</h3>
        <p>Автор: {{ getBook.authors.join(', ') }}</p>
        <p>Жанр: {{ getBook.genres.join(', ')  }}</p>
        <p>Мова: {{ getBook.lang }}</p>
        <p class="age-rating">{{ getBook.age_rating }}+</p>
        <p class="rating-container">
          <img
              v-for="n in getBook.rating"
              :key="n"
              src="/images/icon-star.png"
              alt="rating"
              class="rating"
          />
        </p>
        <p>Ціна: {{ getBook.cost }} грн</p>
        <p>Кількість сторінок: {{ getBook.number_of_page }}</p>
        <p>Рік: {{ getBook.year }}</p>
        <button
            class="button_add_to_cart"
            :class="bookButtonStates[getBook.id]?.class"
            @click="addToCart(getBook.id)"
            :disabled="bookButtonStates[getBook.id]?.disabled"
        >
          {{ bookButtonStates[getBook.id]?.text }}
        </button>
      </div>
    </div>
</template>

<script>
import books from './../static_data/book.json'

import { useRoute } from "vue-router";
import {computed, onMounted, ref} from "vue";

import { useAuthStore } from '@/stores/auth'

export default {
  name: 'BookDetails',
  setup() {

    const searchBooks = ref(books.search);
    const recommendedBooks = ref(books.recommend);
    const bookInCart = ref([]);

    const route = useRoute()
    const authStore = useAuthStore()

    const getBook = computed(() => {
      const allBooks = [...searchBooks.value, ...recommendedBooks.value]
      const book = allBooks.find(book => book.id == route.params.id)
      return book || null
    })

    const bookButtonStates = computed(() => {
      const states = {}
      const allBooks = [...searchBooks.value, ...recommendedBooks.value]

      allBooks.forEach(book => {
        if (!book?.id) return

        const inCart = Array.isArray(bookInCart.value) &&
            bookInCart.value.some(item => {
              const itemId = typeof item === 'object' ? item?.id : item
              return itemId === book.id
            })

        states[book.id] = {
          text: inCart ? 'В кошику ✅' : 'Додати в кошик',
          disabled: inCart,
          class: inCart ? 'in-cart' : ''
        }
      })

      return states
    })
    const addToCart = (id) => {

      if (!authStore.isAuthenticate) {

        const checkLocalStorageGuestSession = JSON.parse(localStorage.getItem('bookstore_guest_session')) || null;

        if (checkLocalStorageGuestSession) {
          if (!checkLocalStorageGuestSession.books.includes(id)) {
            checkLocalStorageGuestSession.books.push(id);
            localStorage.setItem('bookstore_guest_session', JSON.stringify(checkLocalStorageGuestSession));
            bookInCart.value = checkLocalStorageGuestSession.books;
            console.log('Книга добавлена в корзину:', id);
          } else {
            console.log('Эта книга уже в корзине:', id);
          }
        } else {
          const guestSession = {
            id: '',
            name: '',
            email: '',
            password: '',
            role: 'guest',
            books: []
          }

          guestSession.books.push(id);
          localStorage.setItem('bookstore_guest_session', JSON.stringify(guestSession));
          bookInCart.value = guestSession.books;
          console.log('Первая книга добавлена в корзину:', id);
        }

      } else {

        const checkLocalStorage = JSON.parse(localStorage.getItem('bookstore_current_user')) || [];

        if (!checkLocalStorage.books.includes(id)) {
          checkLocalStorage.books.push(id);
          localStorage.setItem('bookstore_current_user', JSON.stringify(checkLocalStorage));
          bookInCart.value = checkLocalStorage.books;
          console.log('Книга добавлена в корзину:', id);
        } else {
          console.log('Эта книга уже в корзине:', id);
        }
      }

    }

    onMounted(async () => {

      if (!authStore.isAuthenticate) {
        const checkLocalStorageGuestSession = JSON.parse(localStorage.getItem('bookstore_guest_session')) || null
        if (checkLocalStorageGuestSession){
          bookInCart.value = checkLocalStorageGuestSession.books
        }
      } else {
        const checkLocalStorage = JSON.parse(localStorage.getItem('bookstore_current_user')) || []
        bookInCart.value = checkLocalStorage.books
      }
    });

    return {
      getBook,
      addToCart,
      bookButtonStates
    }
  }
}
</script>


<style scoped>

.book-item {
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
  position: relative;
}

.book-img {
  width: 100%;
  height: 800px;
  object-fit: contain;
}

.age-rating {
  display: flex;
  align-items: center;
  justify-content: center;
  top: 10px;
  right: 10px;
  font-weight: bold;
  font-size: 28px !important;
  //border: 1px solid rgba(255,193,7, 1);
  //border-radius: 50%;
  //width: 50px;
  //height: 50px;
  color: #ffc107 !important;
  width: 100%;
}

.rating-container{
  top: 370px;
  right: 10px;
}

.rating{
  width: 20px;
  height: 20px;
}

button {
  padding: 0.8rem 1.2rem;
  font-size: 0.9rem;
  font-weight: bold;
  color: #fff;
  background-color: #007bff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
  text-align: center;
  margin-top: 1rem;
}

button:hover {
  background-color: #0056b3;
}

.button_add_to_cart{
  width: 100%;
}

.button_add_to_cart.in-cart {
  background: #cccccc;
  cursor: not-allowed;
}

.button_add_to_cart:hover:not(.in-cart) {
  background: #45a049;
}
</style>



