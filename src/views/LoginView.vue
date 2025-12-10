<template>
  <div class="view-container">
    <div class="form-card">
      <h2>{{ modoRegistro ? 'Crear cuenta' : 'Iniciar sesión' }}</h2>

      <form @submit.prevent="modoRegistro ? register() : login()">
        <input v-model="username" placeholder="Usuario" />
        <input v-model="password" type="password" placeholder="Contraseña" />

        <button type="submit">
          {{ modoRegistro ? 'Registrarse' : 'Entrar' }}
        </button>
      </form>

      <!-- Mensaje de error o éxito -->
      <p v-if="mensaje" :class="exito ? 'success' : 'error'">
        {{ mensaje }}
      </p>

      <!-- Enlace para cambiar modo -->
      <p class="toggle-text">
        {{ modoRegistro ? '¿Ya tienes cuenta?' : '¿No tienes cuenta?' }}
        <a href="#" @click.prevent="modoRegistro = !modoRegistro">
          {{ modoRegistro ? 'Inicia sesión aquí' : 'Regístrate aquí' }}
        </a>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '../api'

const username = ref('')
const password = ref('')
const mensaje = ref('')
const exito = ref(false)
const modoRegistro = ref(false) // alterna entre login y registro
const router = useRouter()

const login = async () => {
  try {
    const res = await api.post(
      '/login',
      {
        username: username.value,
        password: password.value,
      },
      { withCredentials: true }
    )

    console.log("Respuesta del servidor:", res.data)

    // Guardamos si el usuario es admin en localStorage
    if (res.data.is_superuser === true) {
      localStorage.setItem('isAdmin', 'true')
    } else {
      localStorage.removeItem('isAdmin')
    }

    // Redirigimos al panel de juegos
    router.push('/juegos')
  } catch (err) {
    console.error('Error al iniciar sesión:', err)
    mensaje.value = 'Error al iniciar sesión'  // 👈 aquí estaba mal
    exito.value = false
  }
}


// ---- REGISTRO ----
const register = async () => {
  try {
    const res = await api.post('/register', {
      username: username.value,
      password: password.value,
    })
    mensaje.value = res.data.mensaje
    exito.value = true
    modoRegistro.value = false
  } catch (err) {
    console.error(err)
    mensaje.value = err.response?.data?.mensaje || 'Error al registrarse'
    exito.value = false
  }
}
</script>

<style scoped>
.form-card {
  background: rgba(255, 255, 255, 0.12);
  padding: 2.5rem 3rem;
  border-radius: 16px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.5);
  text-align: center;
  min-width: 340px;
  animation: fadeIn 0.6s ease-out;
}

.form-card input {
  width: 100%;
  padding: 0.7rem;
  margin: 0.5rem 0;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
}

.form-card button {
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.7rem 1.4rem;
  cursor: pointer;
  font-weight: bold;
  margin-top: 1rem;
  transition: background-color 0.2s ease, transform 0.2s ease;
}

.form-card button:hover {
  background-color: #34d058;
  transform: scale(1.05);
}

.success {
  color: #00e676;
  font-weight: bold;
  margin-top: 1rem;
}

.error {
  color: #ff5252;
  font-weight: bold;
  margin-top: 1rem;
}

.toggle-text {
  margin-top: 1rem;
  color: #ddd;
  font-size: 0.9rem;
}

.toggle-text a {
  color: #ffcc00;
  text-decoration: none;
  font-weight: bold;
}

.toggle-text a:hover {
  text-decoration: underline;
}
</style>
