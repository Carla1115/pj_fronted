<template>
  <div class="view-container">
    <div class="form-card">
      <h2>Subir imagen</h2>
      <form @submit.prevent="subirImagen">
        <input type="file" @change="seleccionarArchivo" />
        <button type="submit">Subir</button>
      </form>

      <p v-if="mensaje" :class="['message', exito ? 'success' : 'error']">{{ mensaje }}</p>

      <div v-if="urlImagen" class="preview">
        <p>Ruta de la imagen:</p>
        <code>{{ urlImagen }}</code>
        <img :src="urlImagen" alt="Vista previa" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import api from '../api'

const archivo = ref(null)
const mensaje = ref('')
const exito = ref(false)
const urlImagen = ref('')

const seleccionarArchivo = (e) => {
  archivo.value = e.target.files[0]
}

const subirImagen = async () => {
  if (!archivo.value) {
    mensaje.value = 'Selecciona un archivo antes de subir'
    exito.value = false
    return
  }

  const formData = new FormData()
  formData.append('file', archivo.value)

  try {
    const res = await api.post('/upload_image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    mensaje.value = res.data.mensaje
    urlImagen.value = res.data.url
    exito.value = true
  } catch (err) {
    console.error(err)
    mensaje.value = 'Error al subir la imagen'
    exito.value = false
  }
}
</script>

<style scoped>
.preview {
  margin-top: 1rem;
  text-align: center;
}
.preview img {
  margin-top: 1rem;
  max-width: 200px;
  border-radius: 10px;
}
</style>
