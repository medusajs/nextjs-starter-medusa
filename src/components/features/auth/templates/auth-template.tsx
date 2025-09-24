"use client"

import { useState } from "react"

import { LoginView } from "@/components/features/auth/views/login-view"
import { RegisterView } from "@/components/features/auth/views/register-view"

enum AUTH_VIEW {
  SIGN_IN = "sign-in",
  REGISTER = "register",
}

function AuthTemplate() {
  const [currentView, setCurrentView] = useState(AUTH_VIEW.SIGN_IN)

  return (
    <div className="w-full flex justify-start py-8">
      {currentView === AUTH_VIEW.SIGN_IN ? (
        <LoginView setCurrentView={setCurrentView} />
      ) : (
        <RegisterView setCurrentView={setCurrentView} />
      )}
    </div>
  )
}

export { AuthTemplate, AUTH_VIEW }
