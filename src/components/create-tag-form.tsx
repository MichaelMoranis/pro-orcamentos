import { Button } from "./ui/button";
import { Check, X, Loader2, } from "lucide-react";
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import * as Dialog from '@radix-ui/react-dialog'
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {collection, addDoc, getFirestore} from "firebase/firestore"
import { firebaseConfig } from "../dataFireBase";

export function CreateTagForm() {
  const queryClient = useQueryClient();
  // fazendo validacao de formulario 
  const createTagSchema = z.object({
    valueProducts: z.string(),
    title: z.string().min(3, { message: 'Minimum 03 characters.' }),

  })

  const db = getFirestore(firebaseConfig)
  const userColectionRef = collection(db, "tags");


  async function createTags({title, valueProducts}: CreateTagSchema) {
    // funcao que envia dados para o banco de dados firestore
    await addDoc(userColectionRef, {
      title, 
      valueProducts,
    })
  }

  // inferencia de tipo a partir de uma variavel existente
  type CreateTagSchema = z.infer<typeof createTagSchema>


  const { register, handleSubmit, formState, } = useForm<CreateTagSchema>({
    resolver: zodResolver(createTagSchema)
  })

  const { mutateAsync } = useMutation({
    mutationFn: async ({ title, valueProducts }: CreateTagSchema) => {

      await new Promise(resolve => setTimeout(resolve, 1000))

      createTags({title, valueProducts })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["get-tags"],
      })
    }
  })

  async function createTag({ title, valueProducts }: CreateTagSchema) {
    await mutateAsync({ title, valueProducts});
  }


  return (
    <form onSubmit={handleSubmit(createTag)} className="w-full space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-medium block text-zinc-800" htmlFor="title">Nome do Item:</label>
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
        <label className="text-sm font-medium block text-zinc-800" htmlFor="valueProducts">preco:</label>
        <input
          {...register('valueProducts')}
          className="border border-indigo-400 rounded-lg px-3 px-y bg-zinc-400/50 w-full"
          placeholder="$"
          type="text"
        />
      </div>

      <div className="flex items-center justify-end gap-2">
        <Dialog.Close asChild>
          <Button className="bg-indigo-500 border-indigo-400 text-zinc-200 text-sm">
            <X className="size-3" />
            voltar
          </Button>
        </Dialog.Close>
        <Button disabled={formState.isSubmitting} className=" bg-indigo-500 border-indigo-400 text-zinc-200 text-sm" type="submit">
          {formState.isSubmitting ? <Loader2 className='size-3 animate-spin' /> : <Check className="size-3" />}
          salvar
        </Button>
      </div>
    </form>
  )
}