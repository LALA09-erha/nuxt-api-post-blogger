<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Login to Blogger
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Connect your Blogger account to start posting
        </p>
      </div>
      
      <div class="mt-8 space-y-6">
        <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {{ error }}
        </div>
        
        <button
          @click="login"
          :disabled="loading"
          class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          <span v-if="loading">Connecting...</span>
          <span v-else>Login with Google Blogger</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
const loading = ref(false)
const error = ref('')

const login = async () => {
  try {
    loading.value = true
    error.value = ''
    
    const { data } = await useFetch('/api/auth/blogger-auth')
    
    if (data.value?.url) {
      window.location.href = data.value.url
    } else {
      error.value = 'Failed to get auth URL'
    }
  } catch (err) {
    error.value = err.message || 'Login failed'
  } finally {
    loading.value = false
  }
}
</script>