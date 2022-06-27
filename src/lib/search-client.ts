import { instantMeiliSearch } from "@meilisearch/instant-meilisearch";

const endpoint = process.env.NEXT_SEARCH_ENPOINT || "http://127.0.0.1:7700"

export const searchClient = instantMeiliSearch(endpoint, "ZZkokaw156b67963d151d97980f7bbced3c962946529d9f836ab697d5b0e5425c54e7db7")