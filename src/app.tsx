import './app.css'
import { Plus, Search, FileDown, Filter, MoreHorizontal } from "lucide-react"
import { Header } from './components/header'
import { Tabs } from './components/tabs'
import { Button } from './components/ui/button'
import { Control, Input } from './components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './components/ui/table'
import { useQuery, keepPreviousData } from '@tanstack/react-query'
import { Pagination } from './components/pagination'
import { useSearchParams } from 'react-router-dom'
import { useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'

export interface TagResponse {
  first: number
  prev: number | null
  next: number
  last: number
  pages: number
  items: number
  data: Tag[]
}

export interface Tag {
  title: string
  slug: string
  amountOfVideos: number
  id: string
}


export function App() {
  const [searchParams, setSeachParams] = useSearchParams()
  const ulrFilter = searchParams.get('filter') ?? ''

  const [filter, setFilter] = useState(ulrFilter);

  const page = searchParams.get('page') ? Number(searchParams.get('page')) : 1

  const { data: tagResponse, isLoading } = useQuery<TagResponse>({
    queryKey: ['get-tags', ulrFilter, page],
    queryFn: async () => {
      const response = await fetch(`http://localhost:3333/tags?_page=${page}&_per_page&title=${ulrFilter}`)
      const data = await response.json()
      console.log(data)

      await new Promise(resolve => setTimeout(resolve, 1000))

      return data
    },
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60,
  })

  if (isLoading) {
    return null
  }

  function handleFilter() {
    setSeachParams(params => {
      params.set('page', '1'),
        params.set('filter', filter)
      return params
    })
  }

  return (
    <div className='py-10 space-y-8'>
      <div>
        <Header />
        <Tabs />
      </div>
      <main className='max-w-6xl mx-auto space-y-5'>
        <div className='flex items-center gap-3'>
          <h1 className='text-xl font-bold'>Tags</h1>
          <Dialog.Root>
            <Dialog.DialogTrigger asChild>
              <Button variant='primary'>
                <Plus className='size-3' />
                Create new
              </Button>
            </Dialog.DialogTrigger>

            <Dialog.Portal>
              <Dialog.Overlay className='fixed inset-0 bg-black/70' />
              <Dialog.Content className='fixed p-10 right-0 top-0 bottom-0 h-screen min-w-[320px] z-10 bg-zinc-950 border-l border-zinc-900'>
                <div className='space-y-3'>
                  <Dialog.Title className='font-xl font-bold'>
                    Create tag
                  </Dialog.Title>
                  <Dialog.Description className='text-sm text-zinc-500'>
                    Tags can be used to group videos about similar concepts
                  </Dialog.Description>
                </div>
                <Dialog.Close />
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        </div>
        <div className='flex items-center justify-between'>
          <div className="flex items-center">
            <Input variant='filter'>
              <Search className="size-3" />
              <Control
                placeholder="Search tags..."
                onChange={e => setFilter(e.target.value)}
                value={filter}
              />
            </Input>
            <Button onClick={handleFilter}>
              <Filter className="size-3" />
              Filter
            </Button>
          </div>
          <Button>
            <FileDown className='size-3' />
            export
          </Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead></TableHead>
              <TableHead>Tags</TableHead>
              <TableHead>Amount of videos</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tagResponse?.data.map((tag) => {
              return (
                <TableRow key={tag.id}>
                  <TableCell></TableCell>
                  <TableCell>
                    <div className='flex flex-col gap-0.5'>
                      <span className='font-medium'>{tag.title}</span>
                      <span className='text-xs text-zinc-500'>{tag.id}</span>
                    </div>
                  </TableCell>
                  <TableCell className='text-zinc-300'>
                    {tag.amountOfVideos} video(s)
                  </TableCell>
                  <TableCell className='text-right'>
                    <Button className='icon'>
                      <MoreHorizontal className='size-3' />
                    </Button>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
        {tagResponse && <Pagination pages={tagResponse.pages} items={tagResponse.items} page={page} />}
      </main>
    </div>
  )
}

