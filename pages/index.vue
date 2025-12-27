<template>
  <div class="min-h-screen bg-gray-50">
    <Navbar />
    
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <!-- Hero Section -->
      <div class="text-center py-12">
        <h1 class="text-4xl font-bold text-gray-900 mb-4">
          Blogger Article Publisher
        </h1>
        <p class="text-xl text-gray-600 mb-8">
          Upload and manage your Blogger articles easily
        </p>
        
        <!-- Call to Action Buttons -->
        <div class="flex justify-center space-x-4">
          <NuxtLink 
            to="/create" 
            class="px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition"
          >
            Create New Post
          </NuxtLink>
          
          <NuxtLink 
            to="/login" 
            class="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50 transition"
          >
            Login to Blogger
          </NuxtLink>
        </div>
      </div>

      <!-- Features Grid -->
      <div class="grid md:grid-cols-3 gap-8 mt-12">
        <div class="bg-white p-6 rounded-lg shadow">
          <h3 class="text-lg font-semibold text-gray-900 mb-3">Easy Writing</h3>
          <p class="text-gray-600">Create articles with a clean, distraction-free editor</p>
        </div>
        
        <div class="bg-white p-6 rounded-lg shadow">
          <h3 class="text-lg font-semibold text-gray-900 mb-3">Direct to Blogger</h3>
          <p class="text-gray-600">Publish directly to your Blogger blog via API</p>
        </div>
        
        <div class="bg-white p-6 rounded-lg shadow">
          <h3 class="text-lg font-semibold text-gray-900 mb-3">Manage Content</h3>
          <p class="text-gray-600">Save drafts or publish immediately</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Halaman ini akan otomatis menjadi halaman utama di URL: /
</script>