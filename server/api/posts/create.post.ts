export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { title, content, labels } = body

  if (!title || !content) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Title and content are required'
    })
  }

  try {
    const blogger = new BloggerClient()
    const result = await blogger.createPost(
      title, 
      content, 
      labels || []
    )
    
    return {
      success: true,
      data: result,
      message: 'Post created successfully'
    }
  } catch (error: any) {
    console.error('Create post error:', error)
    
    if (error.message.includes('Not authenticated')) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Not authenticated. Please login first.'
      })
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to create post'
    })
  }
})