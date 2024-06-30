<template>
  <v-form @submit.prevent="addAuthor" class="rounded bg-ffd0d0 p-4">
    <h3 class="py-2 text-ca8787">Add an author</h3>
    <v-alert v-if="showEmptyNameError" type="error" dense outlined class="mb-4">
      {{ emptyNameErrorMessage }}
    </v-alert>
    <v-text-field
      v-model="newAuthorName"
      label="Author name"
      class="w-100 mb-4"
      color="ca8787"
      outlined
      dense
      required
    ></v-text-field>
    <v-btn type="submit" class="bg-ca8787 text-white" large>
      <v-icon left>mdi-plus</v-icon> Add Author
    </v-btn>
  </v-form>
</template>

<script>
export default {
  data() {
    return {
      newAuthorName: "",
      showEmptyNameError: false,
      emptyNameErrorMessage: "",
    };
  },
  methods: {
    async addAuthor() {
      try {
        await this.$store.dispatch("fetchUser");

        if (!this.$store.state.user) {
          console.error("User not available");
          return;
        }
        this.showEmptyNameError = false;
        await this.$store.dispatch("createAuthor", {
          name: this.newAuthorName,
          user_id: this.$store.state.user.uid,
        });
        this.newAuthorName = "";
      } catch (error) {
        if (error.response && error.response.status === 400) {
          this.emptyNameErrorMessage = error.response.data.error;
          this.showEmptyNameError = true;
        }
      }
    },
  },
};
</script>

<style scoped>
.bg-ffd0d0 {
  background-color: #ffd0d0; /* Culoare de fundal pentru formular */
  color: #ca8787; /* Culoare text */
}

.text-ca8787 {
  color: #ca8787; /* Culoare text */
}

.bg-ca8787 {
  background-color: #ca8787; /* Culoare buton */
}

.text-white {
  color: #ffffff; /* Culoare text buton */
}

.rounded {
  border-radius: 8px; /* Raza colțurilor pentru a face formularul dreptunghiular */
}

.w-100 {
  width: 100%; /* Lățimea completă pentru text field */
}

.mb-4 {
  margin-bottom: 16px; /* Marge jos pentru spațiere */
}

.p-4 {
  padding: 16px; /* Padding pentru formular */
}
</style>
