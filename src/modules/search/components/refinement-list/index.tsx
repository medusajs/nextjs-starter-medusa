import {
  useRefinementList,
  UseRefinementListProps,
} from "react-instantsearch-hooks-web"

const RefinementList = (props: UseRefinementListProps) => {
  const { items } = useRefinementList(props)

  return (
    <div>
      {items.map((item, i) => (
        <span key={i}>{item.label}</span>
      ))}
    </div>
  )
}

export default RefinementList
