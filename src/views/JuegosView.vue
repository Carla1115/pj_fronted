<template>
  <div>
    <div class="search-bar">
      <!-- BUSCADOR -->
        <input
          v-model="filtroNombre"
          placeholder="🔍 Buscar juego o palabra clave..."
          list="sugerencias"
        />
        <datalist id="sugerencias">
          <option
            v-for="juego in juegos"
            :key="juego.id"
            :value="juego.titulo"
          >
            {{ juego.genero }}
          </option>
        </datalist>

        <!-- FILTRO POR AÑO -->
        <select v-model="filtroAnio">
          <option value="">Todos los años</option>
          <option v-for="anio in aniosDisponibles" :key="anio">
            {{ anio }}
          </option>
        </select>

        <!-- FILTRO POR GÉNERO -->
        <select v-model="filtroGenero">
          <option value="">Todos los géneros</option>
          <option
            v-for="genero in generosDisponibles"
            :key="genero"
          >
            {{ genero }}
          </option>
        </select>

        <!-- BOTONES -->
        <button @click="filtrarJuegos">Buscar</button>
        <button @click="resetFiltros">Reiniciar</button>
</div>

    <p v-if="mensaje" :class="['message', esError ? 'error' : 'success']">{{ mensaje }}</p>

    <div class="games-grid">
      <div v-for="juego in juegosFiltrados" :key="juego.id" class="game-card">
        
        <img
          v-if="juego.imagen"
          :src="formatearImagen(juego.imagen)"
          alt="Imagen del juego"
          class="game-image"
        />


        <a 
          v-if="juego.url" 
          :href="juego.url" 
          target="_blank" 
          rel="noopener noreferrer" 
          class="game-link"
        >
          <div class="game-title">{{ juego.titulo }}</div>
        </a>
        <div v-else class="game-title">{{ juego.titulo }}</div>

        <div class="game-info">Género: {{ juego.genero }}</div>
        <div class="game-info">Año: {{ juego.anio }}</div>

        <div class="game-buttons" v-if="isAdmin">
          <button class="edit" @click="editar(juego)">✏️ Editar</button>
          <button class="delete" @click="eliminar(juego.id)">🗑️ Eliminar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import api from '../api'

const backendURL = "https://pj-backend-bs1t.onrender.com";

const formatearImagen = (img) => {
  if (!img) return "";

  // Si es URL externa → dejarla tal cual
  if (img.startsWith("http")) {
    return img;
  }

  // Si es archivo servido por el backend
  return backendURL + img;
};

const juegos = ref([])
const filtroNombre = ref('')
const filtroAnio = ref('')
const filtroGenero = ref('')
const mensaje = ref('')
const esError = ref(false)
const isAdmin = localStorage.getItem('isAdmin') === 'true'

const cargarJuegos = async () => {
  try {
    const res = await api.get('/juegos')
    console.log('Datos recibidos:', res.data)
    juegos.value = res.data
  } catch (err) {
    console.error(err)
  }
}

onMounted(cargarJuegos)

const aniosDisponibles = computed(() => {
  const lista = juegos.value.map(j => j.anio)
  return [...new Set(lista)].sort((a, b) => a - b)
})

const generosDisponibles = computed(() => {
  const lista = juegos.value.map(j => j.genero).filter(g => g)
  return [...new Set(lista)].sort()
})


const juegosFiltrados = computed(() => {
  const texto = filtroNombre.value.toLowerCase().trim()

  return juegos.value.filter(j => {
    const titulo = j.titulo?.toLowerCase() || ''
    const genero = j.genero?.toLowerCase() || ''
    const coincideTexto =
      titulo.includes(texto) || genero.includes(texto)
    const coincideAnio =
      !filtroAnio.value || j.anio == filtroAnio.value
    const coincideGenero =
      !filtroGenero.value || j.genero === filtroGenero.value

    return coincideTexto && coincideAnio && coincideGenero
  })
})

const filtrarJuegos = () => {} // la lógica está en el computed

const resetFiltros = () => {
  filtroNombre.value = ''
  filtroAnio.value = ''
}

const eliminar = async (id) => {
  if (confirm('¿Seguro que quieres eliminar este juego?')) {
    try {
      await api.delete(`/juegos/${id}`, { withCredentials: true })
      mensaje.value = "Juego eliminado correctamente"
      esError.value = false
      cargarJuegos()
    } catch (err) {
      console.error(err)
      mensaje.value = "Error al eliminar (¿sesión expirada?)"
      esError.value = true
    }
  }
}

const editar = async (juego) => {
  const contenedor = document.createElement('div')
  contenedor.innerHTML = `
    <div style="
      position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
      background: rgba(0,0,0,0.6); display: flex; justify-content: center; align-items: center;
      z-index: 9999;
    ">
      <div style="background: #2b0050; color: white; padding: 2rem; border-radius: 12px; min-width: 350px;">
        <h3 style="text-align:center;">Editar Juego</h3>
        <label>Título</label><br/>
        <input id="titulo" type="text" value="${juego.titulo}" style="width:100%;margin-bottom:10px;"/><br/>
        <label>Género</label><br/>
        <input id="genero" type="text" value="${juego.genero}" style="width:100%;margin-bottom:10px;"/><br/>
        <label>Año</label><br/>
        <input id="anio" type="number" value="${juego.anio}" style="width:100%;margin-bottom:10px;"/><br/>
        <label>URL</label><br/>
        <input id="url" type="text" value="${juego.url || ''}" style="width:100%;margin-bottom:15px;"/><br/>
        <div style="text-align:center;">
        <label>URL de la imagen</label><br/>
        <input id="imagen" type="text" value="${juego.imagen || ''}" style="width:100%;margin-bottom:15px;"/><br/>
          <button id="guardar" style="background:#ffcc00;color:black;padding:0.5rem 1rem;border:none;border-radius:8px;margin-right:10px;">Guardar</button>
          <button id="cancelar" style="background:#999;color:white;padding:0.5rem 1rem;border:none;border-radius:8px;">Cancelar</button>
        </div>
      </div>
    </div>
  `
  document.body.appendChild(contenedor)

  contenedor.querySelector('#cancelar').onclick = () => contenedor.remove()

  contenedor.querySelector('#guardar').onclick = async () => {
    const nuevoTitulo = contenedor.querySelector('#titulo').value
    const nuevoGenero = contenedor.querySelector('#genero').value
    const nuevoAnio = contenedor.querySelector('#anio').value
    const nuevaUrl = contenedor.querySelector('#url').value
    const nuevaImagen = contenedor.querySelector('#imagen').value

    try {
      await api.put(
        `/juegos/${juego.id}`,
        {
          titulo: nuevoTitulo,
          genero: nuevoGenero,
          anio: nuevoAnio,
          url: nuevaUrl,
          imagen: nuevaImagen,
        },
        { withCredentials: true }
      )
      mensaje.value = "Juego actualizado correctamente"
      esError.value = false
      cargarJuegos()
    } catch (err) {
      console.error(err)
      mensaje.value = "Error al editar (¿sesión expirada?)"
      esError.value = true
    } finally {
      contenedor.remove()
    }
  }
}

</script>
