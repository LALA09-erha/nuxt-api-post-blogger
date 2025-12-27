import { google } from 'googleapis'
import { useRuntimeConfig } from '#imports'

export class BloggerClient {
  private oauth2Client: any
  private blogger: any
  private blogId: string
  private redirectUri: string

  constructor() {
    // Gunakan runtime config atau fallback ke process.env
    const config = useRuntimeConfig()
    
    // Tetap gunakan nama variabel yang sama untuk kompatibilitas
    this.blogId = process.env.BLOGGER_BLOG_ID || '4541613134943100474'
    this.redirectUri = process.env.BLOGGER_REDIRECT_URI || 'http://localhost:3000/api/auth/blogger-callback'
    
    // Ambil credentials dari environment variables
    const clientId = process.env.BLOGGER_CLIENT_ID
    const clientSecret = process.env.BLOGGER_CLIENT_SECRET
    
    if (!clientId || !clientSecret) {
      throw new Error('BLOGGER_CLIENT_ID and BLOGGER_CLIENT_SECRET must be set in environment variables')
    }
    
    // Inisialisasi OAuth2 client
    this.oauth2Client = new google.auth.OAuth2(
      clientId,
      clientSecret,
      this.redirectUri
    )
    
    // Set refresh token jika ada di environment
    if (process.env.BLOGGER_REFRESH_TOKEN) {
      this.oauth2Client.setCredentials({
        refresh_token: process.env.BLOGGER_REFRESH_TOKEN
      })
    }
    
    // Inisialisasi Blogger API
    this.blogger = google.blogger({
      version: 'v3',
      auth: this.oauth2Client
    })
  }

  // NAMA FUNGSI TIDAK BERUBAH
  getAuthUrl() {
    const scopes = [
      'https://www.googleapis.com/auth/blogger'
    ]
    
    return this.oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes,
      prompt: 'consent'
    })
  }

  // NAMA FUNGSI TIDAK BERUBAH
  async setCredentials(code: string) {
    try {
      const { tokens } = await this.oauth2Client.getToken(code)
      this.oauth2Client.setCredentials(tokens)
      
      // Kembalikan tokens sama seperti sebelumnya
      return tokens
    } catch (error: any) {
      console.error('Error getting tokens:', error)
      throw error
    }
  }

  // NAMA FUNGSI TIDAK BERUBAH - tapi logikanya diubah
  async loadSavedTokens() {
    try {
      // Cek apakah ada refresh token di environment
      const refreshToken = process.env.BLOGGER_REFRESH_TOKEN
      
      if (refreshToken) {
        // Set credentials dengan refresh token
        this.oauth2Client.setCredentials({
          refresh_token: refreshToken
        })
        
        // Verifikasi token masih valid
        try {
          await this.oauth2Client.refreshAccessToken()
          return true
        } catch (refreshError) {
          console.warn('Refresh token expired or invalid')
          return false
        }
      }
      
      return false
    } catch (error) {
      console.error('Error loading tokens:', error)
      return false
    }
  }

  // NAMA FUNGSI TIDAK BERUBAH
  async createPost(title: string, content: string, labels: string[] = []) {
    // Tetap panggil loadSavedTokens() untuk kompatibilitas
    if (!await this.loadSavedTokens()) {
      throw new Error('Not authenticated. Please login first.')
    }

    try {
      const response = await this.blogger.posts.insert({
        blogId: this.blogId,
        requestBody: {
          title,
          content,
          labels,
          status: 'DRAFT' // atau 'PUBLISHED' untuk langsung publish
        }
      })
      
      return response.data
    } catch (error: any) {
      console.error('Error creating post:', error)
      throw error
    }
  }

  // NAMA FUNGSI TIDAK BERUBAH
  async getBlogInfo() {
    if (!await this.loadSavedTokens()) {
      throw new Error('Not authenticated')
    }

    try {
      const response = await this.blogger.blogs.get({
        blogId: this.blogId
      })
      
      return response.data
    } catch (error: any) {
      console.error('Error getting blog info:', error)
      throw error
    }
  }

  // Fungsi tambahan (opsional) untuk mendapatkan refresh token
  async getRefreshToken(code: string): Promise<string> {
    try {
      const tokens = await this.setCredentials(code)
      
      // Kembalikan refresh token untuk disimpan di .env
      if (tokens.refresh_token) {
        console.log('=== COPY THIS TO YOUR .env FILE ===')
        console.log(`BLOGGER_REFRESH_TOKEN=${tokens.refresh_token}`)
        console.log('===================================')
        return tokens.refresh_token
      } else {
        throw new Error('No refresh token received. Make sure to request offline access.')
      }
    } catch (error: any) {
      console.error('Error getting refresh token:', error)
      throw error
    }
  }

  // Fungsi tambahan untuk check auth status
  async checkAuthStatus(): Promise<boolean> {
    return await this.loadSavedTokens()
  }
}