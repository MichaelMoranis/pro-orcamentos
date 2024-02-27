import { Settings } from 'lucide-react'

export function Tabs() {
  return (
    <div className="border-b border-zinc-800 py-4">
      <nav className="flex items-center gap-2 max-w-[1200px] mx-auto">

        <a href="" className="py-1.5 px-3 text-zinc-300 inline-flex items-center text-sm gap-1.5 font-medium rounded-full border border-transparent hover:border-zinc-800">
          <Settings className="size-4" />
          Configuracoes
        </a>
      </nav>
    </div>
  )
}