import { BaseSchema } from '@adonisjs/lucid/schema'
import { AppSource } from '../../app/enums/app_source.js'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('full_name').nullable()
      table.string('email', 255).notNullable().unique()
      table.string('password', 180).notNullable()
      table.enum('app_source', Object.values(AppSource)).notNullable()
      table.boolean('is_premium').defaultTo(false)
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
