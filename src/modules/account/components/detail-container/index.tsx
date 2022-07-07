import React from "react"

type DetailProps = {
  title: string
}

type SubDetailProps = {
  title?: string
}

const Detail: React.FC<DetailProps> & {
  SubDetail: React.FC<SubDetailProps>
} = ({ title, children }) => {
  return (
    <div>
      <h2 className="text-large-semi mb-2">{title}</h2>
      <div className="flex flex-col gap-y-4 text-small-regular">{children}</div>
    </div>
  )
}

const SubDetail: React.FC<SubDetailProps> = ({ title, children }) => {
  return (
    <div className="flex flex-col">
      {title && <span className="text-base-semi">{title}</span>}
      <div className="text-small-regular">{children}</div>
    </div>
  )
}

Detail.SubDetail = SubDetail

export default Detail
