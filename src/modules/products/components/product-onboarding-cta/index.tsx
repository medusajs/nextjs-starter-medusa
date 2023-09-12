import Button from "@modules/common/components/button"

const ProductOnboardingCta = () => {
  return (
    <div className="max-w-4xl h-full bg-gray-100 w-full mb-4 p-8">
      <div className="flex flex-col gap-y-6 center">
        <span className="text-gray-700 text-xl">
          Your demo product was successfully created! 🎉
        </span>
        <span className="text-gray-700 text-small-regular">
          You can now continue setting up your store in the admin.
        </span>
        <a href="http://localhost:7001/a/orders?onboarding_step=create_order_nextjs">
          <Button className="md:w-80">Continue setup in admin</Button>
        </a>
      </div>
    </div>
  )
}

export default ProductOnboardingCta
