import dynamic from "next/dynamic"
// import { WebContainerComponent } from "./WebContainer"

const WebContainerLazyLoaded = dynamic(() => import('@/app/WebContainer'), {
  loading: () => <p>Loading...</p>,
  ssr: false,
})

export default function Home() {
  return (
    <main className="">
      <h2 className="text-3xl mt-4 mb-6 font-medium">
        WebContainer Test
      </h2>
      <WebContainerLazyLoaded />
    </main>
  )
}
