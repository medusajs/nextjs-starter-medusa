import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const res = await fetch("http://localhost:9000/store/products", {})
  const data = await res.json()

  return NextResponse.json({ data })
}
