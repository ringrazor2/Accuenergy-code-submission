 <script setup>
import { ref, onMounted } from "vue";
import {useRouter} from "vue-router"
import { fetchSignInMethodsForEmail, getAuth, createUserWithEmailAndPassword } from "firebase/auth";

const router = useRouter();
const email = ref("");
const password = ref("");
const confirmPassword = ref("");
const error = ref("");
const emailError = ref("");

const signUp = () => {
    createUserWithEmailAndPassword(getAuth(), email.value, password.value).then((userCredential) => {
        // Signed in 
        console.log("Successfully logged in", userCredential);
        const user = userCredential.user;
        router.push("/")
        // ...
      })
      .catch((error) => {
       console.error(error.code)
        // ..
      })
}
// const { user, signUp, googleSignIn } = UserAuth();

// const handleSubmit = async (e) => {
//   e.preventDefault();

//   const methods = await fetchSignInMethodsForEmail(auth, email.value);
//   if (methods.length > 0) {
//     emailError.value = "An account with this email already exists";
//     return;
//   }
//   if (password.value !== confirmPassword.value) {
//     error.value = "Passwords do not match";
//     return;
//   }

//   try {
//     await signUp(email.value, password.value);
//     router.push("/");
//   } catch (err) {
//     console.log(err);
//     error.value = err;
//   }
// };

// const handleGoogleSignIn = async () => {
//   try {
//     await googleSignIn();
//   } catch (err) {
//     console.error(err);
//   }
// };

// onMounted(() => {
//   if (user !== null) {
//     router.push("/");
//   }
// });
</script> 
<template>
   <div class="signup-page bg-dark">
      <div class="signup-container">
        <form @submit="signUp" class="signup-form">
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
            <button @click="handleGoogleSignIn" >Google Sign in</button>
          </div>
        </div>
        <div class="or">OR</div>
      </div>
    </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap');

.signup-page{
  height: 100vh;
  width: 100%;
  max-width: 125rem;
  max-height: 60rem;
  display: flex;
  justify-content: center;
  align-items: center;

}
.signup-container {
  position: relative;
  width: 37.5rem;
  height: 25rem;
  background: #FFF;
  border-radius: 2px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.4);
}

.signup-form {
  position: absolute;
  top: 0;
  left: 0;
  box-sizing: border-box;
  padding: 2.5rem;
  width: 18.75rem;
  height: 25rem;
}

.signup-title {
  margin: 0 0 1.25rem 0;
  font-weight: 300;
  font-size: 1.75rem;
}

.signup-input {
  display: block;
  box-sizing: border-box;
  margin-bottom: 1.25rem;
  padding: 0.25rem;
  width: 13.75rem;
  height: 2rem;
  border: none;
  border-bottom: 1px solid #AAA;
  font-family: 'Roboto', sans-serif;
  font-weight: 400;
  font-size: 1rem;
  transition: 0.2s ease;
}



.signup-button {
  margin-top: 1.75rem;
  width: 7.5rem;
  height: 2rem;
  background: #16a085;
  border: none;
  border-radius: 2px;
  color: #FFF;
  font-family: 'Roboto', sans-serif;
  font-weight: 500;
  text-transform: uppercase;
  transition: 0.1s ease;
  cursor: pointer;
}

.signup-button:hover{
  background-color: #0a967a;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.4);
  transition: 0.1s ease;
}

.or {
  position: absolute;
  top: 11.25rem;
  left: 17.5rem;
  width: 2.5rem;
  height: 2.5rem;
  background: #DDD;
  border-radius: 50%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.4);
  line-height: 2.5rem;
  text-align: center;
}


.right {
  position: absolute;
  display: flex;
margin-top: 1.2rem;
  top: 0;
  right: 0;
  box-sizing: border-box;
  padding: 2.5rem;
  width: 18.75rem;
  height: 25rem;
  background: url('https://goo.gl/YbktSj');
  background-size: cover;
  background-position: center;
  border-radius: 0 2px 2px 0;
}

.social-buttons-container {
    margin-top: 7.18rem;
}


.social-signin {
  margin-bottom: 1.25rem;
  width: 13.75rem;
  height: 2.25rem;
  border: none;
  border-radius: 2px;
  color: #FFF;
  font-family: 'Roboto', sans-serif;
  transition: 0.2s ease;
  cursor: pointer;
}

.social-signin:hover,
.social-signin:focus {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.4);
  transition: 0.2s ease;
}


.signup-img2{
    margin-left: 75rem;
}
.signup-img{
    height: 31.25rem;
    position: absolute;
    margin-right: 1200px;
  
}

.login-message{
  font-size: 0.75rem;
  color: black;
}
.login-link{
    color: rgb(23, 23, 201);
    text-decoration: underline;
}

.login-title{
    margin-top: 3rem;
}

.error-message{
    color: rgb(229, 19, 19);
    margin-bottom: 1rem;
}

.error-input{
    border-bottom: 1px solid rgb(229, 19, 19);
}
</style>