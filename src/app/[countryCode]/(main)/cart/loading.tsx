import { repeat } from "@/lib/utils"

import { Container } from "@/components/ui/react/design-system"

export default function Loading() {
  return (
    <div className="py-12 w-full">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-x-40">
          <div className="flex flex-col bg-background p-6 gap-y-6">
            <div className="bg-background flex items-start justify-between">
              <div className="flex flex-col gap-y-2">
                <div className="w-60 h-8 bg-muted animate-pulse" />
                <div className="w-48 h-6 bg-muted animate-pulse" />
              </div>
              <div>
                <div className="w-14 h-8 bg-muted animate-pulse" />
              </div>
            </div>
            <div>
              <div className="pb-3 flex items-center">
                <div className="w-20 h-12 bg-muted animate-pulse" />
              </div>
              <table className="w-full border-collapse">
                <thead className="border-t-0">
                  <tr>
                    <th className="!pl-0 text-left">
                      <div className="w-10 h-6 bg-muted animate-pulse" />
                    </th>
                    <th></th>
                    <th>
                      <div className="w-16 h-6 bg-muted animate-pulse" />
                    </th>
                    <th>
                      <div className="w-12 h-6 bg-muted animate-pulse" />
                    </th>
                    <th className="!pr-0 text-right">
                      <div className="flex justify-end">
                        <div className="w-12 h-6 bg-muted animate-pulse" />
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {repeat(4).map((index) => (
                    <tr key={index} className="w-full m-4">
                      <td className="!pl-0 p-4 w-24">
                        <div className="flex w-24 h-24 p-4 bg-muted rounded-large animate-pulse" />
                      </td>
                      <td className="text-left">
                        <div className="flex flex-col gap-y-2">
                          <div className="w-32 h-4 bg-muted animate-pulse" />
                          <div className="w-24 h-4 bg-muted animate-pulse" />
                        </div>
                      </td>
                      <td>
                        <div className="flex gap-2 items-center">
                          <div className="w-6 h-8 bg-muted animate-pulse" />
                          <div className="w-14 h-10 bg-muted animate-pulse" />
                        </div>
                      </td>
                      <td>
                        <div className="flex gap-2">
                          <div className="w-12 h-6 bg-muted animate-pulse" />
                        </div>
                      </td>
                      <td className="!pr-0 text-right">
                        <div className="flex gap-2 justify-end">
                          <div className="w-12 h-6 bg-muted animate-pulse" />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="flex flex-col gap-y-8">
            <div className="grid-cols-1">
              <div className="flex flex-col">
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
              <div className="mt-4">
                <div className="w-full min-h-[50px] px-5 py-[10px] bg-muted"></div>
              </div>
            </div>
            <div className="w-full flex flex-col">
              <div className="bg-muted h-7 w-24 mb-4"></div>
              <div className="grid grid-cols-[1fr_80px] gap-x-2">
                <div className="bg-muted h-12"></div>
                <div className="bg-muted h-12"></div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  )
}
