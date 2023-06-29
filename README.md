<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

# NestJS Challenge

## Summary 
* [Description](#description)
* [Installation](#installation)
* [Dependencies](#dependencies)
* [Environment](#environment)
* [Schemas](#schemas)
* [Endpoints](#endpoints)
* [Extra points](#extra-points)
* [Test coverage](#test-coverage)

## Description

This API was created in NestJS and works like a online store, as a `Manager` you can create, update and delete products, and as a `Client` you can see all the products that are allocated in the database. There are a lot of functions that you can play with, enjoy it!

## Installation

* Clone this repository
* Read [dependencies](#dependencies) section
* Install every dependency by running `yarn install`
* Create a `dotenv` file with the variables specified in [environment](#environment) section

## Dependencies
Listed on [package.json](/package.json)

## Environment

| Variable              |
|-----------------------|
| DATABASE_URL          |
| POSTGRES_USER         |
| POSTGRES_PASSWORD     |
| SALT                  |
| JWT_SECRET            |
| AWS_ACCESS_KEY        |
| AWS_SECRET_ACCESS_KEY |
| AWS_BUCKET_NAME       |
| AWS_BUCKET_HOST       |
| HOST                  |
| MAIL_IDENTITY         |

## Schemas

The base of the API are `products` and `users`, these are the models that are handled

```
model User {
  id        Int      @id @default(autoincrement())
  name      String
  lastname  String
  username  String  @unique
  email     String  @unique
  password  String
  recovery  String? @unique @db.Uuid
  role      Role   @default(CLIENT)

  cart      Cart?

  orders    Order[]
  likesOnProducts LikesOnProducts[]

  @@map("user")
}
```

```
model Product {
  SKU         Int     @id @default(autoincrement())
  name        String @unique
  description String  @db.VarChar(200)
  price       Float
  stock       Int
  image       String?
  imageUrl    String?
  available   Boolean @default(true)

  cart      ProductsOnCarts[]
  orders    ProductsOnOrders[]
  likesOnProducts LikesOnProducts[]

  category  Category @relation(fields: [categoryId], references: [id], onDelete: Cascade)
  categoryId Int @map("category_id")

  @@map("product")
}
```

You can see all the implementations and relations in the [prisma schema](./prisma/schema.prisma)

## Endpoints

This API is using GraphQL implementation, check the endpoints [here](http://localhost:3000/graphql)

## Extra points
- [X] When the stock of a product reaches 3, notify the last user that liked it and not purchased the product yet with an email. Use a background job and make sure to include the product's image in the email.

- [X]  Add forgot password functionality.

- [X] Send an email when the user changes the password

- [ ] Deploy on Heroku

## Test coverage

![image](https://github.com/irenehl/nestjs-nerdery-challenge/assets/54600515/2f43a6fb-6519-4a9d-8b69-faa59d28211f)

