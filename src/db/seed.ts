import { faker } from "@faker-js/faker"
import chalk from "chalk"
import { db } from "./connection"
import {
  authLinks,
  orderItems,
  orders,
  products,
  restaurants,
  users,
} from "./schemas"

/**
 * Reset Database
 */

await db.delete(users)
await db.delete(restaurants)
await db.delete(products)
await db.delete(orders)
await db.delete(orderItems)
await db.delete(authLinks)

console.log(chalk.yellow("✔ Database reset!"))

/**
 * Create customers
 */

const [customer1, customer2] = await db
  .insert(users)
  .values([
    {
      name: faker.person.fullName(),
      email: faker.internet.email(),
    },
    {
      name: faker.person.fullName(),
      email: faker.internet.email(),
    },
  ])
  .returning()

console.log(chalk.yellow("✔ Create customers!"))

/**
 * Create manager
 */

const [manager] = await db
  .insert(users)
  .values([
    {
      name: faker.person.fullName(),
      email: "admin@admin.com",
      role: "manager",
    },
  ])
  .returning({
    id: users.id,
  })

console.log(chalk.yellow("✔ Create manager!"))

/**
 * Create restaurant
 */

const [restaurant] = await db
  .insert(restaurants)
  .values([
    {
      name: faker.company.name(),
      description: faker.lorem.paragraph(),
      managerId: manager!.id,
    },
  ])
  .returning()

console.log(chalk.yellow("✔ Create restaurant!"))

/**
 * Create products
 */

function generateProduct() {
  return {
    name: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    priceInCents: Number(faker.commerce.price({ min: 100, max: 500, dec: 0 })),
    restaurantId: restaurant!.id,
  }
}

const availableProducts = await db
  .insert(products)
  .values([
    generateProduct(),
    generateProduct(),
    generateProduct(),
    generateProduct(),
    generateProduct(),
    generateProduct(),
  ])
  .returning()

console.log(chalk.yellow("✔ Create products!"))

console.log(chalk.greenBright("✔ Database seeded successfully"))

process.exit()
