import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('full_name').nullable()
      table.string('email', 255).notNullable().unique()
      table.string('password', 180).notNullable()
      table.string('app_source', 50).notNullable()
      table.boolean('is_premium').defaultTo(false) // statut de l'abonnement
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
