<template>
    <div>
      <h2>Book Details</h2>
      <div v-if="book">
        <p><strong>Title:</strong> {{ book.title }}</p>
        <p><strong>Author:</strong> {{ getAuthorName(book.author_id) }}</p>
        <!-- Alte detalii despre carte -->
      </div>
      <div v-else>
        <p>Cartea nu a fost găsită.</p>
      </div>
    </div>
  </template>
<script>
export default {
  props: ['id'], // Asigură-te că primește id-ul ca prop
  data() {
    return {
      book: null,
    };
  },
  created() {
    this.fetchBookDetails(this.id); // Verifică dacă apelează corect metoda
  },
  methods: {
    async fetchBookDetails(id) {
      try {
        // Apelează API-ul sau store-ul pentru a obține detaliile cărții
        const response = await fetch(`/api/books/${id}`); // Exemplu de cerere către API
        const data = await response.json();
        this.book = data; // Setează datele cărții în data componentei
      } catch (error) {
        console.error('Error fetching book details:', error);
      }
    },
  },
};
</script>

  
  <style scoped>
  /* Stiluri pentru componenta detalii carte */
  </style>
  