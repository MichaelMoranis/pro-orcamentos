import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react'

import { useSearchParams } from 'react-router-dom'
import { Button } from './ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger } from './ui/select'

interface PaginationProps {
  pages: number
  items: number
  page: number
}

export function Pagination({ items, page, pages }: PaginationProps) {
  const [, setSearchParams] = useSearchParams()

  function firstPage() {
    setSearchParams(params => {
      params.set('page', '1')

      return params
    })
  }

  function previousPage() {
    if (page - 1 <= 0) {
      return
    }

    setSearchParams(params => {
      params.set('page', String(page - 1))

      return params
    })
  }

  function nextPage() {
    if (page + 1 > pages) {
      return
    }

    setSearchParams(params => {
      params.set('page', String(page + 1))

      return params
    })
  }

  function lastPage() {
    setSearchParams(params => {
      params.set('page', String(pages))

      return params
    })
  }

  return (
    <div className="flex flex-col text-sm items-center justify-between text- md:flex-row gap-8  text-zinc-900">
      <span>Mostrar {items} itens</span>
      <div className="flex flex-col items-center gap-8 md:flex-row">
        <div className="flex items-center gap-2">
          <span>Itens por pagina</span>

          <Select defaultValue="50">
            <SelectTrigger aria-label="Page" />
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <span>Pagina {page} de {pages}</span>

        <div className="space-x-1.5">
          <Button className='bg-zinc-200 text-zinc-900' onClick={firstPage} size="icon" disabled={page - 1 <= 0}>
            <ChevronsLeft className="size-4" />
            <span className="sr-only">Pagina 01</span>
          </Button>
          <Button className='bg-zinc-200 text-zinc-900' onClick={previousPage} size="icon" disabled={page - 1 <= 0}>
            <ChevronLeft className="size-4" />
            <span className="sr-only">Pagina anterior</span>
          </Button>
          <Button className='bg-zinc-200 text-zinc-900' onClick={nextPage} size="icon" disabled={page + 1 > pages}>
            <ChevronRight className="size-4" />
            <span className="sr-only">Proxima pagina</span>
          </Button>
          <Button className='bg-zinc-200 text-zinc-900' onClick={lastPage} size="icon" disabled={page + 1 > pages}>
            <ChevronsRight className="size-4" />
            <span className="sr-only ">Ultima pagina</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
