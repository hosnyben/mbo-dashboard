<template>
    <section class="bg-gray-50 dark:bg-gray-900">
        <div class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
            <a href="#" class="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
                <img class="w-25 h-12 mr-2" src="@/assets/logo.svg" alt="logo" />   
            </a>
            <div class="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
                    <h1 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">Accedez à votre compte</h1>
                    <Form @submit="handleLogin" :validation-schema="schema" class="space-y-4 md:space-y-6">
                        <div>
                            <label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Votre identifiant</label>
                            <Field name="username" type="text" placeholder="identifiant" class="form-control bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-200 focus:border-primary-200 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                            <ErrorMessage name="username" class="text-red-200 text-xs" />
                        </div>
                        <div>
                            <label for="password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Mot de passe</label>
                            <Field name="password" type="password" placeholder="••••••••" class="form-control bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-200 focus:border-primary-200 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                            <ErrorMessage name="password" class="text-red-200 text-xs" />
                        </div>
                        <!-- <div class="flex items-center justify-between">
                            <div class="flex items-start">
                                <div class="flex items-center h-5">
                                    <input id="remember" aria-describedby="remember" type="checkbox" class="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-200 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-200 dark:ring-offset-gray-800" required="">
                                </div>
                                <div class="ml-3 text-sm">
                                    <label for="remember" class="text-gray-500 dark:text-gray-300">Remember me</label>
                                </div>
                            </div>
                            <a href="#" class="text-sm font-medium text-primary-200 hover:underline dark:text-primary-200">Forgot password?</a>
                        </div> -->
                        <button type="submit" class="cursor-pointer w-full text-white bg-primary-200 hover:bg-primary-200 focus:ring-4 focus:outline-none focus:ring-primary-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-100 dark:hover:bg-primary-200 dark:focus:ring-primary-200 disabled:bg-gray-500 disabled:hover:bg-gray-500" :disabled="loading">Connection</button>
                        <!-- <p class="text-sm font-light text-gray-500 dark:text-gray-400">
                            Don’t have an account yet? <a href="#" class="font-medium text-primary-200 hover:underline dark:text-primary-200">Sign up</a>
                        </p> -->
                        <div v-if="message" class="alert alert-danger dark:text-white text-gray-500" role="alert">
                            <div v-html="message" class=""></div>
                        </div>
                    </Form>
                </div>
            </div>
        </div>
    </section>
</template>
<script setup>
import { Form, Field, ErrorMessage } from "vee-validate";
import * as yup from "yup";
</script>

<script>
export default {
    data() {
        const schema = yup.object().shape({
            username: yup.string().required("Identifiant obligatoire!"),
            password: yup.string().required("Mot de passe obligatoire!"),
        });
        return {
            loading: false,
            message: "",
            schema,
        };
    },
    computed: {
        loggedIn() {
            return this.$store.state.auth.status.loggedIn;
        },
    },
    created() {
        if (this.loggedIn) {
            this.$router.push("/");
        }
    },
    methods: {
        handleLogin(user) {
            this.loading = false;
            this.$store.dispatch("auth/login", user).then(
            () => {
                this.$router.push("/");
            },
            (error) => {
                this.loading = false;
                this.message =
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.message ||
                error.toString();
            }
            );
        },
    },
};
</script>