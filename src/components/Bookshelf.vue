<template>
  <div class="book-container">
    <div class="book-filter column ">
      <h2>Filters</h2>
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
    <div class="column selected-books">
      <h2>Search</h2>
      <div v-if="loadingBook">Loading search</div>
      <div v-else class="book-grid">
          <div v-for="book in searchBooks" :key="book.id" class="book-item">
            <!--          <img :src="book.img" :alt="book.name" class="book-img" />-->
            <img :src="logo" alt="logo" class="book-img" />
            <div>
              <h3>{{ book.name }}</h3>
              <p>Автор(ы): {{ book.authors.join(', ') }}</p>
              <p>Жанр: {{ book.genre }}</p>
              <p>Язык: {{ book.lang }}</p>
              <p class="age-rating">{{ book.age_rating }}+</p>
              <p class="rating-container">
                <img
                    v-for="n in book.rating"
                    :key="n"
                    :src="iconStar"
                    alt="rating"
                    class="rating"
                />
              </p>
              <p>Цена: {{ book.cost }} грн</p>
              <p>Количество страниц: {{ book.number_of_page }}</p>
              <p>Год: {{ book.year }}</p>
            </div>
          </div>
      </div>
    </div>
    <div class="column recommended-books">
      <h2>Recommended</h2>
      <div v-if="loadingBook">Loading recommended</div>
      <div v-else class="book-grid">
        <div v-for="book in recommendedBooks" :key="book.id" class="book-item">
          <!--          <img :src="book.img" :alt="book.name" class="book-img" />-->
          <img :src="logo" alt="logo" class="book-img" />
          <div>
            <h3>{{ book.name }}</h3>
            <p>Автор(ы): {{ book.authors.join(', ') }}</p>
            <p>Жанр: {{ book.genre }}</p>
            <p>Язык: {{ book.lang }}</p>
            <p class="age-rating">{{ book.age_rating }}+</p>
            <p class="rating-container">
              <img
                  v-for="n in book.rating"
                  :key="n"
                  :src="iconStar"
                  alt="rating"
                  class="rating"
              />
            </p>
            <p>Цена: {{ book.cost }} грн</p>
            <p>Количество страниц: {{ book.number_of_page }}</p>
            <p>Год: {{ book.year }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import filtersNew from '../static_data/filters.json';
import books from './../static_data/book.json'

import logo from '../assets/logo.png'
import iconStar from '../assets/icon-star.png'

import { ref, onMounted, watch, reactive   } from 'vue';

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

    const dataBookFilter = ref(null);
    const loadingFilter = ref(true);

    const loadingBook = ref(false);
    const searchBooks = ref(books.search);
    const recommendedBooks = ref(books.recommend);
    const getFilters = async () => {
        try {
            const response = await fetch(`api/api/get_info`);
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

    const getBooks = async (filters) => {
      try {
        loadingBook.value = true
        const response = await fetch(`api/api/get_books`, {
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
        console.log('SEARCH, RECOMMEND:', search, recommend);
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
      logo,
      iconStar,
      dataBookFilter,
      loadingBook
    };
  }
};
</script>


<style scoped>

.book-container {
  display: grid;
  grid-template-columns: minmax(250px, 300px) 3fr 3fr;
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

.book-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 2fr));
  gap: 30px;
  justify-content: center;
}

.book-item {
  background: aliceblue;
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
  top: 220px;
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
  height: 250px;
  object-fit: cover;
  border-bottom: 1px solid #eee;
}

.book-item h3 {
  font-size: 1.2rem;
  margin: 1rem 0 0.5rem;
  color: #007bff;
  text-align: center;
  text-transform: capitalize;
  font-weight: bold;
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
