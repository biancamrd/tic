<template>
  <div class="bg-color-light rounded-xl my-10 pb-10">
    <h2 class="py-5">Authors List</h2>
    <template v-if="authors && authors.length > 0">
      <v-row>
        <v-col v-for="author in displayedAuthors" :key="author.id" cols="12" sm="6" md="6" lg="4" xl="3">
          <AuthorCard :author="author" />
        </v-col>
      </v-row>
      <v-pagination
        v-model="currentPage"
        :length="Math.ceil(authors.length / itemsPerPage)"
        @input="changePage"
        color="button-color"
      ></v-pagination>
    </template>
    <template v-else>
      <p>No authors available</p>
    </template>
  </div>
</template>

<script>
import AuthorCard from "./AuthorCard.vue";

export default {
  props: {
    authors: Array,
  },
  components: {
    AuthorCard,
  },
  data() {
    return {
      currentPage: 1,
      itemsPerPage: 6, // Adjust based on your design and preferences
    };
  },
  computed: {
    displayedAuthors() {
      const startIndex = (this.currentPage - 1) * this.itemsPerPage;
      const endIndex = startIndex + this.itemsPerPage;
      return this.authors.slice(startIndex, endIndex);
    },
  },
  methods: {
    changePage(page) {
      this.currentPage = page;
    },
  },
};
</script>

<style scoped>
.bg-color-light {
  background-color: #FFD0D0;
}

.button-color {
  color: #CA8787;
}

/* Stilizare specifică pentru componenta AuthorList */
</style>
