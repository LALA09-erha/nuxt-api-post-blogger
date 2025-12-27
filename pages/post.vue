<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-4xl mx-auto px-4">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Create New Blog Post</h1>
        <p class="text-gray-600 mt-2">Create and publish posts to your Blogger blog</p>
      </div>

      <!-- Form -->
      <div class="bg-white rounded-lg shadow p-6">
        <!-- Status Messages -->
        <div v-if="successMessage" class="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded">
          {{ successMessage }}
          <a v-if="postUrl" :href="postUrl" target="_blank" class="ml-2 font-medium underline">
            View Post
          </a>
        </div>
        
        <div v-if="error" class="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded">
          {{ error }}
        </div>

        <!-- Form Fields -->
        <div class="space-y-6">
          <!-- Title -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Title
            </label>
            <input
              v-model="form.title"
              type="text"
              class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter post title"
            />
          </div>

          <!-- Content Editor -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Content
            </label>
            <div class="border border-gray-300 rounded-md">
              <textarea
                v-model="form.content"
                rows="15"
                class="w-full px-4 py-3 border-0 focus:ring-0 min-h-[300px]"
                placeholder="Write your post content here..."
              />
            </div>
            <p class="mt-2 text-sm text-gray-500">
              Supports HTML. You can use basic HTML tags for formatting.
            </p>
          </div>

          <!-- Labels -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Labels (comma separated)
            </label>
            <input
              v-model="form.labels"
              type="text"
              class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="technology, programming, web"
            />
          </div>

          <!-- Action Buttons -->
          <div class="flex justify-end space-x-4 pt-6 border-t">
            <button
              @click="saveAsDraft"
              :disabled="loading"
              class="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50"
            >
              Save as Draft
            </button>
            <button
              @click="publish"
              :disabled="loading"
              class="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {{ loading ? 'Publishing...' : 'Publish Now' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Tips -->
      <div class="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 class="text-lg font-medium text-blue-900 mb-2">Tips for Blogger Posts</h3>
        <ul class="text-blue-800 space-y-2">
          <li class="flex items-start">
            <span class="mr-2">•</span>
            <span>Use HTML tags for formatting: &lt;b&gt;, &lt;i&gt;, &lt;a&gt;, &lt;ul&gt;, &lt;li&gt;</span>
          </li>
          <li class="flex items-start">
            <span class="mr-2">•</span>
            <span>Add images by uploading to Blogger directly or using image URLs</span>
          </li>
          <li class="flex items-start">
            <span class="mr-2">•</span>
            <span>Labels help organize your posts and improve SEO</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
const form = reactive({
  title: '',
  content: '',
  labels: '',
  status: 'DRAFT'
})

const loading = ref(false)
const error = ref('')
const successMessage = ref('')
const postUrl = ref('')

const parseLabels = () => {
  if (!form.labels) return []
  return form.labels.split(',').map(label => label.trim()).filter(label => label)
}

const saveAsDraft = async () => {
  await submitPost('DRAFT')
}

const publish = async () => {
  await submitPost('PUBLISHED')
}

const submitPost = async (status) => {
  if (!form.title.trim() || !form.content.trim()) {
    error.value = 'Title and content are required'
    return
  }

  try {
    loading.value = true
    error.value = ''
    successMessage.value = ''
    postUrl.value = ''

    const labels = parseLabels()
    
    const { data, error: apiError } = await useFetch('/api/posts/create', {
      method: 'POST',
      body: {
        ...form,
        labels,
        status
      }
    })

    if (apiError.value) {
      if (apiError.value.statusCode === 401) {
        // Redirect to login if not authenticated
        navigateTo('/login')
        return
      }
      throw new Error(apiError.value.message || 'Failed to create post')
    }

    if (data.value?.success) {
      successMessage.value = `Post ${status === 'DRAFT' ? 'saved as draft' : 'published successfully'}!`
      
      // Generate post URL
      if (data.value.data?.url) {
        postUrl.value = data.value.data.url
      }
      
      // Reset form if published
      if (status === 'PUBLISHED') {
        form.title = ''
        form.content = ''
        form.labels = ''
      }
    }
  } catch (err) {
    error.value = err.message
    console.error('Submit error:', err)
  } finally {
    loading.value = false
  }
}

// Check authentication on page load
onMounted(async () => {
  // You could add a check here to verify the user is authenticated
  // by trying to get blog info or checking session
})
</script>