import qs from "qs"

// TODO: Add debug logging
export type Config = {
  baseUrl: string
  globalHeaders?: Record<string, string>
  publishableKey?: string
  apiKey?: string
  jwtToken?: {
    storageKey?: string
    storageMethod?: "local" | "session" | "memory"
  }
}

type FetchParams = Parameters<typeof fetch>

type ClientFetch = (
  input: FetchParams[0],
  init?: FetchParams[1] & { query?: Record<string, any> }
) => Promise<Response>

const isBrowser = () => typeof window !== "undefined"

const toBase64 = (str: string) => {
  if (typeof window !== "undefined") {
    return window.btoa(str)
  }

  return Buffer.from(str).toString("base64")
}

// TODO: Add support for retries and timeouts
class Client {
  public fetch: ClientFetch

  private DEFAULT_JWT_STORAGE_KEY = "medusa_auth_token"
  private token = ""

  constructor(config: Config) {
    this.fetch = this.initClient(config)
  }

  protected initClient(config: Config) {
    const defaultHeaders = {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...this.getApiKeyHeader(config),
      ...this.getPublishableKeyHeader(config),
      ...config.globalHeaders,
    }

    return (
      input: FetchParams[0],
      init?: FetchParams[1] & { query?: Record<string, any> }
    ) => {
      // We always want to fetch the up-to-date JWT token before firing off a request.
      const jwtToken = this.getJwtTokenHeader(config)

      const headers = init?.headers
        ? { ...defaultHeaders, ...jwtToken, ...init.headers }
        : { ...defaultHeaders, ...jwtToken }

      let normalizedInput: RequestInfo | URL = input
      if (input instanceof URL || typeof input === "string") {
        normalizedInput = new URL(input, config.baseUrl)
        if (init?.query) {
          const existing = qs.parse(normalizedInput.search)
          const stringifiedQuery = qs.stringify({ existing, ...init.query })
          normalizedInput.search = stringifiedQuery
        }
      }

      // TODO: Make response a bit more user friendly (throw errors, return JSON if resp content type is json, etc.)
      return fetch(normalizedInput, { ...init, headers })
    }
  }

  protected getApiKeyHeader = (
    config: Config
  ): { Authorization: string } | {} => {
    return config.apiKey
      ? { Authorization: "Basic " + toBase64(config.apiKey + ":") }
      : {}
  }

  protected getPublishableKeyHeader = (
    config: Config
  ): { "x-medusa-pub-key": string } | {} => {
    return config.publishableKey
      ? { "x-medusa-pub-key": config.publishableKey }
      : {}
  }

  protected getJwtTokenHeader = (
    config: Config
  ): { Authorization: string } | {} => {
    const storageMethod =
      config.jwtToken?.storageMethod || (isBrowser() ? "local" : "memory")
    const storageKey =
      config.jwtToken?.storageKey || this.DEFAULT_JWT_STORAGE_KEY

    switch (storageMethod) {
      case "local": {
        if (!isBrowser()) {
          throw new Error("Local JWT storage is only available in the browser")
        }
        const token = window.localStorage.getItem(storageKey)
        return token ? { Authorization: `Bearer ${token}` } : {}
      }
      case "session": {
        if (!isBrowser()) {
          throw new Error(
            "Session JWT storage is only available in the browser"
          )
        }
        const token = window.sessionStorage.getItem(storageKey)
        return token ? { Authorization: `Bearer ${token}` } : {}
      }
      case "memory": {
        return this.token ? { Authorization: `Bearer ${this.token}` } : {}
      }
    }
  }
}

class Admin {
  private client: Client
  constructor(client: Client) {
    this.client = client
  }
}

class Store {
  private client: Client

  constructor(client: Client) {
    this.client = client
  }

  public region = {
    list: async (
      queryParams?: Record<string, any>,
      headers?: Record<string, any>
    ) => {
      return this.client
        .fetch(`/store/regions`, { query: queryParams, headers })
        .then((resp) => resp.json())
    },
    retrieve: async (
      id: string,
      queryParams?: Record<string, any>,
      headers?: Record<string, any>
    ) => {
      return this.client
        .fetch(`/store/regions/${id}`, { query: queryParams, headers })
        .then((resp) => resp.json())
    },
  }

  public collection = {
    list: async (
      queryParams?: Record<string, any>,
      headers?: Record<string, any>
    ) => {
      return this.client
        .fetch(`/store/collections`, { query: queryParams, headers })
        .then((resp) => resp.json())
    },
    retrieve: async (
      id: string,
      queryParams?: Record<string, any>,
      headers?: Record<string, any>
    ) => {
      return this.client
        .fetch(`/store/collections/${id}`, { query: queryParams, headers })
        .then((resp) => resp.json())
    },
  }

