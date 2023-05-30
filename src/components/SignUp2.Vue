<script setup>
import { ref, onMounted } from "vue";
import {auth} from "../../firebase";
import {UserAuth} from "../Auth"
import { fetchSignInMethodsForEmail } from "firebase/auth";

const email = ref("");
const password = ref("");
const confirmPassword = ref("");
const error = ref("");
const emailError = ref("");

const { user, signUp, googleSignIn } = UserAuth();

const handleSubmit = async (e) => {
  e.preventDefault();

  const methods = await fetchSignInMethodsForEmail(auth, email.value);
  if (methods.length > 0) {
    emailError.value = "An account with this email already exists";
    return;
  }
  if (password.value !== confirmPassword.value) {
    error.value = "Passwords do not match";
    return;
  }

  try {
    await signUp(email.value, password.value);
    router.push("/");
  } catch (err) {
    console.log(err);
    error.value = err;
  }
};

const handleGoogleSignIn = async () => {
  try {
    await googleSignIn();
  } catch (err) {
    console.error(err);
  }
};

onMounted(() => {
  if (user !== null) {
    router.push("/");
  }
});
</script>

<template>
    <div class="signup-page">
      <div class="signup-container">
        <form @submit="handleSubmit" class="signup-form">
          <h1 class="signup-title">Sign up</h1>
  
          <input
            :class="`signup-input ${emailError ? 'error-input' : ''}`"
            type="email"
            name="email"
            placeholder="Email"
            v-model="email"
            required
          />
          <input
            :class="`signup-input ${error ? 'error-input' : ''}`"
            type="password"
            name="password"
            placeholder="Password"
            v-model="password"
            required
          />
          <input
            :class="`signup-input ${error ? 'error-input' : ''}`"
            type="password"
            name="password2"
            placeholder="Confirm password"
            v-model="confirmPassword"
            required
          />
  
          <p v-if="error || emailError" class="error-message">
            {{ error || emailError }}
          </p>
  
          <p class="login-message">
            Already have an account?
            <router-link to="/login" class="login-link"> Log in</router-link>
          </p>
  
          <button class="signup-button">Sign up</button>
        </form>
  
        <div class="right">
          <div class="social-buttons-container">
            <GoogleButton @click="handleGoogleSignIn" />
          </div>
        </div>
        <div class="or">OR</div>
      </div>
    </div>
  </template>

<style scoped>

</style>