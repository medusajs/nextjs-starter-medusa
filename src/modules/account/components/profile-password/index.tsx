"use client"

import { useTranslations } from "next-intl"

import React, { useEffect, useActionState } from "react"
import Input from "@modules/common/components/input"
import AccountInfo from "../account-info"
import { HttpTypes } from "@medusajs/types"
import { toast } from "@medusajs/ui"

type MyInformationProps = {
  customer: HttpTypes.StoreCustomer
}

const ProfilePassword: React.FC<MyInformationProps> = ({ customer }) => {
  const t = useTranslations()
  
  const [successState, setSuccessState] = React.useState(false)

  // TODO: Add support for password updates
  const updatePassword = async () => {
    toast.info(t('PASSWORD_UPDATE_NOT_IMPLEMENTED'))
  }

  const clearState = () => {
    setSuccessState(false)
  }

  return (
    <form
      action={updatePassword}
      onReset={() => clearState()}
      className="w-full"
    >
      <AccountInfo
        label="Password"
        currentInfo={
          <span>{t('THE_PASSWORD_IS_NOT_SHOWN_FOR')}</span>
        }
        isSuccess={successState}
        isError={false}
        errorMessage={undefined}
        clearState={clearState}
        data-testid="account-password-editor"
      >
        <div className="grid grid-cols-2 gap-4">
          <Input
            label={t('OLD_PASSWORD')}
            name="old_password"
            required
            type="password"
            data-testid="old-password-input"
          />
          <Input
            label={t('NEW_PASSWORD')}
            type="password"
            name="new_password"
            required
            data-testid="new-password-input"
          />
          <Input
            label={t('CONFIRM_PASSWORD')}
            type="password"
            name="confirm_password"
            required
            data-testid="confirm-password-input"
          />
        </div>
      </AccountInfo>
    </form>
  )
}

export default ProfilePassword
