'use client'

import { z } from 'zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@nextui-org/button'
import { Link } from '@nextui-org/link'
import {
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter
} from '@nextui-org/react'
import toast from 'react-hot-toast'
import { api } from '~/lib/trpc-client'
import { patchResourceCreateSchema } from '~/validations/patch'
import { ResourceLinksInput } from './ResourceLinksInput'
import { ResourceDetailsForm } from './ResourceDetailsForm'
import { Upload } from 'lucide-react'
import { FileUpload } from '../upload/FileUpload'
import { ResourceTypeSelect } from './ResourceTypeSelect'
import { useErrorHandler } from '~/hooks/useErrorHandler'
import type { PatchResource } from '~/types/api/patch'

export type ResourceFormData = z.infer<typeof patchResourceCreateSchema>

interface CreateResourceProps {
  patchId: number
  onClose: () => void
  onSuccess?: (res: PatchResource) => void
}

export const PublishResource = ({
  patchId,
  onClose,
  onSuccess
}: CreateResourceProps) => {
  const [creating, setCreating] = useState(false)

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
    watch
  } = useForm<ResourceFormData>({
    resolver: zodResolver(patchResourceCreateSchema),
    defaultValues: {
      patchId,
      storage: 's3',
      hash: '',
      content: '',
      code: '',
      type: [],
      language: [],
      platform: [],
      size: '',
      password: '',
      note: ''
    }
  })

  const onSubmit = async (data: ResourceFormData) => {
    setCreating(true)
    const res = await api.patch.createPatchResource.mutate(data)
    setCreating(false)
    useErrorHandler(res, (value) => {
      reset()
      onSuccess?.(value)
      toast.success('资源发布成功')
    })
  }

  const handleUploadSuccess = (
    storage: string,
    hash: string,
    content: string,
    size: string
  ) => {
    setValue('storage', storage)
    setValue('hash', hash)
    setValue('content', content)
    setValue('size', size)
  }

  return (
    <ModalContent>
      <ModalHeader className="flex-col space-y-2">
        <h3 className="text-lg">创建补丁资源</h3>
        <p className="text-sm font-medium text-default-500">
          您需要先自行发布 3 个补丁资源以使用我们的对象存储, 当您发布完成 3
          个补丁后, 您可以 <Link href="#">申请成为创作者</Link>
        </p>
      </ModalHeader>

      <ModalBody>
        <form className="space-y-6">
          <ResourceTypeSelect control={control} errors={errors} />

          {watch().storage !== 'user' && (
            <FileUpload
              onSuccess={handleUploadSuccess}
              handleRemoveFile={() => reset()}
            />
          )}

          {(watch().storage === 'user' || watch().content) && (
            <ResourceLinksInput
              errors={errors}
              storage={watch().storage}
              content={watch().content}
              setContent={(content) => setValue('content', content)}
            />
          )}

          <ResourceDetailsForm control={control} errors={errors} />
        </form>
      </ModalBody>

      <ModalFooter>
        <Button color="danger" variant="light" onPress={onClose}>
          取消
        </Button>
        <Button
          color="primary"
          type="submit"
          disabled={creating}
          isLoading={creating}
          endContent={<Upload className="w-4 h-4" />}
          onClick={handleSubmit(onSubmit)}
        >
          发布资源
        </Button>
      </ModalFooter>
    </ModalContent>
  )
}
