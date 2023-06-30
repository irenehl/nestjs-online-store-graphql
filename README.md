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

I made some helpful "pre-query" files to help you on testing the API (the base URL of this is `http://localhost:3000/`):

* [User Handler](http://localhost:3000/graphql?explorerURLState=N4IgJg9gxgrgtgUwHYBcQC4RxighigSwiQAIBhAJwXwQFUBnBCgWVyVwHMmAKAEiio0GTAJJIADjlbsuFdOUEo6jCmMkoAhAEoSwADqkSA6kuEVuxoSrU55-RctESpbTkx37DJEgTAHv3uyI-gEANrj0KEEIId4wKtGxJAhwuAShSVRQEABuTACemRChMYYAvgYVSAbYeITECiaO5vZNZjYo8pRt1s6aHiGWpioWDu19dkPNHQNePn5ziXPhkUsBJPFMawEpaRlzWbkFRSUhVVU1OPhEpLTiYFY8vDD3j6oTJHcPw07q2rohF7fZrcIFvDp2ME-d7qWbrXxJbbeFZRXDBOabChI5KpdKZBDZPIUQoHYqlbznAyXOo3EgAEQQJWhAMMYEZCGZnnhC3W2JR2Mx2N2eIOBKOxJO5JIlOqSAAjjACiQAGIEJBgADySBBvAAZmrNdr2mB5GJ%2BizvPr1VqQb47FbDdMwHCAgjFmipciIqj0etBR6ksL9utDkSSSGyWdKlT5YriSqDQBBUKhMz0PjiNym1AaAA0JF4oQIcAInRIZv%2BXJIDuTqZU6czXDsjYQ%2BaLJbLheLpZd3jdvIDy29AoSg-WQfxhOOpNO5UqIFzIByuAoBFwACMSvQMCAq3oQFNxuppG4KPv5FXvPv-cEMCR9w8kARGbh97mkvuKJG7-vmImAHKJgA4gAogASm%2BH4gJm9D0AA7hAFB%2BD%2B0ERPBiFgAAjAATAAzBokFzPuiQoY%2Bz7hIR6z7vyAYoQAFoqABeECUQE%2B4TqRbDkbgoQQOICCMQA1LgYAlkgAACFC4DkSAAHTZPuZzvoY%2B6Hr06jnhabEgDeMScU%2BL6YaxV6obBCFIZp%2B4wehSE4fhxn3iAJHyA%2BXEvg51HDrRLkgAxAksQuUEcT5ZEvrx-FCZiknSXJCkgEpITXq80IdJpl6ObplngG54RGEWyAoKxZTKSZDo2samnYSVjktppmHVdR3aFXeACs86LnR1BshQ26YPoICJjgdGIQQjHXMQ577gAQtQVAUMk%2BQAFJ0euQFQAQGoEItIi0IxIiYf%2BBAiPQYhgS1UBkCIABsIgANbiAAGgAamQi0AJyyQgS2hOuADqyriOul03XAYErXAKarcq9DrrhU0lKWdEAFpAZhgO3VN%2BQAJoPUjMAADJwP%2BOQiAQcEEFAuFPUdABWEAAB7469%2BTrth9OhCIdMEAAKrQyoagAirQYDKrQR0nRDdFgMDzDc1jAAsGp0iBjH-nSUDYf%2BD0AAyyWBADKNPKgAtHSAAcIHrphxvywACswZtgxAADSmHMAAEi12EiAA7FdPtgfTGry9h%2BN0UgIFymbQFwbbtD7mUC4gPQAgEOIaCYCAZRAA)
* [Auth Handler](http://localhost:3000/graphql?explorerURLState=N4IgJg9gxgrgtgUwHYBcQC4RxighigSwiQAIAZCAcwKQFlcldKEAnACgBIAbKmgSSQAHHPUbMW6cryQDhKAIQBKEsAA6pEj2pI2W-kJyTu02SIZNWytRpIlcUKAgDOTgPooIAa2TrbAX3UApHVsPEJiKW1OPRkDFEkKbVMFK19NaV0TOKMY5NSbOwdnNw9vYI0goJCcfCJSACVnBBQABVwXAHcIFjBGgEcYZxROFgQBobbO7rBkyX7Bp1b2py6e5KUVNNGnZsmV6fmhtlHxxb3VmeySDhOFpam1uPzbWwIwNNtGRA-NdpQvhA-GA7FgAn4IOC4AhcH6jKAQABurAAnrCIFxARVAupqmE6iQAMrNAByCA652mIya932jzkc2pFLpOA21lsOxQpPJywux0ZPOms2u212AuZKGeLzePzBBS4f1lLxIwNYipeEKhMIKcMRKLRGLSlXUIAANCAEbgWARcAAjDFODAgNkkVQgXJxUQWFiuyTO2yuwRi94YF0gQMPMAARgATABmeSuk0-V0a6E%2B0NgBgEBDyniCBAALwA1LgwHAaAABFi4BFIAB08NdhqTGld7rk6b9ofDtODkgDQZj8cTyZAqZhIddmaQ2dzEHzxZVLCrNfrjZAzbSrtuEyDyU7o-H6anWZzuDzhaLS5XtYbECbFRb-pAIppF33Ia7rtKPknIAAbGANoAKwABygbgAAsAC0kEAOw2jB8GQZG0FQWAUDQQAZsBCDRmAcFgJBsaRqBcEjgUA4RseYaDnGD7%2BC2fimiAAAWCClqwDqYGoIAAII4Kx3QEAWtTED6roAEIcaMLAkAgyIAFKsTaADiUAEAA8gQil8AAqgWfCRsSBB8E4Aj1MBUAAMJ8P%2BfCeIIAAaABq1mKQAnHWCmKVwNoAOoAGKCDatn2XA9QqXAXB%2BapACiMBqR5HQAFoEigkZQNGLnIgAigAEspZaQTAACa0agQQZDuQWYD%2BXwWkAFa0OZSCKQial6VpOkACIACpxVwgV9VwuVVe5gilU5Y2aY1cXRppPWUB0i18QAHsSjVgF5rgpXxgWeNZTkQJBmmKXxjUtFAcC5YFkbAaVfWSS0-l6Xx%2BX-oIYAeGtmlcMSuXWa4nh9JQrrMWaThQFaghoJgIB%2BEAA)
* [Category Handler](http://localhost:3000/graphql?explorerURLState=N4IgJg9gxgrgtgUwHYBcQC4RxighigSwiQAIBhAJwXwTJoHMIKBPACgBIoqa6UFGWASSQAHHOnLc%2Bvfk2bCxKAIQBKEsAA6pEl2rSGc1rp4Gho8SU5Tap%2BeZRrN2kiQJgtLl0lyIPJAL5agUha2HiExCQAqiJgJnwCbOwwsfGyZooSMXH6CXIKOKrqfik5NnksrKVpiQUoEsmpuel2io5%2BXj4IHa7u2sHBoTj4RKQAIggANgjNiRxgUzPlLYJgEsLK7doL07OGbg07SzK1YFuevT3evv1BWloAjjAILCQAYgRIYADySMtz7AAZp8fn8Tvk1iQNkUnC5gV9fv99pCgSDEeChGdis5Ljjrt1bkhBkgni9mO8QQBBSaTDEEBAAZ2xcKpNLpjOZnjcVy6fgGIAANCAAG64CgEXAAI2mDIwIFhJA0IGMewyOCVEgVLiV%2BI1ipAZEpABUAKIAcW%2BACUAJoAfQADABWJV8gV%2BJXVVWtdUYTnakC631KqC2EgARiVbpxSu5voj-Sj-qOXtWeoAzIn9fDQUjMXqAExBQUgAAW1AWFFlmE0IEpOBLTAIAC8RsQNUqAELUKgUEgIZgAKRLkrNUAI3wIA8EUSbgjDADkCIIGcJLY6oGRBAA2QQAaxEAA0AGpkAcATgAdP2B5NJQB1N4iSWbndwS3DuA0kdvBmStMd6YCBQEsAC0zTDJ9dw7ZhrQPECYAAGTgedhUEAgAHcCCgNMjyXAArCAAA8ENPZhJXzQjJkEAiCCNKI3m%2BABFKIwDeKIlxXT8SzAF8AFkjWtAAWb4xhNJt5zGKB83nA97QvS0AGU8LeABaMYAA4TUlMMVMEgAFXj1PfCAAGkw14gAJR180EAB2LdbMtQjvkE-MEJLJATQedSzXQvSoiVfxiwZLgCBENBMBAfwgA)
* [Product Handler](http://localhost:3000/graphql?explorerURLState=N4IgJg9gxgrgtgUwHYBcQC4RxighigSwiQAIBhAJwXwQAUKIwYoUAKAEiipvseZQCSSAA4505bijoMmLIaJQBCAJQlgAHVIku1Kb1lsdPGf3liSnSdL5yROVRq0kSAZQDSAVU3PnSXIm8fMAQAZy4CYUJiQOdhCgIoBBiSEJRoAGtk3AA3XAIAG1wAI3ykp20aAHMICgBPNWTnAjBGkj8A8oBfZII4XEqynxJe-oQPCnzA7qRpzWw8KNIPYTBjGzZ2GBW1gzMUcWXVvRNbBRUGrS2j6wNWK53TO32Le%2BP1vYdk9y9y9sGg0LhSJEJDJOIJf7OVIZLK5ArFUo9PoDJGjcaTLTTWZIeb4EEkAAiCFKb1u7BC6Rg4iESk%2BWmCJJu-FY33E5MpdKG32Sf2SwTC8WB0XK4MSyWhUEy5RyeUKJUhw2RCpGA3RU002NxixIABUIJVKqV9Mz2GkDUaTigXJTqahzo5nGbDUyWCzPGynRb1taYJyfNzfv4FfygYswfExeUJVKhjL4fLUSjyiqxhN1TNNHMcHjiCQADIEdIujb5QvFn222kXZylovG12siy18sc6s%2BGAhBAUAQtEWWgPOLGZpAARxgXfqADECEgwAB5JDFjgAMxn88X9cEqEr9sCq9nC6XjfY%2B-XxZpfucA58vPKIcFYb7EPFaUlsNlCOVSsTqYxg41w5jhOJDTrOACC%2BT5JuIRtqeEFQZaMEOv6ng8kGfKAg%2BILhs%2BUavjGPhxnKiLlFAVQ1PUyFDM0rS3kM0zUd%2ByZKmqmIAaCo7jnUJAAOIICg0EAEK1GQ5F1BwZFSNUdQ9jufoDAJiHCaJUkUawkkINJtSyRYGlaT2l6uKhgYdEM94RI%2BQyigq0bvvGJGMaMP6sf%2BGYcUB3F8SgACytSTjkNQEFIBapG2Cm%2Bf52SBcFBChVRJAdl2Pbht6xmuZ0IAADQgLk8SfiEGAgMh6ggEYpKPAoJXiPFJW2RgJAAIwAAxNZlyQldZVWNQAzAAdAALG15Qlby9UdTIJD9SVQ1DCV5lCqCY0gPkNQIHAwzCCE8DTe1pVidpLT1Q1UwzSQJWvOeTxdTVIDckdp3OLV%2BFdQAnK1u2dUdDW9QATCdgS1ZSXXdadJWnoem40l1DWg3tqkyYd4gwwDICei2MDQ7Dzabj6mMallIAABbUMEFAFZgGggGBOCE4FABeOaLegJWCdQVAUCQCC1AAUoTRQ8VABBzgQ3MCB4dMCA1AByBACCEQgAEoAKxQGQAgAGwCOkwgABoAGpkNzL29Vz3P5EUADqk7CEUaua3ACt83AkH85OIRFN1gmlEFhMAFo8Q1NvpMJACaOu%2BzAeZwFL2QCAQADuCTdXrssAFYQAAHnmhu1EUP0Z-kAjpwQOoeJOc4AIoeGAk4eLL8vO4TYB295Ooh-1c4EgAonTUsElAP1SzrTW9QrLip5OAC0BIABxd0UDWT-1tDeTPjsQG4DXeQAEkrP0CAA7OrB8Kxnc79T9eaE0gXcjjPPHx7QXggBl2UChZhUv0AA)
* [Cart Handler](http://localhost:3000/graphql?explorerURLState=N4IgJg9gxgrgtgUwHYBcQC4RxighigSwiQAIBBMMABQCcIwYoUAVCAYVxpQAoASXSrXqMUAZ1YcuASSQAHHOnKC6DJhM4oZ8lAEIAlCWAAdUiQHUVI9V27mhqsdc1yFJfsuFNx7DVpwHjUxISAjATYOCYUQQaKTCgkJQEOFFDcIjggEcYXFQCFABPdIyoX3iM4NlLJgBlAGkAVWKSAF90tqQOk2yYgpIAMQIkMABZAskUNNMAMyHR8Y0pjNDmqJi45vzk1MCKkmzcwkLm4NLpcoqqzxR6poSO4I6upGw8QmISABEEABsEJPsIgA8kgJnwwL9-ghAUwQRMagBrGCKGS6ALpCF-AHVFBwjTcW6KXiYqEw3GgjSImDohJbFJLCoHPLHBKnMonEhXBy3ZoPVomZ4gAA0IAAbpwCLgAEZ-UQYEC7EhGEB2HHeCZ%2BFDKxSK4LKnkYEgAFiFzWVTKORUNAGZ2qbTMqSdjrniuFTtcaBcKQAALBACGJyzDGEBkHA%2BiA0AgAL3wRCQ2uVACF-TQYiQEAUAFI%2BqUAcSgBCBBCzUga0akAEYAHIEKSiGQAJQArFA2FIAGxSBGyAAaADU2FmAJwAOkzWZ%2BUoA6v1ZFL2124I3c3AflO8-1RFLrUm-vkfQAtPOV%2BcIpMFACavcPMAAMnBq6KpAQAO4EKDW-t1gBWEAAHneQ4FFKABM-4-FIf4EMwDT9ECACKDRgP0DR1g2a4%2BmAi4jMwl5GkCnwAKLRtWnxQKB1a9gADKOjY1D%2B-QALSfAAHERUqVkxRpUCMrErhAdSViMAASzagVIADsHaSY2-5AkaoF3j6SBEZkrF5q%2BVBNCALTeqIUBRrIaCYLpQA)
* [Order Handler](http://localhost:3000/graphql?explorerURLState=N4IgJg9gxgrgtgUwHYBcQC4RxighigSwiQAIAFAG1ygQHkAnMBek4AHVJIAcqaGmW7TiRIEwHESJgBnZgElxwkigh4KEyQRQI401hskkAjjFyotATwOSu9CGBhQU%2BpYYDKAaQCq1w0lyIvpJM0lD0BFyExEEitgQ0MSTSKlAA1om4AG64BFQARhQIiQRwuADmRa6apRVe9OpVAL7WzZytrRwmzBYkFSgAghQU-Mx6QiJ9g8OMoy6GYtYy8oqGKmrWWjpjQSZmhChWVbb2js7jhpKePlUi-oE3JCFhEVFIiXEJD8nQ6Q9ZOflCsUapULtVygg6g0wa1DLCSO0OJ0YN0SABxBAoACyFhG9AAFAASPo4vEKdAkOSoACEAEo5r1MaSZgSxBTiUzcSyFPTziIFkolvQFNY1rhoZptLoGYZduYDkFjg4nDKLldEndQWDHghQuFIkQ3g8Plqwd80hlsrlcAVTRcShDgRCoUF4SJ4YijSAADQgbLhG2FaQYEDnNggElcgQijAkACMHEaPpAAAsELgBMHMOwQP0cCmIOEAF74Q3h9DhgBC6fozBICAsACkU3k0VACLQCI25F4i3I4wA5AhyaRUgBKAFYoABhOQANjkqS4AA0AGrTxsATgAdA3GxQ8gB1ABiXDys4XcDHLbgQ1bx%2BkeQAzJXCloUwAtNFxs%2BpSsWABNZcPxgAAZOAB0yOQCAAd3iJ9V2HAArCAAA9QI3Cw8gAJlQig5BQggABUvGPWgAEUvDAY8vGHUdbxTMALyxIiAIAFloAARABRIsB04qBsIHZcAAZtzHNwkOPABaTiAA5uLyONpLYsgsTk68IA8OMsQACQnbC5AAdjnIyx1Q2g2Ow0CUyQbijDktEYLIHwQCTX09ReEM3KAA)

## Extra points
- [X] When the stock of a product reaches 3, notify the last user that liked it and not purchased the product yet with an email. Use a background job and make sure to include the product's image in the email.

- [X]  Add forgot password functionality.

- [X] Send an email when the user changes the password

- [ ] Deploy on Heroku

## Test coverage

![image](https://github.com/irenehl/nestjs-nerdery-challenge/assets/54600515/2f43a6fb-6519-4a9d-8b69-faa59d28211f)

