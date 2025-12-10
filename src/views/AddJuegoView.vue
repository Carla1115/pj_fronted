<template>
  <div class="view-container">
    <div class="form-card">
      <h2>Añadir Juego</h2>
      <form @submit.prevent="addJuego">
        <input v-model="titulo" placeholder="Título" />
        <input v-model="anio" placeholder="Año" type="number" />
        <input v-model="genero" placeholder="Género" />
        <input v-model="url" placeholder="URL del juego" />
        <input v-model="imagen" placeholder="URL de la imagen (opcional)" />

        <button type="submit">Añadir</button>
      </form>
    </div>
  </div>
</template>


<script setup>
import { ref } from 'vue'
import api from '../api'

const titulo = ref('')
const genero = ref('')
const anio = ref('')
const url = ref('')
const imagen = ref('')
const mensaje = ref('')
const exito = ref(false)

const addJuego = async () => {
  try {
    await api.post(
      '/juegos',
      {
        titulo: titulo.value,
        genero: genero.value,
        anio: anio.value,
        url: url.value,
        imagen: imagen.value,
      },
      { withCredentials: true } // fuerza envío de cookie
    )
    mensaje.value = 'Juego añadido correctamente'
    exito.value = true
    titulo.value = genero.value = anio.value = url.value =''
  } catch (err) {
    console.error(err)
    mensaje.value = 'Error al añadir el juego (¿login requerido?)'
    exito.value = false
  }
}
</script>

<style scoped>
.form-container {
  max-width: 400px;
  margin: 2rem auto;
}
input, button {
  display: block;
  width: 100%;
  margin: .5rem 0;
  padding: .6rem;
  font-size: 1rem;
}
button {
  background: #28a745;
  color: white;
  border: none;
  border-radius: 8px;
}
button:hover {
  background: #218838;
}
</style>
