<p align="center">
  <a href="https://www.medusajs.com">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://user-images.githubusercontent.com/59018053/229103275-b5e482bb-4601-46e6-8142-244f531cebdb.svg">
    <source media="(prefers-color-scheme: light)" srcset="https://user-images.githubusercontent.com/59018053/229103726-e5b529a3-9b3f-4970-8a1f-c6af37f087bf.svg">
    <img alt="Medusa logo" src="https://user-images.githubusercontent.com/59018053/229103726-e5b529a3-9b3f-4970-8a1f-c6af37f087bf.svg">
    </picture>
  </a>
</p>

<h1 align="center">
  Medusa Next.js Starter Template
</h1>

<p align="center">
Combine Medusa's modules for your commerce backend with the newest Next.js 14 features for a performant storefront.</p>

<p align="center">
  <a href="https://github.com/medusajs/medusa/blob/master/CONTRIBUTING.md">
    <img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat" alt="PRs welcome!" />
  </a>
  <a href="https://discord.gg/xpCwq3Kfn8">
    <img src="https://img.shields.io/badge/chat-on%20discord-7289DA.svg" alt="Discord Chat" />
  </a>
  <a href="https://twitter.com/intent/follow?screen_name=medusajs">
    <img src="https://img.shields.io/twitter/follow/medusajs.svg?label=Follow%20@medusajs" alt="Follow @medusajs" />
  </a>
</p>

### Prerequisites

