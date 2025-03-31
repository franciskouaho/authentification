import vine from '@vinejs/vine'

/**
 * Validateur pour la connexion
 */
export const loginValidator = vine.compile(
  vine.object({
    email: vine.string().email().trim().toLowerCase(),
    password: vine.string(),
    app_source: vine.string().in(['STREAMLINE']),
  })
)

/**
 * Validateur pour l'inscription
 */
export const registerValidator = vine.compile(
  vine.object({
    email: vine.string().email().trim().toLowerCase(),
    password: vine.string(),
    fullName: vine.string().trim(),
    app_source: vine.string().in(['STREAMLINE']),
  })
)
