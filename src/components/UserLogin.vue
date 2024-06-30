<template>
  <v-container class="login-container">
    <v-row justify="center">
      <v-col cols="12" sm="10" md="8" lg="6">
        <v-card class="elevation-6">
          <v-card-title class="text-center">
            <h4 class="text-h4 text-pink">Login to Your Account</h4>
          </v-card-title>
          <v-card-text>
            <v-form ref="signInForm" @submit.prevent="signInWithEmail">
              <v-text-field
                v-model="email"
                label="Email"
                outlined
                dense
                color="pink"
                autocomplete="false"
                required
                :rules="signInRules.email"
              />
              <v-text-field
                v-model="password"
                label="Password"
                outlined
                dense
                color="pink"
                autocomplete="false"
                type="password"
                required
                :rules="signInRules.password"
              />
              <v-btn color="pink" type="submit" dark block tile>Log in</v-btn>
            </v-form>
          </v-card-text>
       
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebaseConfig";
import axios from "axios";
import getAxiosConfig from "../services/firebaseService";

export default {
  data() {
    return {
      email: "",
      password: "",
      signInRules: {
        email: [
          (v) => !!v || "Email is required",
          (v) => this.validateEmail(v) || "Invalid email address",
        ],
        password: [
          (v) => !!v || "Password is required",
          (v) => this.validatePassword(v) || "Password must be at least 6 characters",
        ],
      },
    };
  },
  methods: {
    async signInWithEmail() {
      this.$refs.signInForm.resetValidation();
      try {
        await signInWithEmailAndPassword(auth, this.email, this.password);
        const config = await getAxiosConfig();
        await axios.post(
          "http://localhost:3000/generate-data",
          { user_id: auth.currentUser.uid },
          config
        );
      } catch (error) {
        console.error("Error signing in with email and password:", error.message);
        if (error.code === "auth/invalid-credential") {
          this.signInRules.password.push("Invalid email or password.");
          this.signInRules.email.push("Invalid email or password.");
          this.$refs.signInForm.validate();
        }
      }
    },
    validateEmail(email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    },
    validatePassword(password) {
      return password.length >= 6;
    },
    
  },
};
</script>

<style scoped>
.login-container {
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
