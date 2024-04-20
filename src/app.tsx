import './app.css'
import { Plus, Search, FileDown, Filter } from "lucide-react"
import { Header } from './components/header'
import { Tabs } from './components/tabs'
import { Button } from './components/ui/button'
import { Control, Input } from './components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './components/ui/table'
import { useQuery, keepPreviousData, useQueryClient } from '@tanstack/react-query'
import { useSearchParams } from 'react-router-dom'
import { useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { CreateTagForm } from './components/create-tag-form'
import { firebaseConfig } from './dataFireBase'
import { collection, deleteDoc, doc, getDocs, getFirestore, } from 'firebase/firestore'
import  jsPDF from 'jspdf'
import autoTable from "jspdf-autotable"


export interface TagResponse {
  first: number
  prev: number | null
  next: number
  last: number
  pages: number
  items: number
}

export function App() {
  const [searchParams, setSeachParams] = useSearchParams()
  const ulrFilter = searchParams.get('filter') ?? ''

  const [filter, setFilter] = useState(ulrFilter);

  const page = searchParams.get('page') ? Number(searchParams.get('page')) : 1


  const db = getFirestore(firebaseConfig);
  const tagsRef = collection(db, "tags");

  const getTags = async () => {
    const data = await getDocs(tagsRef);
    const dataFireBase = (data.docs.map((doc) => ({
      title: doc.data().title,
      valueProducts: doc.data().valueProducts, id: doc.id
    })))
    return dataFireBase
  }
  const queryClient = useQueryClient();

  async function deleteTag(id: string): Promise<void> {
    try {
      const userDoc = doc(db, "tags", id);
      await deleteDoc(userDoc);
      queryClient.invalidateQueries({
        queryKey: ["get-tags"],
      });
    } catch (error) {
      // Lidar com erros de solicitação, se necessário
      console.error('Erro ao excluir a tag:', error);
    }
  }

  async function deleteAllTag(): Promise<void> {
    try {
      const userDoc = doc(db, "tags");
      await deleteDoc(userDoc);
      queryClient.invalidateQueries({
        queryKey: ["get-tags"],
      });
    } catch (error) {
      // Lidar com erros de solicitação, se necessário
      console.error('Erro ao excluir a tag:', error);
    }
  }


  const { data: tagResponse, isLoading } = useQuery({
    queryKey: ['get-tags', ulrFilter, page],
    queryFn: async () => {
      try {
        const data = await getTags();
        return data;
      } catch (error) {
        throw new Error('Erro ao buscar dados: ' + error);
      }
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

  function generatePDFTable() {
    const doc = new jsPDF()
    autoTable(doc, { 
      html: '#my-table' 
    })
    doc.save('table.pdf')
  }


  return (
    <div className='py-10 px-10 space-y-8'>
      <div>
        <Header />
        <Tabs />
      </div>
      <main className='max-w-6xl mx-auto  space-y-5'>
        <div className='flex  items-center gap-3'>
          {/* <h1 className='text-xl font-bold'>Orçamento</h1> */}
          <Dialog.Root>
            <Dialog.DialogTrigger asChild>
              <Button variant='primary'>
                <Plus className='size-3' />
                novo orcamento
              </Button>
            </Dialog.DialogTrigger>

            <Dialog.Portal>
              <Dialog.Overlay className='fixed inset-0 bg-black/70' />
              <Dialog.Content className='fixed p-10 space-y-10 right-0 top-0 bottom-0 h-screen min-w-[320px] z-10 bg-indigo-100 border-l border-zinc-900'>
                <div className='space-y-3'>
                  <Dialog.Title className='text-2xl font-bold text-zinc-800'>
                    Adicionar novos itens no orcamento.
                  </Dialog.Title>
                  <Dialog.Description className='text-md text-zinc-800'>
                    Inclua na tabela os seus itens.
                  </Dialog.Description>
                </div>
                <CreateTagForm />
                <Dialog.Close />
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        </div>
        <div className='flex justify-between gap-4 flex-wrap'>
          <div className="flex  gap-2  mb-2">
            <div>
              <Input variant='filter'>
                <Search className="size-3" />
                <Control
                  placeholder="Search tags..."
                  onChange={e => setFilter(e.target.value)}
                  value={filter}
                />
              </Input>
            </div>
            <div>
              <Button variant="primary" onClick={handleFilter}>
                <Filter className="size-3" />
                Filtrar
              </Button>
            </div>
          </div>
          <div className='flex gap-2'>
            <div>
              <Button variant='primary' onClick={() => generatePDFTable()} >
                <FileDown className='size-3' />
                gerar pdf
              </Button>
            </div>
            <div>
              <Button variant='primary'>
                <FileDown className='size-3' onClick={() => deleteAllTag()} />
                excluir tudo
              </Button>
            </div>
          </div>
        </div>
          <Table id='my-table'>
            <TableHeader>
              <TableRow>
                <TableHead></TableHead>
                <TableHead className='text-black'>Produtos</TableHead>
                <TableHead className='text-black'>Valores dos produtos</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tagResponse?.map((tag) => {
                return (
                  <TableRow key={tag.id}>
                    <TableCell></TableCell>
                    <TableCell>
                      <div className='flex flex-col gap-0.5'>
                        <span className='font-medium'>{tag.title}</span>
                      </div>
                    </TableCell>
                    <TableCell className='text-blackpn'>
                      $ {tag.valueProducts},00
                    </TableCell>
                    <TableCell className='text-right'>
                      <Button className='bg-red-600' onClick={() => 
                        deleteTag(tag.id)}>
                        X
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        {/* {tagResponse && <Pagination pages={tagResponse.pages} items={tagResponse.items} page={page} />} */}
      </main>
    </div>
  )
}

