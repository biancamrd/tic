<template>
  <div>
    <h2 class="bg-e1acac custom-card p-4 text-ca8787">Books List</h2>
    <v-card flat class="rounded-b-xl bg-ffd0d0 p-4">
      <v-text-field
        v-model="search"
        label="Search"
        prepend-inner-icon="mdi-magnify"
        single-line
        variant="outlined"
        color="ca8787"
        hide-details
        class="font-weight-bold mb-4"
      ></v-text-field>
    
      <v-data-table
      
        class="bg-ffd0d0"
        :headers="headers"
        :items="books"
        :search="search"
        :items-per-page="5"
        :hide-default-footer="true"
      >
        <template v-slot:item="{ item }">
          <tr>
            <td class="text-left">
              <template v-if="!isEditingBook || editedBook.id !== item.id">
                {{ item.title }}
              </template>
              <template v-else>
                <v-text-field
                  v-model="editedBook.title"
                  label="Book title"
                  color="ca8787"
                  :rules="[(v) => !!v || 'Book title is required']"
                  dense
                ></v-text-field>
              </template>
            </td>
            <td class="text-left">
              <template v-if="!isEditingBook || editedBook.id !== item.id">
                {{ getAuthorName(item.author_id) || "-" }}
              </template>
              <template v-else>
                <v-select
                  v-model="editedBook.author_id"
                  :items="
                    authors.map((author) => ({
                      title: author.name,
                      value: author.id,
                    }))
                  "
                  label="Select the author"
                  color="ca8787"
                  dense
                ></v-select>
              </template>
            </td>
            <td class="text-left">
              <v-btn @click="editBook(item)" class="bg-ca8787 text-white" small>
                Edit
              </v-btn>
            </td>
            <td class="text-left">
              <v-btn
                @click="saveEditedBook()"
                :disabled="
                  !isEditingBook ||
                  editedBook.id !== item.id ||
                  !editedBook.title.trim()
                "
                class="bg-e1acac text-white"
                small
              >
                Save
              </v-btn>
            </td>
            <td class="text-left">
              <v-btn @click="deleteBook(item)" class="bg-red text-white" small>Delete</v-btn>
              <!-- Utilizare corectă a router-link pentru navigare către detalii -->
             
            </td>
          </tr>
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>

<script>
export default {
  props: {
    authors: Array,
    books: Array,
  },
  data() {
    return {
      search: "",
      headers: [
        {
          align: "start",
          key: "title",
          title: "Book title",
          class: "font-weight-bold",
        },
        { align: "start", key: "author_id", title: "Author" },
        { align: "start", title: "Edit", sortable: false },
        { align: "start", title: "Save", sortable: false },
        { align: "start", title: "Actions", sortable: false },
      ],
      isEditingBook: false,
      editedBook: { id: "", title: "", author_id: "" },
    };
  },
  methods: {
    async editBook(book) {
      this.editedBook = {
        id: book.id,
        title: book.title,
        author_id: book.author_id || "",
      };
      this.isEditingBook = true;
    },
    async saveEditedBook() {
      try {
        await this.$store.dispatch("setEditedBook", this.editedBook);
        this.isEditingBook = false;
        this.editedBook = { id: "", title: "", author_id: "" };
      } catch (error) {
        console.error("Error saving the book: ", error.message);
      }
    },
    async deleteBook(book) {
      await this.$store.dispatch("deleteBook", book);
    },
    getAuthorName(authorId) {
      const author = this.authors.find((a) => a.id === authorId);
      return author ? author.name : "";
    },
  },
};
</script>

<style scoped>
.bg-ffd0d0 {
  background-color: #ffd0d0; /* Culoare de fundal pentru card */
}

.text-ca8787 {
  color: #ca8787; /* Culoare text */
}

.bg-e1acac {
  background-color: #e1acac !important; /* Culoare de fundal importantă pentru header */
}

.bg-ca8787 {
  background-color: #ca8787; /* Culoare buton */
}

.bg-red {
  background-color: #a87676; /* Culoare pentru butonul de ștergere */
}

.text-white {
  color: #ffffff; /* Culoare text buton */
}

.rounded-b-xl {
  border-bottom-left-radius: 16px; /* Raza colțurilor pentru a face cardul dreptunghiular */
  border-bottom-right-radius: 16px;
}

.mb-4 {
  margin-bottom: 16px; /* Marge jos pentru spațiere */
}

.p-4 {
  padding: 16px; /* Padding pentru card */
}
</style>
