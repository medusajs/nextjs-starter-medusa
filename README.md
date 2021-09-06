<p align="center">
  <a href="https://www.gatsbyjs.com">
    <img alt="Next.js" src="https://medusa-public-images.s3.eu-west-1.amazonaws.com/nextjs.png" width="100" />
  </a>
</p>
<h1 align="center">
  Medusa + Next.js Starter 🚀
</h1>

> **Prerequisites**: To use the starter you should have a Medusa server running locally on port 4000. Check out [medusa-starter-default](https://github.com/medusajs/medusa-starter-default) for a quick setup. Note that you need to change `STORE_CORS` in `medusa-config.js` to `http://localhost:3000` when using the Next.js starter.

## Quick start

1. **Setting up the enviroment variables**

    Get your enviroment variables ready:

    ```shell
    mv .env.template .env.local
    ```

    Add your Stripe API key to your `.env.local`


    ```
    NEXT_PUBLIC_STRIPE_KEY=pk_test_something
    ```

2.  **Install dependencies**

    Use Yarn to install all dependencies.

    ```shell
    yarn
    ```

3.  **Start developing.**

    Navigate into your projects directory and start it up.

    ```shell
    cd nextjs-starter-medusa/
    yarn dev
    ```

4.  **Open the code and start customizing!**

    Your site is now running at http://localhost:3000!

    Edit `/pages/index.js` to see your site update in real-time!

5.  **Learn more about Medusa**

    - [Website](https://www.medusa-commerce.com/)
    - [GitHub](https://github.com/medusajs)
    - [Documentation](https://docs.medusa-commerce.com/)

6.  **Learn more about Next.js**

    - [Documentation](https://nextjs.org/docs)
