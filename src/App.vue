<template>
  <v-app class="bg-ffd0d0">
    <v-app-bar v-if="isAuthenticated" class="bg-e1acac">
      <v-toolbar-title class="text-center ml-16 text-ca8787">My Library</v-toolbar-title>
      <v-btn icon @click="signOut">
        <v-icon>mdi-logout</v-icon>
      </v-btn>
      <v-btn icon @click="toggleView">
        <v-icon>{{ showAuthors ? 'mdi-book-open-page-variant' : 'mdi-account' }}</v-icon>
      </v-btn>
    </v-app-bar>

    <v-container>
      <v-main>
        <v-row v-if="!isAuthenticated">
          <v-col cols="12">
            <UserLogin @authenticated="onUserAuthenticated" v-if="showLogin" />
            <UserRegister v-else />
            <v-btn @click="toggleForm" class="mt-4" color="ca8787">
              {{ showLogin ? 'Go to Register' : 'Go to Login' }}
            </v-btn>
          </v-col>
        </v-row>
        <v-row v-else>
          <v-col cols="12" v-if="showAuthors">
            <AuthorForm class="w-75 mx-auto" />
          </v-col>
          <v-col cols="12" v-else>
            <BookForm class="w-75 mx-auto" />
          </v-col>
          <v-row class="w-75 mx-auto" v-if="showAuthors">
            <v-col>
              <AuthorsList :authors="$store.state.authors" />
            </v-col>
          </v-row>
         
          <v-row class="w-75 mx-auto" v-else>
            <v-col>
              <BooksTable
                :books="$store.state.books"
                :authors="$store.state.authors"
              />
            </v-col>
        
          </v-row>
        </v-row>
      </v-main>
    </v-container>
  </v-app>

</template>

<script>
import UserLogin from "./components/UserLogin.vue";
import UserRegister from "./components/UserRegister.vue";
import AuthorForm from "./components/AuthorForm.vue";
import BookForm from "./components/BookForm.vue";
import BooksTable from "./components/BooksTable.vue";

import AuthorsList from "./components/AuthorsList.vue";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../firebaseConfig";


export default {
  name: "App",
  components: {
    UserLogin,
    UserRegister,
    AuthorForm,
    BookForm,
    BooksTable,
    AuthorsList,

  },
 
  data() {
    return {
      isAuthenticated: false,
      user: null,
      showLogin: true,
      showAuthors: true, // Adăugăm o variabilă pentru a gestiona vizualizarea autorilor sau cărților
    };
  },
  created() {
    // Initializăm starea isAuthenticated la true pentru a afișa inițial componente cu autori
    this.isAuthenticated = true;

    onAuthStateChanged(auth, (user) => {
      this.isAuthenticated = !!user;
      this.user = user;

      if (user) {
        this.$store.dispatch("fetchBooks", { userId: user.uid });
        this.$store.dispatch("fetchAuthors", { userId: user.uid });
      }
    });
  },
  methods: {
    signOut() {
      signOut(auth);
      this.isAuthenticated = false;
      this.user = null;
    },
    onUserAuthenticated(user) {
      this.isAuthenticated = true;
      this.user = user;
    },
    toggleForm() {
      this.showLogin = !this.showLogin;
    },
    toggleView() {
      this.showAuthors = !this.showAuthors; // Invertim valoarea pentru a schimba între vizualizarea autorilor și a cărților
    },
    
  },
};
</script>

<style scoped>
.bg-ffd0d0 {
  background-color: #FFD0D0; /* Culoare de fundal pentru aplicație */
  color: #CA8787; /* Culoare text */
}

.text-ca8787 {
  color: #CA8787; /* Culoare text */
}

.bg-e1acac {
  background-color: #E1ACAC !important; /* Culoare de fundal importantă pentru bara */
}

.v-btn.color-ca8787 {
  background-color: #FFD0D0; /* Culoare buton hover */
}
</style>