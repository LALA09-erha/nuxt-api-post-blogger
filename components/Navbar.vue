<template>
  <nav class="bg-white shadow">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <div class="flex items-center">
          <NuxtLink to="/" class="text-xl font-bold text-gray-800">
            Blogger Publisher
          </NuxtLink>
        </div>
        
        <div class="flex items-center space-x-4">
          <NuxtLink 
            to="/" 
            class="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
          >
            Home
          </NuxtLink>
          <NuxtLink 
            to="/create" 
            class="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
          >
            Create Post
          </NuxtLink>
        </div>
      </div>
    </div>
  </nav>
</template>