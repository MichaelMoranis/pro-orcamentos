
import logo from '../assets/logo.svg'
import { Badge } from './ui/badge'

export function Header() {
  return (
    <div className="max-w-[1200px] mx-auto flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2.5">
          <img src={logo} alt="nivo.video" />
        </div>

        <svg
          width="6"
          height="16"
          viewBox="0 0 6 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <line
            x1="1.18372"
            y1="15.598"
            x2="5.32483"
            y2="0.143194"
            className="stroke-zinc-700"
          />
        </svg>

        <div className="flex items-center gap-2.5">
          <span className="text-sm font-medium text-black">Netuno</span>
          <Badge variant="primary">PRO</Badge>
        </div>
      </div>
      <div>
        <h1 className='font-bold text-xl'>Gerenciador de Orcamentos</h1>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex flex-col items-end gap-0.5">
          <span className="text-sm font-medium">Michael</span>
        </div>
        <img
          src="https://github.com/michaelmoranis.png"
          className="size-8 rounded-full"
          alt=""
        />
      </div>
    </div>
  )
}
