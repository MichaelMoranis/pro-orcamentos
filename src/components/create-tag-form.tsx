import { Button } from "./ui/button";
import { Check, X, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import * as Dialog from '@radix-ui/react-dialog'
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function CreateTagForm() {
    const queryClient = useQueryClient();
  // fazendo validacao de formulario 
  const createTagSchema = z.object({
    amountOfVideos: z.string(),
    title: z.string().min(3, { message: 'Minimum 03 characters.' }),
  
  })

  // inferencia de tipo a partir de uma variavel existente
  type CreateTagSchema = z.infer<typeof createTagSchema>

  function getSlugFromString(input: string): string {
    return  input
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .replace(/\s+/g, '-');
  }

  const { register, handleSubmit, watch, formState,  } = useForm<CreateTagSchema>({
    resolver: zodResolver(createTagSchema)
  })

  const { mutateAsync } = useMutation({
    mutationFn: async ({ title, amountOfVideos }: CreateTagSchema) => {

      await new Promise(resolve => setTimeout(resolve, 1000))

      await fetch('http://localhost:3333/tags', {
       method: 'Post',
       body: JSON.stringify({
         title,
         slug, 
         amountOfVideos: Number(amountOfVideos),
       })
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["get-tags"],
      })
    }
   })

 async function createTag({ title, amountOfVideos }: CreateTagSchema) {
      await mutateAsync({ title, amountOfVideos });
  }
  const slug =  watch('title') ? getSlugFromString(watch('title')) : ''

  return (
    <form onSubmit={handleSubmit(createTag)} className="w-full space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-medium block text-zinc-800" htmlFor="title">Nome do produto:</label>
        <input
          {...register('title')}
          className="border border-indigo-400 rounded-lg px-3 px-y bg-zinc-400/50 w-full"
          id="name"
          type="text"
        />
        {formState.errors?.title && (
          <p className="text-sm text-red-400">{formState.errors.title.message}</p>
        )}
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium block text-zinc-800" htmlFor="amountOfVideos">preco:</label>
        <input
          {...register('amountOfVideos')}
          className="border border-indigo-400 rounded-lg px-3 px-y bg-zinc-400/50 w-full"
          placeholder="$"
          type="text"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium block text-zinc-800" htmlFor="slug">produto:</label>
        <input
          className="border border-indigo-400 rounded-lg px-3 px-y bg-zinc-400/50 w-full"
          id="slug"
          type="text"
          value={slug}
          readOnly />
      </div>
      <div className="flex items-center justify-end gap-2">
        <Dialog.Close asChild>
          <Button className="bg-indigo-500 border-indigo-400 text-zinc-200 text-sm">
            <X className="size-3" />
            Cancel
          </Button>
        </Dialog.Close>
        <Button disabled={formState.isSubmitting} className=" bg-indigo-500 border-indigo-400 text-zinc-200 text-sm" type="submit">
          {formState.isSubmitting ? <Loader2 className='size-3 animate-spin' /> :  <Check className="size-3" />}
          Save
        </Button>
      </div>
    </form>
  )
}