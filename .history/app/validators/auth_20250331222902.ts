import vine from '@vinejs/vine'
import { AppSource } from '../enums/app_source.js'

/**
 * Validateur pour la connexion
 */
export const loginValidator = vine.compile(
  vine.object({
    email: vine.string().email().trim().toLowerCase().minLength(6).maxLength(255),
    password: vine.string().minLength(6).maxLength(100),
    app_source: vine.string().oneOf([AppSource.STREAMLINE]),
  })
)

/**
 * Validateur pour l'inscription
 */
export const registerValidator = vine.compile(
  vine.object({
    email: vine.string().email().trim().toLowerCase().minLength(6).maxLength(255),
    password: vine.string().minLength(6).maxLength(100),
    fullName: vine.string().trim().escape().minLength(3).maxLength(255),
    app_source: vine.string().oneOf([AppSource.STREAMLINE]),
  })
)