  public category = {
    list: async (
      queryParams?: Record<string, any>,
      headers?: Record<string, any>
    ) => {
      return this.client
        .fetch(`/store/product-categories`, { query: queryParams, headers })
        .then((resp) => resp.json())
    },
    retrieve: async (
      id: string,
      queryParams?: Record<string, any>,
      headers?: Record<string, any>
    ) => {
      return this.client
        .fetch(`/store/product-categories/${id}`, {
          query: queryParams,
          headers,
        })
        .then((resp) => resp.json())
    },
  }

  public product = {
    list: async (
      queryParams?: Record<string, any>,
      headers?: Record<string, any>
    ) => {
      return this.client
        .fetch(`/store/products`, { query: queryParams, headers })
        .then((resp) => resp.json())
    },
    retrieve: async (
      id: string,
      queryParams?: Record<string, any>,
      headers?: Record<string, any>
    ) => {
      return this.client
        .fetch(`/store/products/${id}`, {
          query: queryParams,
          headers,
        })
        .then((resp) => resp.json())
    },
  }

  public cart = {
    create: async (body: any, headers?: Record<string, any>) => {
      return this.client
        .fetch(`/store/carts`, {
          headers,
          method: "POST",
          body: JSON.stringify(body),
        })
        .then((resp) => resp.json())
    },
    update: async (id: string, body: any, headers?: Record<string, any>) => {
      return this.client
        .fetch(`/store/carts/${id}`, {
          headers,
          method: "POST",
          body: JSON.stringify(body),
        })
        .then((resp) => resp.json())
    },
    retrieve: async (
      id: string,
      queryParams?: Record<string, any>,
      headers?: Record<string, any>
    ) => {
      return this.client
        .fetch(`/store/carts/${id}`, {
          query: queryParams,
          headers,
        })
        .then((resp) => resp.json())
    },
    createLineItem: async (
      cartId: string,
      body: any,
      headers?: Record<string, any>
    ) => {
      return this.client
        .fetch(`/store/carts/${cartId}/line-items`, {
          headers,
          method: "POST",
          body: JSON.stringify(body),
        })
        .then((resp) => resp.json())
    },
    updateLineItem: async (
      cartId: string,
      lineItemId: string,
      body: any,
      headers?: Record<string, any>
    ) => {
      return this.client
        .fetch(`/store/carts/${cartId}/line-items/${lineItemId}`, {
          headers,
          method: "POST",
          body: JSON.stringify(body),
        })
        .then((resp) => resp.json())
    },
    deleteLineItem: async (
      cartId: string,
      lineItemId: string,
      headers?: Record<string, any>
    ) => {
      return this.client
        .fetch(`/store/carts/${cartId}/line-items/${lineItemId}`, {
          headers,
          method: "DELETE",
        })
        .then((resp) => resp.json())
    },
    addShippingMethod: async (
      cartId: string,
      body: any,
      headers?: Record<string, any>
    ) => {
      return this.client
        .fetch(`/store/carts/${cartId}/shipping-methods`, {
          headers,
          method: "POST",
          body: JSON.stringify(body),
        })
        .then((resp) => resp.json())
    },
    complete: async (cartId: string, headers?: Record<string, any>) => {
      return this.client
        .fetch(`/store/carts/${cartId}/complete`, {
          headers,
          method: "POST",
        })
        .then((resp) => resp.json())
    },
  }

  public fulfillment = {
    listCartOptions: async (
      queryParams?: Record<string, any>,
      headers?: Record<string, any>
    ) => {
      return this.client
        .fetch(`/store/shipping-options`, {
          query: queryParams,
          headers,
        })
        .then((resp) => resp.json())
    },
  }

  public payment = {
    listPaymentProviders: async (
      queryParams?: Record<string, any>,
      headers?: Record<string, any>
    ) => {
      return this.client
        .fetch(`/store/payment-providers`, {
          query: queryParams,
          headers,
        })
        .then((resp) => resp.json())
    },

    initiatePaymentSession: async (
      cart: any,
      body: any,
      headers?: Record<string, any>
    ) => {
      let paymentCollectionId = (cart as any).payment_collection.id
      if (!paymentCollectionId) {
        const collectionBody = {
          cart_id: cart.id,
          region_id: cart.region_id,
          currency_code: cart.currency_code,
          amount: cart.total,
        }
        paymentCollectionId = (
          await this.client
            .fetch(`/store/payment-collections`, {
              headers,
              method: "POST",
              body: JSON.stringify(collectionBody),
            })
            .then((resp) => resp.json())
        ).payment_collection.id
      }

      return this.client
        .fetch(
          `/store/payment-collections/${paymentCollectionId}/payment-sessions`,
          {
            headers,
            method: "POST",
            body: JSON.stringify(body),
          }
        )
        .then((resp) => resp.json())
    },
  }
}

class Medusa {
  public client: Client
  public admin: Admin
  public store: Store

  constructor(config: Config) {
    this.client = new Client(config)
    this.admin = new Admin(this.client)
    this.store = new Store(this.client)
  }
}

export default Medusa
