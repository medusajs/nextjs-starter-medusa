"use client"

import { useEffect, useRef, useMemo } from "react"
import { Loader } from "@googlemaps/js-api-loader"
function Map({ address }: { address: string }) {
  useEffect(() => {
    // apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? 'AIzaSyAsHpSCoPuvNgDp76YRS1C-vUbABQ_oHhQ',
    const loader = new Loader({
      apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? '',
      version: "weekly",
    })

    loader
      .importLibrary("maps")
      .then(async ({ Map }) => {
        const { AdvancedMarkerElement } = (await google.maps.importLibrary(
          "marker"
        )) as google.maps.MarkerLibrary
        const position = { lat: -15.77446, lng: 34.98063 }

        const map = new Map(document.getElementById("map") as HTMLElement, {
          zoom: 10,
          center: position,
          mapId: "DEMO_MAP_ID",
        })

        const marker = new AdvancedMarkerElement({
          map: map,
          position: position,
          title: "Skuva Fashions",
        })
      })
      .catch((e) => {
        // do something
      })
  })

  return <div style={{ height: "400px" }} id="map" />
}
export default Map
