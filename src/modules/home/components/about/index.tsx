type AboutProps = {
  content?: string | null
}

const About = ({ content }: AboutProps) => {
  if (!content) {
    return null
  }

  return (
    <section className="content-container py-12">
      <div
        className="prose max-w-none"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </section>
  )
}

export default About
