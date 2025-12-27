import { google } from 'googleapis'
import { useRuntimeConfig } from '#imports'
import {saveRefreshToken , getRefreshToken} from '~/server/repositories/oauthToken.repository'

export class BloggerClient {
  private oauth2Client: any
  private blogger: any
  private blogId: string
  private redirectUri: string

  constructor() {
    const config = useRuntimeConfig()

    this.blogId = process.env.BLOGGER_BLOG_ID || '4541613134943100474'
    this.redirectUri =
      process.env.BLOGGER_REDIRECT_URI ||
      'http://localhost:3000/api/auth/blogger-callback'

    const clientId = process.env.BLOGGER_CLIENT_ID
    const clientSecret = process.env.BLOGGER_CLIENT_SECRET

    if (!clientId || !clientSecret) {
      throw new Error('BLOGGER_CLIENT_ID and BLOGGER_CLIENT_SECRET must be set')
    }

    this.oauth2Client = new google.auth.OAuth2(
      clientId,
      clientSecret,
      this.redirectUri
    )

    this.blogger = google.blogger({
      version: 'v3',
      auth: this.oauth2Client
    })
  }

  // ========= TIDAK DIUBAH =========
  getAuthUrl() {
    return this.oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: ['https://www.googleapis.com/auth/blogger'],
      prompt: 'consent'
    })
  }

  // ========= TIDAK DIUBAH =========
  async setCredentials(code: string) {
    try {
      const { tokens } = await this.oauth2Client.getToken(code)
      this.oauth2Client.setCredentials(tokens)

      // 🔐 SIMPAN refresh token ke MongoDB
      if (tokens.refresh_token) {
        await saveRefreshToken(tokens.refresh_token)
      }

      return tokens
    } catch (error) {
      console.error('Error getting tokens:', error)
      throw error
    }
  }

  // ========= TIDAK DIUBAH =========
  async loadSavedTokens() {
    try {
      const tokenDoc = await getRefreshToken();
      console.log('Loaded tokenDoc:', tokenDoc);
      if (!tokenDoc) return false

      this.oauth2Client.setCredentials({
        refresh_token: tokenDoc
      })
      try {
        await this.oauth2Client.refreshAccessToken()
        return true
      } catch {
        console.warn('Refresh token expired or invalid')
        return false
      }
    } catch (error) {
      console.error('Error loading tokens:', error)
      return false
    }
  }

  // ========= TIDAK DIUBAH =========
  async createPost(title: string, content: string, labels: string[] = []) {
    if (!await this.loadSavedTokens()) {
      throw new Error('Not authenticated. Please login first.')
    }
    const response = await this.blogger.posts.insert({
      blogId: this.blogId,
      requestBody: {
        title,
        content,
        labels,
        status: 'DRAFT'
      }
    })

    return response.data
  }

  // ========= TIDAK DIUBAH =========
  async getBlogInfo() {
    if (!await this.loadSavedTokens()) {
      throw new Error('Not authenticated')
    }

    const response = await this.blogger.blogs.get({
      blogId: this.blogId
    })

    return response.data
  }

  // ========= TIDAK DIUBAH =========
  async getRefreshToken(code: string): Promise<string> {
    const tokens = await this.setCredentials(code)

    if (!tokens.refresh_token) {
      throw new Error('No refresh token received')
    }

    return tokens.refresh_token
  }

  // ========= TIDAK DIUBAH =========
  async checkAuthStatus(): Promise<boolean> {
    return await this.loadSavedTokens()
  }
}
