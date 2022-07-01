import NextHead from "next/head"
import React from "react"

type HeadProps = {
  title?: string
  description?: string
  image?: string
}

const Head: React.FC<HeadProps> = ({ title, description, image }) => {
  return (
    <NextHead>
      <title>{title} | ACME</title>
      <meta name="description" content={description} />
      <meta itemProp="name" content={title} />
      <meta itemProp="description" content={description} />
      <meta itemProp="image" content={image} />
      <link rel="icon" href="/favicon.ico" />
    </NextHead>
  )
}

export default Head
