export default defineEventHandler(async (event) => {
  const blogger = new BloggerClient()
  const authUrl = blogger.getAuthUrl()
  
  return { 
    success: true, 
    url: authUrl 
  }
})