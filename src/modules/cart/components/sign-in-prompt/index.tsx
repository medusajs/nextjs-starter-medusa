import Button from "@modules/common/components/button"
import Link from "next/link"

const SignInPrompt = () => {
  return (
    <div className="bg-white flex items-start justify-between">
      <div>
        <h2 className="text-xl-semi">Already have an account?</h2>
        <p className="text-base-regular text-gray-700 mt-2">
          Sign in for a better experience.
        </p>
      </div>
      <div>
        <Link href="/account/login">
          <Button variant="secondary">Sign in</Button>
        </Link>
      </div>
    </div>
  )
}

export default SignInPrompt
