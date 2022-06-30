type StepEnumeratorProps = {
  step: number
}

const StepEnumerator = ({ step }: StepEnumeratorProps) => {
  return (
    <div className="bg-gray-900 w-8 h-8 rounded-full text-white flex justify-center items-center font-mono text-sm">
      {step}
    </div>
  )
}

export default StepEnumerator
