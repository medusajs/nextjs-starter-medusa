import { isEqual, pick } from "lodash"

//contains utility/helper functions (formatig data / handling errors/logging)

//use throughout the app to keep code clean and reusable.

export default function compareAddresses(address1: any, address2: any) {
  return isEqual(
    pick(address1, [
      "first_name",
      "last_name",
      "address_1",
      "company",
      "postal_code",
      "city",
      "country_code",
      "province",
      "phone",
    ]),
    pick(address2, [
      "first_name",
      "last_name",
      "address_1",
      "company",
      "postal_code",
      "city",
      "country_code",
      "province",
      "phone",
    ])
  )
}
