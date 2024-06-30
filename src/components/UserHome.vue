<template>
  <div>
    <AuthorForm />
    <BookForm />
    <BooksTable :books="this.$store.state.books" :authors="this.$store.state.authors" />
    <AuthorsList :authors="this.$store.state.authors" />
  </div>
</template>

<script>
import AuthorForm from './AuthorForm.vue';
import BookForm from './BookForm.vue';
import BooksTable from './BooksTable.vue';
import AuthorsList from './AuthorsList.vue';
import { computed } from 'vue';
import { useStore } from 'vuex';

export default {
  components: {
    AuthorForm,
    BookForm,
    BooksTable,
    AuthorsList,
  },
  setup() {
    const store = useStore();

    // Exemplu de utilizare a datelor din store
    const books = computed(() => store.state.books);
    const authors = computed(() => store.state.authors);

    return {
      books,
      authors,
    };
  },
};
</script>

<style>
/* Stilurile tale */
</style>