To use the [Next.js Starter Template](https://medusajs.com/nextjs-commerce/), you should have a Medusa server running locally on port 9000.
For a quick setup, run:

```shell
npx create-medusa-app@latest
```

Check out [create-medusa-app docs](https://docs.medusajs.com/create-medusa-app) for more details and troubleshooting.

# Overview

The Medusa Next.js Starter is built with:

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Typescript](https://www.typescriptlang.org/)
- [Medusa](https://medusajs.com/)

Features include:

- Full ecommerce support:
  - Product Detail Page
  - Product Overview Page
  - Search with Algolia / MeiliSearch
  - Product Collections
  - Cart
  - Checkout with PayPal and Stripe
  - User Accounts
  - Order Details
- Full Next.js 14 support:
  - App Router
  - Next fetching/caching
  - Server Components
  - Server Actions
  - Streaming
  - Static Pre-Rendering


# Quickstart

### Setting up the environment variables

Navigate into your projects directory and get your environment variables ready:

```shell
cd nextjs-starter-medusa/
mv .env.template .env.local
```

### Install dependencies

Use Yarn to install all dependencies.

```shell
yarn
```

### Start developing

You are now ready to start up your project.

```shell
yarn dev
```

### Open the code and start customizing

Your site is now running at http://localhost:8000!

# Payment integrations

By default this starter supports the following payment integrations

- [Stripe](https://stripe.com/)
- [Paypal](https://www.paypal.com/)

To enable the integrations you need to add the following to your `.env.local` file:

```shell
NEXT_PUBLIC_STRIPE_KEY=<your-stripe-public-key>
NEXT_PUBLIC_PAYPAL_CLIENT_ID=<your-paypal-client-id>
```

You will also need to setup the integrations in your Medusa server. See the [Medusa documentation](https://docs.medusajs.com) for more information on how to configure [Stripe](https://docs.medusajs.com/add-plugins/stripe) and [PayPal](https://docs.medusajs.com/add-plugins/paypal) in your Medusa project.

# Search integration

This starter is configured to support using the `medusa-search-meilisearch` plugin out of the box. To enable search you will need to enable the feature flag in `./store.config.json`, which you do by changing the config to this:

```javascript
{
  "features": {
    // other features...
    "search": true
  }
}
```

Before you can search you will need to install the plugin in your Medusa server, for a written guide on how to do this – [see our documentation](https://docs.medusajs.com/add-plugins/meilisearch).

The search components in this starter are developed with Algolia's `react-instant-search-hooks-web` library which should make it possible for you to seemlesly change your search provider to Algolia instead of MeiliSearch.

To do this you will need to add `algoliasearch` to the project, by running

```shell
yarn add algoliasearch
```

After this you will need to switch the current MeiliSearch `SearchClient` out with a Alogolia client. To do this update `@lib/search-client`.

```ts
import algoliasearch from "algoliasearch/lite"

const appId = process.env.NEXT_PUBLIC_SEARCH_APP_ID || "test_app_id" // You should add this to your environment variables

const apiKey = process.env.NEXT_PUBLIC_SEARCH_API_KEY || "test_key"

export const searchClient = algoliasearch(appId, apiKey)

export const SEARCH_INDEX_NAME =
  process.env.NEXT_PUBLIC_INDEX_NAME || "products"
```

Then, in `src/app/(main)/search/actions.ts`, remove the MeiliSearch code (line 10-16) and uncomment the Algolia code.

```ts
"use server"

import { searchClient, SEARCH_INDEX_NAME } from "@lib/search-client"

/**
 * Uses MeiliSearch or Algolia to search for a query
 * @param {string} query - search query
 */
export async function search(query: string) {
  const index = searchClient.initIndex(SEARCH_INDEX_NAME)
  const { hits } = await index.search(query)

  return hits
}
```

After this you will need to set up Algolia with your Medusa server, and then you should be good to go. For a more thorough walkthrough of using Algolia with Medusa – [see our documentation](https://docs.medusajs.com/add-plugins/algolia), and the [documentation for using `react-instantsearch-hooks-web`](https://www.algolia.com/doc/guides/building-search-ui/getting-started/react-hooks/).

## App structure

For the new version, the main folder structure remains unchanged. The contents have changed quite a bit though.

```
.
└── src
    ├── app
    ├── lib
    ├── modules
    ├── styles
    ├── types
    └── middleware.ts

```

### `/app` directory

The app folder contains all Next.js App Router pages and layouts, and takes care of the routing.

```
.
└── [countryCode]
    ├── (checkout)
        └── checkout
    └── (main)
        ├── account
        │   ├── addresses
        │   └── orders
        │       └── details
        │           └── [id]
        ├── cart
        ├── categories
        │   └── [...category]
        ├── collections
        │   └── [handle]
        ├── order
        │   └── confirmed
        │       └── [id]
        ├── products
        │   └── [handle]
        ├── results
        │   └── [query]
        ├── search
        └── store
```

The app router folder structure represents the routes of the Starter. In this case, the structure is as follows:

- The root directory is represented by the `[countryCode]` folder. This indicates a dynamic route based on the country code. The this will be populated by the countries you set up in your Medusa server. The param is then used to fetch region specific prices, languages, etc.
- Within the root directory, there two Route Groups: `(checkout)` and `(main)`. This is done because the checkout flow uses a different layout.  All other parts of the app share the same layout and are in subdirectories of the `(main)` group. Route Groups do not affect the url.
- Each of these subdirectories may have further subdirectories. For instance, the `account` directory has `addresses` and `orders` subdirectories. The `orders` directory further has a `details` subdirectory, which itself has a dynamic `[id]` subdirectory.
- This nested structure allows for specific routing to various pages within the application. For example, a URL like `/account/orders/details/123` would correspond to the `account > orders > details > [id]` path in the router structure, with `123` being the dynamic `[id]`.

This structure enables efficient routing and organization of different parts of the Starter.

### `/lib` **directory**

The lib directory contains all utilities like the Medusa JS client functions, util functions, config and constants. 

The most important file here is `/lib/data/index.ts`. This file defines various functions for interacting with the Medusa API, using the JS client. The functions cover a range of actions related to shopping carts, orders, shipping, authentication, customer management, regions, products, collections, and categories. It also includes utility functions for handling headers and errors, as well as some functions for sorting and transforming product data.

These functions are used in different Server Actions.

### `/modules` directory

This is where all the components, templates and Server Actions are, grouped by section. Some subdirectories have an `actions.ts` file. These files contain all Server Actions relevant to that section of the app.

### `/styles` directory

`global.css` imports Tailwind classes and defines a couple of global CSS classes. Tailwind and Medusa UI classes are used for styling throughout the app.

### `/types` directory

Contains global TypeScript type defintions.

### `middleware.ts`

Next.js Middleware, which is basically an Edge function that runs before (almost) every request. In our case it enforces a `countryCode` in the url. So when a user visits any url on your storefront without a `countryCode` param, it will redirect the user to the url for the most relevant region.

The region will be decided as follows:

- When deployed on Vercel and you’re active in the user’s current country, it will use the country code from the `x-vercel-ip-country` header.
- Else, if you have defined a `NEXT_PUBLIC_DEFAULT_REGION` environment variable, it will redirect to that.
- Else, it will redirect the user to the first region it finds on your Medusa server.

If you want to use the `countryCode` param in your code, there’s two ways to do that:

1. On the server in any `page.tsx` - the `countryCode` is in the `params` object:
    
    ```tsx
    export default async function Page({
      params: { countryCode },
    }: {
      params: { countryCode: string }
    }) {
      const region = await getRegion(countryCode)
    
    // rest of code
    ```
    
2. From client components, with the `useParam` hook:
    
    ```tsx
    import { useParams } from "next/navigation"
    
    const Component = () => {
    	const { countryCode } = useParams()
    	
    	// rest of code
    ```
    

The middleware also sets a cookie based on the onboarding status of a user. This is related to the Medusa Admin onboarding flow, and may be safely removed in your production storefront.

# Resources

## Learn more about Medusa

- [Website](https://www.medusajs.com/)
- [GitHub](https://github.com/medusajs)
- [Documentation](https://docs.medusajs.com/)

## Learn more about Next.js

- [Website](https://nextjs.org/)
- [GitHub](https://github.com/vercel/next.js)
- [Documentation](https://nextjs.org/docs)
