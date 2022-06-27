import { Fragment } from "react"
import config from "../../../../../store.config.json"

const BannerMessage = () => {
  const messages = config.store.banner_messages

  return (
    <div className="flex items-center text-small-regular">
      {messages.map((message, index) => {
        return (
          <Fragment key={index}>
            <span className="first:ml-0 last:mr-0 mx-2">{message}</span>
            {index !== messages.length - 1 && <span>/</span>}
          </Fragment>
        )
      })}
    </div>
  )
}

export default BannerMessage
