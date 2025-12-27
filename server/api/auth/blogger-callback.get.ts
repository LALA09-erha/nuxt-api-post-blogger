export default defineEventHandler(async (event) => {
  const { code } = getQuery(event)
  
  if (!code) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Code parameter is required'
    })
  }

  try {
    const blogger = new BloggerClient()
    await blogger.setCredentials(code as string)
    
    // Redirect ke halaman create
    await sendRedirect(event, '/create', 302)
  } catch (error) {
    console.error('Auth error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Authentication failed'
    })
  }
})