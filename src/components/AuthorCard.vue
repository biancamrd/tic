<template>
  <v-card flat class="w-75 mx-auto author-card">
    <v-card-title class="bg-color-main">
      <template v-if="!isEditingAuthor || editedAuthor.id !== author.id">
        <div class="text-h5">
          {{ author.name }}
        </div>
      </template>
      <template v-else>
        <v-text-field
          v-model="editedAuthor.name"
          label="Author name"
          bg-color="bg-color-light"
          :rules="[(v) => !!v || 'Author name is required']"
        ></v-text-field>
      </template>
      <div class="py-2">
        <v-btn @click="editAuthor(author)" text class="ml-2 button-color">
          Edit
        </v-btn>
        <v-btn
          @click="setEditedAuthor"
          text
          class="ml-2 button-color"
          :disabled="!isEditingAuthor || editedAuthor.id !== author.id || !editedAuthor.name.trim()" 
        >
          Save
        </v-btn>
        <v-btn @click="deleteAuthor(author)" text class="ml-2 button-color">
          Delete
        </v-btn>
      </div>
    </v-card-title>
    <v-card-text class="bg-color-light py-4 scroll-bar">
      <template v-if="author.books && author.books.length > 0">
        <v-simple-table class="books-table">
          <template v-slot:default>
            <thead>
              <tr>
                <th class="text-left">Books</th>
                <th class="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="book in author.books" :key="book.id">
                <td>{{ book.title }}</td>
                <td class="text-right">
                  <v-btn
                    @click="deleteBookFromAuthor(book)"
                    text
                    class="button-color"
                    size="small"
                  >
                    Delete
                  </v-btn>
                </td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </template>
      <template v-else>
        <div class="d-flex justify-center align-center h-75 text-h5">
          There are no books from this author.
        </div>
      </template>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  props: {
    author: Object,
  },
  data() {
    return {
      isEditingAuthor: false,
      editedAuthor: { id: "", name: "" },
    };
  },
  methods: {
    editAuthor(author) {
      this.editedAuthor = { id: author.id, name: author.name };
      this.isEditingAuthor = true;
    },
    async setEditedAuthor() {
      try {
        await this.$store.dispatch("setEditedAuthor", this.editedAuthor);

        this.isEditingAuthor = false;
        this.editedAuthor = { id: "", name: "" };
      } catch (error) {
        console.error("Error saving the author:", error.message);
      }
    },
    async deleteAuthor(author) {
      await this.$store.dispatch("deleteAuthor", author);
    },
    async deleteBookFromAuthor(book) {
      await this.$store.dispatch("deleteBookFromAuthor", book);
    },
  },
};
</script>

<style scoped>
.author-card {
  background-color: #E1ACAC;
}

.bg-color-main {
  background-color: #A87676;
}

.bg-color-light {
  background-color: #FFD0D0;
}

.button-color {
  color: #CA8787;
}

.books-table {
  width: 100%;
}

.books-table th,
.books-table td {
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
  padding: 12px;
}

.books-table th {
  background-color: #CA8787;
  color: white;
  text-align: left;
}

.text-left {
  text-align: left;
}

.text-right {
  text-align: right;
}
</style>
