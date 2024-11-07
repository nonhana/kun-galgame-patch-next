import React, { useState, useRef } from 'react'
import ReactCrop, { type Crop } from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'
import {
  Avatar,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure
} from '@nextui-org/react'
import { useUserStore } from '~/store/userStore'
import { Camera } from 'lucide-react'
import { dataURItoBlob } from '~/utils/dataURItoBlob'
import { api } from '~/lib/trpc-client'
import { useErrorHandler } from '~/hooks/useErrorHandler'
import toast from 'react-hot-toast'

export const AvatarCrop = () => {
  const { user, setUser } = useUserStore()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [crop, setCrop] = useState<Crop>()
  const [image, setImage] = useState<string | null>(null)
  const [croppedImage, setCroppedImage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const imageRef = useRef<HTMLImageElement | null>(null)

  const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader()
      reader.addEventListener('load', () => {
        setImage(reader.result as string)
        onOpen()
      })
      reader.readAsDataURL(e.target.files[0])
    }
  }

  const getCroppedImg = async () => {
    if (!crop || !imageRef.current) return

    const canvas = document.createElement('canvas')
    const scaleX = imageRef.current.naturalWidth / imageRef.current.width
    const scaleY = imageRef.current.naturalHeight / imageRef.current.height

    canvas.width = crop.width
    canvas.height = crop.height

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.drawImage(
      imageRef.current,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    )

    const base64Image = canvas.toDataURL('image/webp', 0.77)
    const avatarBlob = dataURItoBlob(base64Image)

    const formData = new FormData()
    formData.append('avatar', avatarBlob)

    setLoading(true)
    // @ts-expect-error
    const res = await api.user.updateUserAvatar.mutate(formData)
    useErrorHandler(res, async (value) => {
      setLoading(false)
      toast.success('更新头像成功!')
      setCroppedImage(base64Image)
      setUser({ ...user, avatar: value.avatar })
      onClose()
    })
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative cursor-pointer group">
        <div className="relative group">
          {croppedImage ? (
            <img
              src={croppedImage}
              alt="Cropped avatar"
              className="object-cover w-16 h-16 rounded-full"
            />
          ) : (
            <Avatar
              name={user.name}
              src={user.avatar}
              className="w-16 h-16"
              color="primary"
            />
          )}

          <label
            htmlFor="avatar-upload"
            className="absolute inset-0 flex items-center justify-center transition-opacity rounded-full opacity-0 cursor-pointer bg-black/50 group-hover:opacity-100"
          >
            <Camera className="w-6 h-6 text-white" />
          </label>
          <input
            id="avatar-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={onSelectFile}
          />
        </div>
      </div>

      <Modal isOpen={isOpen} onClose={onClose} placement="center" size="2xl">
        <ModalContent>
          <ModalHeader>裁剪头像</ModalHeader>
          <ModalBody className="flex items-center justify-center">
            {image && (
              <ReactCrop crop={crop} onChange={(c) => setCrop(c)} aspect={1}>
                <img
                  ref={imageRef}
                  src={image}
                  alt="Upload"
                  className="max-h-[60vh] w-auto"
                />
              </ReactCrop>
            )}
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="light" onPress={onClose}>
              取消
            </Button>
            <Button
              color="primary"
              onPress={getCroppedImg}
              isLoading={loading}
              disabled={loading}
            >
              确定
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  )
}