export default function Loading() {
  return (
    <div className="bg-card py-6 min-h-[calc(100vh-64px)] animate-pulse">
      <div className="container flex justify-center">
        <div className="max-w-4xl h-full bg-background w-full p-10">
          <div className="flex flex-col gap-y-2 pb-10 animate-pulse">
            <div className="w-2/5 h-4 bg-muted"></div>
            <div className="w-3/6 h-6 bg-muted"></div>
            <div className="flex gap-x-4">
              <div className="w-16 h-4 bg-muted"></div>
              <div className="w-12 h-4 bg-muted"></div>
            </div>
          </div>

          <div className="flex flex-col gap-y-4 py-10 border-y">
            <div className="grid grid-cols-[122px_1fr] gap-x-4">
              <div className="w-full aspect-[29/34] bg-muted"></div>
              <div className="flex items-start justify-between">
                <div className="flex flex-col gap-y-2">
                  <div className="w-48 h-6 bg-muted"></div>
                  <div className="w-24 h-4 bg-muted"></div>
                  <div className="w-32 h-4 bg-muted"></div>
                </div>
                <div className="w-32 h-6 bg-muted"></div>
              </div>
            </div>

            <div className="grid grid-cols-[122px_1fr] gap-x-4">
              <div className="w-full aspect-[29/34] bg-muted"></div>
              <div className="flex items-start justify-between">
                <div className="flex flex-col gap-y-2">
                  <div className="w-48 h-6 bg-muted"></div>
                  <div className="w-24 h-4 bg-muted"></div>
                  <div className="w-32 h-4 bg-muted"></div>
                </div>
                <div className="w-32 h-6 bg-muted"></div>
              </div>
            </div>

            <div className="grid grid-cols-[122px_1fr] gap-x-4">
              <div className="w-full aspect-[29/34] bg-muted"></div>
              <div className="flex items-start justify-between">
                <div className="flex flex-col gap-y-2">
                  <div className="w-48 h-6 bg-muted"></div>
                  <div className="w-24 h-4 bg-muted"></div>
                  <div className="w-32 h-4 bg-muted"></div>
                </div>
                <div className="w-32 h-6 bg-muted"></div>
              </div>
            </div>
          </div>

          <div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 py-10 border-b">
              <div className="flex flex-col">
                <div className="w-32 h-4 bg-muted mb-4"></div>
                <div className="w-2/6 h-3 bg-muted"></div>
                <div className="w-3/6 h-3 bg-muted my-2"></div>
                <div className="w-1/6 h-3 bg-muted"></div>
              </div>
              <div className="flex flex-col">
                <div className="w-32 h-4 bg-muted mb-4"></div>
                <div className="w-2/6 h-3 bg-muted"></div>
                <div className="w-3/6 h-3 bg-muted my-2"></div>
                <div className="w-2/6 h-3 bg-muted"></div>
                <div className="w-1/6 h-3 bg-muted mt-2"></div>
                <div className="w-32 h-4 bg-muted my-4"></div>
                <div className="w-1/6 h-3 bg-muted"></div>
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 py-10">
              <div className="flex flex-col">
                <div className="w-32 h-4 bg-muted mb-4"></div>
                <div className="w-2/6 h-3 bg-muted"></div>
                <div className="w-3/6 h-3 bg-muted my-4"></div>
              </div>

              <div className="flex flex-col">
                <div className="w-32 h-4 bg-muted mb-4"></div>
                <div className="flex items-center justify-between">
                  <div className="w-32 h-3 bg-muted"></div>
                  <div className="w-32 h-3 bg-muted"></div>
                </div>

                <div className="flex items-center justify-between my-4">
                  <div className="w-24 h-3 bg-muted"></div>
                  <div className="w-24 h-3 bg-muted"></div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="w-28 h-3 bg-muted "></div>
                  <div className="w-20 h-3 bg-muted"></div>
                </div>

                <div className="w-full border-b border-dashed my-4"></div>

                <div className="flex items-center justify-between">
                  <div className="w-32 h-6 bg-muted mb-4"></div>
                  <div className="w-24 h-6 bg-muted mb-4"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
