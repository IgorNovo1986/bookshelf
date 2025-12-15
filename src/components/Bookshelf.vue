<template>
  <div class="book-container">
    <div class="book-filter column ">
      <h2>Фільтра</h2>
      <label>
        Жанр:
        <select v-model="filters.genre">
          <option value="">Всі</option>
          <option v-for="(name, id) in genre" :key="id" :value="id">{{ name }}</option>
        </select>
      </label>

      <label>
        Вартість:
        <div>
          <input
              type="number"
              v-model.number="filters.price.min"
              :min="priceRange.min"
              :max="filters.price.max"
              placeholder="Мін."
              class="input-range"
          />
          <input
              type="number"
              v-model.number="filters.price.max"
              :min="filters.price.min"
              :max="priceRange.max"
              placeholder="Макс."
              class="input-range"
          />
        </div>
        <span class="value">{{ filters.price.min }} - {{ filters.price.max }} грн</span>
      </label>

      <label>
        Мова видання:
        <select v-model="filters.language">
          <option value="">Всі</option>
          <option v-for="(name, id) in languages" :key="id" :value="id">{{ name }}</option>
        </select>
      </label>

      <label>
        Автор:
        <select v-model="filters.author">
          <option value="">Всі</option>
          <option v-for="(name, id) in authors" :key="id" :value="id">{{ name }}</option>
        </select>
      </label>

      <label>
        Рейтинг книги:
        <select v-model="filters.rating">
          <option value="">Всі</option>
          <option v-for="rating in ageRatings" :key="rating" :value="rating">{{ rating }}+</option>
        </select>
      </label>

      <label>
        Кількість сторінок:
        <div>
          <input
              type="number"
              v-model.number="filters.pages.min"
              :min="pagesRange.min"
              :max="filters.pages.max"
              placeholder="Мін."
              class="input-range"
          />
          <input
              type="number"
              v-model.number="filters.pages.max"
              :min="filters.pages.min"
              :max="pagesRange.max"
              placeholder="Макс."
              class="input-range"
          />
        </div>
        <span class="value">{{ filters.pages.min }} - {{ filters.pages.max }} стор.</span>
      </label>

      <label>
        Сортувати за новинками:
        <select v-model="filters.sort">
          <option value="DESC">Найновіші спочатку</option>
          <option value="ASC">Найстаріші спочатку</option>
        </select>
      </label>

      <button @click="applyFilters">Застосувати фільтри</button>
    </div>
    <div>
      <div class="column selected-books">
        <h2>Пошук - TOP 10</h2>
        <div v-if="loadingBook">Loading search</div>
        <div v-else class="book-grid">
            <div v-for="book in searchBooks" :key="book.id" class="book-item">
              <img :src="book.img" :alt="book.name" class="book-img" />
              <!--            <img :src="logo" alt="logo" class="book-img" />-->
              <div>
                <router-link :to="`/book-shelf/${book.id}`">
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
                <p>Кількість сторінок : {{ book.number_of_page }}</p>
                <p>Рік: {{ book.year }}</p>
                <button
                    class="button_add_to_cart"
                    :class="bookButtonStates[book.id]?.class"
                    @click="addToCart(book.id)"
                    :disabled="bookButtonStates[book.id]?.disabled"
                >
                  {{ bookButtonStates[book.id]?.text }}
                </button>
              </div>
            </div>
        </div>
      </div>
      <div class="column recommended-books">
        <h2>Рекомендаціі - TOP 10</h2>
        <div v-if="loadingBook">Loading recommended</div>
        <div v-else class="book-grid">
          <div v-for="book in recommendedBooks" :key="book.id" class="book-item">
            <img :src="book.img" :alt="book.name" class="book-img" />
            <!--          <img :src="logo" alt="logo" class="book-img" />-->
            <div>
              <router-link :to="`/book-shelf/${book.id}`">
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
                  :class="bookButtonStates[book.id]?.class"
                  @click="addToCart(book.id)"
                  :disabled="bookButtonStates[book.id]?.disabled"
              >
                {{ bookButtonStates[book.id]?.text }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import filtersNew from '../static_data/filters.json';
import books from './../static_data/book.json'

import { ref, onMounted, watch, reactive, computed } from 'vue';

import { useAuthStore } from '@/stores/auth'

export default {
  name: 'BookFilter',
  setup() {
    const filters = ref({
      genre: '',
      price: { min: filtersNew.cost.min, max: filtersNew.cost.max },
      language: '',
      author: '',
      rating: '',
      pages: { min: filtersNew.number_of_pages.min, max: filtersNew.number_of_pages.max },
      sort: 'DESC'
    });

    const bookInCart = ref([]);
    const dataBookFilter = ref(null);
    const loadingFilter = ref(true);

    const loadingBook = ref(false);
    const searchBooks = ref(books.search);
    const recommendedBooks = ref(books.recommend);

    const authStore = useAuthStore()
    const getFilters = async () => {
        try {
            const response = await fetch(`api/get_info`);
            if (!response.ok) {
              throw new Error(`HTTP ошибка: ${response.status}`);
            }
            const result = await response.json();
            dataBookFilter.value = result;
        } catch (err) {
            console.log('error', err.message)
        } finally {
          loadingFilter.value = false;
        }
    };

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

    const getBooks = async (filters) => {
      try {
        loadingBook.value = true
        const response = await fetch(`api/get_books`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(filters),
        });

        if (!response.ok) {
          throw new Error(`HTTP ERROR: ${response.status}`);
        }

        const { search, recommend } = await response.json();

        searchBooks.value = search
        recommendedBooks.value = recommend

      } catch (err) {
        console.log('ERROR:', err.message);
        return null;
      } finally {
        loadingBook.value = false;
      }
    };

    const genre = ref(filtersNew.genre);
    const authors = ref(filtersNew.author);
    const languages = ref(filtersNew.lang);
    const ageRatings = ref(filtersNew.age_rating);
    const priceRange = reactive({
      min: filtersNew.cost.min,
      max: filtersNew.cost.max
    });

    const pagesRange = reactive({
      min: filtersNew.number_of_pages.min,
      max: filtersNew.number_of_pages.max
    });

    watch(dataBookFilter, (newValue) => {
      if (newValue) {
        console.log(newValue, 'NEW')
        genre.value = newValue.genre;
        authors.value = newValue.author;
        languages.value = newValue.lang
        ageRatings.value = newValue.age_rating
        priceRange.min = newValue.cost.min;
        priceRange.max = newValue.cost.max;
        pagesRange.min = newValue.number_of_pages.min;
        pagesRange.max = newValue.number_of_pages.max;
      }
    });

    const applyFilters = () => {
      console.log('фильтра:', filters.value);
      let payload = {
        author_id: filters.value.author,
        genre_id: filters.value.genre,
        cost: {
          min: filters.value.price.min,
          max: filters.value.price.max
        },
        language_id: filters.value.language,
        age_rating: filters.value.rating,
        sort: filters.value.sort,
        number_of_page: {
          min: filters.value.pages.min,
          max: filters.value.pages.max
        }
      }
      getBooks(payload)
    };

    onMounted(async () => {
      await getFilters();
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
      filters,
      genre,
      languages,
      authors,
      ageRatings,
      priceRange,
      pagesRange,
      applyFilters,
      searchBooks,
      recommendedBooks,
      dataBookFilter,
      loadingBook,
      addToCart,
      bookButtonStates
    };
  }
};
</script>


<style scoped>

.book-container {
  display: grid;
  grid-template-columns: minmax(250px, 300px) 3fr;
  gap: 20px;
  padding: 20px;
}

.column {
  padding: 1.5rem;
  border-radius: 12px;
  background: linear-gradient(145deg, #ffffff, #f3f3f3);
  box-shadow: 4px 4px 8px rgba(0, 0, 0, 0.1), -4px -4px 8px rgba(255, 255, 255, 0.9);
}

.column h2 {
  font-size: 1.5rem;
  margin-bottom: 4rem;
  color: #333;
  text-align: center;
  text-transform: uppercase;
  font-weight: bold;
  letter-spacing: 1px;
}

.book-filter {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 2rem;
  border-radius: 8px;
  background-color: #5fb386;
}

label {
  display: flex;
  flex-direction: column;
  font-size: 0.9rem;
  color: #333;
}

label span {
  margin-bottom: 0.5rem;
  font-weight: 600;
}

input[type="range"] {
  margin-top: 0.5rem;
  -webkit-appearance: none;
  width: 100%;
  height: 6px;
  background: #d1d1d1;
  border-radius: 5px;
  outline: none;
  opacity: 0.7;
  transition: opacity 0.15s ease-in-out;
}

input[type="range"]:hover {
  opacity: 1;
}

input[type="number"] {
  padding: 0.5rem;
  border: 1px solid #d1d1d1;
  border-radius: 4px;
  width: 100%;
  margin-top: 0.5rem;
  font-size: 0.9rem;
}

select {
  padding: 0.5rem;
  border: 1px solid #d1d1d1;
  border-radius: 4px;
  font-size: 0.9rem;
  margin-top: 0.5rem;
  background-color: #fff;
}

.value {
  font-weight: 500;
  color: #555;
  margin-top: 0.5rem;
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

.book-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 2fr));
  gap: 50px;
  justify-content: center;
}

.book-item {
  background: rgba(240, 248, 255, 0.1);
  width: 300px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
  position: relative;
}

.age-rating {
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 10px;
  right: 10px;
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
  top: 370px;
  right: 10px;
}

.rating{
  width: 20px;
  height: 20px;
}

.book-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.book-img {
  width: 100%;
  height: 400px;
  object-fit: fill;
  border-bottom: 1px solid #eee;
}

.book-item h3 {
  font-size: 1.2rem;
  margin: 1rem 0 0.5rem;
  color: #007bff;
  text-align: center;
  text-transform: capitalize;
  font-weight: bold;
  height: 45px;

  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.book-item p {
  font-size: 0.9rem;
  margin: 0.3rem 0;
  color: #555;
  line-height: 1.4;
}

.book-item p:last-child {
  font-weight: bold;
  color: #28a745;
}

</style>
