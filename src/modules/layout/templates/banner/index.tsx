import BannerMessage from "@modules/layout/components/banner-message"
import CountrySelect from "@modules/layout/components/country-select"

const Banner = () => {
  return (
    <div className="bg-gray-900 flex items-center justify-between px-8 text-white">
      <CountrySelect />
      <BannerMessage />
    </div>
  )
}

export default Banner
