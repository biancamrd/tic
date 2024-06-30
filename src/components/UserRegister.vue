<template>
  <v-container class="register-container">
    <v-row justify="center">
      <v-col cols="12" sm="10" md="8" lg="6">
        <v-card class="elevation-6">
          <v-card-title class="text-center">
            <h4 class="text-h4 text-pink">Sign Up for an Account</h4>
          </v-card-title>
          <v-card-text>
            <v-form ref="registerForm" @submit.prevent="registerWithEmail">
              <v-text-field
                v-model="registerName"
                label="Name"
                outlined
                dense
                color="pink"
                autocomplete="false"
                class="mt-4"
                :rules="registerRules.registerName"
              />
              <v-text-field
                v-model="registerEmail"
                label="Email"
                outlined
                dense
                color="pink"
                autocomplete="false"
                :rules="registerRules.registerEmail"
              />
              <v-text-field
                v-model="registerPassword"
                label="Password"
                outlined
                dense
                color="pink"
                autocomplete="false"
                type="password"
                :rules="registerRules.registerPassword"
              />
              <v-btn color="pink" dark block tile class="mb-4" @click="registerWithEmail">Sign up</v-btn>
            </v-form>
          </v-card-text>
        
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../../firebaseConfig";
import axios from "axios";
import getAxiosConfig from "../services/firebaseService";

export default {
  data() {
    return {
      registerName: "",
      registerEmail: "",
      registerPassword: "",
      registerRules: {
        registerName: [
          (v) => !!v || "Name is required",
          (v) => this.validateName(v) || "Name must be at least 3 characters and contains only letters",
        ],
        registerEmail: [
          (v) => !!v || "Email is required",
          (v) => this.validateEmail(v) || "Invalid email address",
        ],
        registerPassword: [
          (v) => !!v || "Password is required",
          (v) => this.validatePassword(v) || "Password must be at least 6 characters",
        ],
      },
    };
  },
  methods: {
    async registerWithEmail() {
      this.$refs.registerForm.resetValidation();
      try {
        await createUserWithEmailAndPassword(auth, this.registerEmail, this.registerPassword);
        const user = auth.currentUser;
        await updateProfile(user, { displayName: this.registerName });
        const config = await getAxiosConfig();
        await axios.post("http://localhost:3000/generate-data", { user_id: auth.currentUser.uid }, config);
        this.$store.dispatch("fetchAuthors", { userId: auth.currentUser.uid });
        this.$store.dispatch("fetchBooks", { userId: auth.currentUser.uid });
      } catch (error) {
        console.error("Error registering with email and password:", error.code, error.message);
        if (error.code === "auth/email-already-in-use") {
          this.registerRules.registerEmail.push("Email address is already registered.");
          this.$refs.registerForm.validate();
        }
      }
    },
    goToLogin() {
      this.$router.push({ name: 'UserLogin' }); // Ensure 'UserLogin' matches the name in router configuration
    },
    validateEmail(email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    },
    validatePassword(password) {
      return password.length >= 6;
    },
    validateName(registerName) {
      const nameRegex = /^[a-zA-Z]{3,}$/;
      return nameRegex.test(registerName);
    },
  },
};
</script>

<style scoped>
.register-container {
  background-color: #FFD0D0; /* E1ACAC pentru o nuanță mai ușoară */
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.elevation-6 {
  box-shadow: 0px 0px 15px 0px rgba(0,0,0,0.1);
}

.text-h4 {
  font-size: 1.5rem;
  font-weight: bold;
}

.text-pink {
  color: #A87676;
}

.v-btn.text-decoration-none {
  text-decoration: none;
}

.v-btn.text-decoration-none:hover {
  background-color: #CA8787;
}
</style>
