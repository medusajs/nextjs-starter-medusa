import { Heading } from "@medusajs/ui"
import ImageSlider from "@modules/home/components/image-slider"

const Hero = () => {
  return (
    <div className="w-full">
      {/* Image Slider */}
      <div className="content-container py-8">
        <ImageSlider />
      </div>
      
      {/* Welcome Section */}
      <div className="w-full border-b border-ui-border-base relative bg-ui-bg-subtle py-12">
        <div className="content-container text-center">
          <Heading
            level="h1"
            className="text-4xl leading-10 text-ui-fg-base font-bold mb-4"
          >
            Kedişli Sevimli Çanta Atölyesine Hoş Geldiniz
          </Heading>
          <p className="text-lg text-ui-fg-subtle">
            El yapımı sevimli çantalar ve aksesuarlar
          </p>
        </div>
      </div>
    </div>
  )
}

export default Hero
