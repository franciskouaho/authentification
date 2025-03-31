import User from '#models/user'
import { HttpContext } from '@adonisjs/core/http'
import { loginValidator, registerValidator } from '#validators/auth'
import { AccessToken } from '@adonisjs/auth/access_tokens'
import hash from '@adonisjs/core/services/hash'

export default class AuthController {
  async login({ request, response }: HttpContext) {
    try {
      const { email, password } = await request.validateUsing(loginValidator)
      const user = await User.findBy('email', email)

      if (!user || !(await hash.verify(user.password, password))) {
        return response.unauthorized({
          status: 'error',
          message: 'Invalid credentials',
        })
      }

      const token = await User.accessTokens.create(user, {
        name: 'mobile_app_token',
        expiresIn: '30 days',
      })

      return response.ok({
        status: 'success',
        data: {
          token: token.value?.release(),
          user: {
            id: user.id,
            email: user.email,
            fullName: user.fullName,
          },
        },
      })
    } catch (error) {
      return response.badRequest({
        status: 'error',
        message: 'Invalid request data',
      })
    }
  }

  async register({ request, response }: HttpContext) {
    try {
      const userData = await request.validateUsing(registerValidator)

      const existingUser = await User.findBy('email', userData.email)
      if (existingUser) {
        return response.conflict({
          status: 'error',
          message: 'Email already registered',
        })
      }

      const user = await User.create(userData)
      const token = await User.accessTokens.create(user, {
        name: 'mobile_app_token',
        expiresIn: '30 days',
      })

      return response.created({
        status: 'success',
        data: {
          token: token.value?.release(),
          user: {
            id: user.id,
            email: user.email,
            fullName: user.fullName,
          },
        },
      })
    } catch (error) {
      return response.badRequest({
        status: 'error',
        message: 'Invalid request data',
      })
    }
  }

  async logout({ auth, response }: HttpContext) {
    try {
      const user = auth.user!
      await auth.use('api').revoke()

      return response.ok({
        status: 'success',
        message: 'Logged out successfully',
      })
    } catch (error) {
      return response.internalServerError({
        status: 'error',
        message: 'Error during logout',
      })
    }
  }

  async me({ auth, response }: HttpContext) {
    try {
      const user = auth.user!
      return response.ok({
        status: 'success',
        data: {
          user: {
            id: user.id,
            email: user.email,
            fullName: user.fullName,
          },
        },
      })
    } catch (error) {
      return response.unauthorized({
        status: 'error',
        message: 'Unauthorized',
      })
    }
  }
}
