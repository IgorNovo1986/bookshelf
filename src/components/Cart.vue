<template>
  <div class="book-item__cart-wrapper">
    <template v-if="finalResultBook.length">
      <div
          v-for="book in finalResultBook"
          :key="book.id"
          class="book-item__cart"
      >
        <img :src="book.img" :alt="book.name" class="book-img" />
        <div class="book-item__content">
          <router-link :to="`book-shelf/${book.id}`">
            <h3>{{ book.name }}</h3>
          </router-link>
          <p>Автор: {{ book.authors.join(', ') }}</p>
          <p>Жанр: {{ book.genres.join(', ')  }}</p>
          <p>Мова: {{ book.lang }}</p>
          <p class="age-rating">{{ book.age_rating }}+</p>
          <p class="rating-container">
            <img
                v-for="n in book.rating"
                :key="n"
                src="images/icon-star.png"
                alt="rating"
                class="rating"
            />
          </p>
          <p>Ціна: {{ book.cost }} грн</p>
          <p>Кількість сторінок: {{ book.number_of_page }}</p>
          <p>Рік: {{ book.year }}</p>
          <button
              class="button_add_to_cart"
              @click="removeBook(book.id)"
          >
            Видалити
          </button>
        </div>
      </div>
    </template>
    <div v-else>
      <router-link to="/book-shelf"> Move to bookshelf</router-link>
    </div>
  </div>
</template>

<script>

import books from '@/static_data/book.json'
import { ref ,onMounted} from "vue";

import { useAuthStore } from '@/stores/auth'
export default {
  name: 'BookShelfCart',
  setup() {

    let finalResultBook = ref([]);

    const authStore = useAuthStore()
    const removeBook = (id) => {

      finalResultBook.value = finalResultBook.value.filter(book => book.id !== id)

      let saveToLocalStorageAfterDelete = []

      finalResultBook.value.forEach(book =>{
        saveToLocalStorageAfterDelete.push(book.id)
      })

      if (!authStore.isAuthenticate) {
        const bookInCart =  JSON.parse(localStorage.getItem('bookstore_guest_session'));
        const bookInCartRemove = { ...bookInCart, books:saveToLocalStorageAfterDelete}

        localStorage.setItem('bookstore_guest_session', JSON.stringify(bookInCartRemove));
      }else {
        const bookInCart =  JSON.parse(localStorage.getItem('bookstore_current_user'));
        const bookInCartRemove = { ...bookInCart, books:saveToLocalStorageAfterDelete}

        localStorage.setItem('bookstore_current_user', JSON.stringify(bookInCartRemove));
      }

    }
    const getCartBook = () => {

      if (!authStore.isAuthenticate) {

        const bookInCart =  JSON.parse(localStorage.getItem('bookstore_guest_session')) || {
          name: '',
          email: '',
          password: '',
          id: '',
          role: 'guest',
          books: []
        };
        console.log(bookInCart, 'bookInCart')

        const mergeAllBooks = [...books.search, ...books.recommend]
        mergeAllBooks.forEach((book)=>{
          bookInCart.books.forEach((id) =>{
            if(book.id === id) {
              finalResultBook.value.push(book)
            }
          })
        })
      } else {

        const bookInCart =  JSON.parse(localStorage.getItem('bookstore_current_user'))
        const mergeAllBooks = [...books.search, ...books.recommend]
        mergeAllBooks.forEach((book)=>{
          bookInCart?.books.forEach((id) =>{
            if(book.id === id) {
              finalResultBook.value.push(book)
            }
          })
        })
      }

    }

    onMounted(async () => {
      getCartBook();
    });

    return{
      finalResultBook,
      removeBook
    }
  }
};
</script>

<style scoped>
  .book-item__cart-wrapper{
    width: 992px;
    display: flex;
    flex-direction: column;
    gap: 25px;
    margin: 0 auto;
  }

  .book-item__cart{
    display: flex;
    position: relative;
    border: 1px dotted lightgray;
  }

  .book-item__content{
    width: 100%;
  }

  .rating{
    width: 20px;
    height: 20px;
  }

  .age-rating {
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    bottom: 0px;
    left: 15px;
    font-weight: bold;
    font-size: 28px !important;
    border: 1px solid rgba(255,193,7, 1);
    border-radius: 50%;
    width: 50px;
    height: 50px;
    color: #ffc107 !important;
  }

  .rating-container{
    position: absolute;
    top: 0;
    left: 15px;
  }

  .book-img {
    width: 200px;
    height: auto;
    object-fit: fill;
    border-bottom: 1px solid #eee;
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
</style>
