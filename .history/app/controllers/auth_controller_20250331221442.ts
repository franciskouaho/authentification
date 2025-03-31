import User from '#models/user'
import { HttpContext } from '@adonisjs/core/http'
import { loginValidator, registerValidator } from '#validators/auth'
import { AccessToken } from '@adonisjs/auth/access_tokens'
import hash from '@adonisjs/core/services/hash'

export default class AuthController {
  /**
   * Traite la demande de connexion d'un utilisateur
   */
  async login({ request, response }: HttpContext) {
    const { email, password } = await request.validateUsing(loginValidator)

    try {
      const user: User | null = await User.findBy('email', email)

      if (!user) {
        response.abort('Invalid credentials')
        return
      }

      const passwordVerification = await hash.verify(user.password, password)

      if (!passwordVerification) {
        response.abort('Invalid credentials')
        return
      }

      const token: AccessToken = await User.accessTokens.create(user)

      return response.created({
        token: token.value?.release(),
        user: {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
          createdAt: user.createdAt,
        },
      })
    } catch (error) {
      return response.unauthorized({
        message: 'Les identifiants fournis sont incorrects',
      })
    }
  }

  /**
   * Traite l'inscription d'un nouvel utilisateur
   */
  async register({ request, response }: HttpContext) {
    const userData = await request.validateUsing(registerValidator)
    const { email, password, fullName, app_source } = userData

    const existingUser: User | null = await User.findBy('email', email)

    if (existingUser) {
      return response.conflict({
        message: 'Un compte existe déjà avec cette adresse email',
      })
    }

    try {
      const user: User = await User.create({
        email,
        password,
        fullName,
        appSource: app_source,
        isPremium: false, // par défaut, l'utilisateur n'est pas premium
      })

      const token: AccessToken = await User.accessTokens.create(user)

      return response.created({
        token: token.value?.release(),
        user: {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
          appSource: user.appSource,
          isPremium: user.isPremium,
          createdAt: user.createdAt,
        },
      })
    } catch (error) {
      console.error("Erreur lors de l'inscription:", error)
      return response.internalServerError({
        message: "Une erreur est survenue lors de l'inscription",
      })
    }
  }

  /**
   * Déconnecte un utilisateur en révoquant son token
   */
  async logout({ auth, response }: HttpContext) {
    await auth.use('api').authenticate()

    return response.ok({
      message: 'Déconnecté avec succès',
    })
  }

  /**
   * Retourne les informations de l'utilisateur connecté
   */
  async me({ auth, response }: HttpContext) {
    const user = auth.user!

    return response.ok({
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      appSource: user.appSource,
      isPremium: user.isPremium,
      createdAt: user.createdAt,
    })
  }
}
