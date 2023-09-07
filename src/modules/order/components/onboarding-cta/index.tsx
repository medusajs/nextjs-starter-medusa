import Button from "@modules/common/components/button"

const OnboardingCta = ({ orderId }: { orderId: string }) => {
  return (
    <div className="max-w-4xl h-full bg-white w-full mb-4">
      <div className="flex flex-col gap-y-6 center p-10 md:items-center">
        <span className="text-gray-700 text-xl">
          Your test order was successfully created! 🎉
        </span>
        <span className="text-gray-700 text-small-regular">
          You can now complete setting up your store in the admin.
        </span>
        <a
          href={`http://localhost:7001/a/orders/?order_id=${orderId}&onboarding_step=setup_finished_nextjs`}
        >
          <Button className="md:w-80">Complete setup in admin</Button>
        </a>
      </div>
    </div>
  )
}

export default OnboardingCta
