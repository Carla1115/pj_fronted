<template>
  <div id="app" class="app-container">
    <!-- CABECERA -->
    <header class="portal-header">
      <h1>PORTAL DE JUEGOS</h1>
      <nav class="portal-nav">
        <router-link to="/login">Login</router-link>

        <!-- 👇 Cambia dinámicamente el nombre del enlace según el rol -->
        <router-link to="/juegos">
          {{ esAdmin ? 'Editar Juegos' : 'Juegos' }}
        </router-link>

        <router-link v-if="esAdmin" to="/nuevo">Añadir Juego</router-link>
        <router-link v-if="esAdmin" to="/subir-imagen">Subir Imagen</router-link>
      </nav>
    </header>

    <!-- CONTENIDO PRINCIPAL -->
    <main class="portal-main">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const esAdmin = ref(false)
const router = useRouter()

// 🔄 Comprueba si eres admin cada vez que se cambia de ruta
const checkAdmin = () => {
  const adminFlag = localStorage.getItem('isAdmin')
  esAdmin.value = adminFlag === 'true'
  console.log("¿Admin?:", esAdmin.value)
}

onMounted(() => {
  checkAdmin()
  router.afterEach(() => {
    checkAdmin()
  })
})
</script>

<style>
@import "./assets/style.css";
</style>
