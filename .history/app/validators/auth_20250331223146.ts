import vine from '@vinejs/vine'

// Définition des schémas de base
const baseSchema = {
  email: vine.string().email(),
  password: vine.string().minLength(6),
  app_source: vine.string().matches(/^STREAMLINE$/),
}

/**
 * Validateur pour la connexion
 */
export const loginValidator = vine.compile(vine.object(baseSchema))

/**
 * Validateur pour l'inscription
 */
export const registerValidator = vine.compile(
  vine.object({
    ...baseSchema,
    fullName: vine.string().minLength(3),
  })
)
