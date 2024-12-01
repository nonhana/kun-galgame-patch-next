'use client'

import { useState } from 'react'
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Textarea,
  Select,
  SelectItem,
  useDisclosure
} from '@nextui-org/react'
import { Edit2 } from 'lucide-react'
import { USER_ROLE_MAP, USER_STATUS_MAP } from '~/constants/user'
import { kunFetchPut } from '~/utils/kunFetch'
import type { AdminUser } from '~/types/api/admin'
import { useErrorHandler } from '~/hooks/useErrorHandler'
import toast from 'react-hot-toast'

interface Props {
  initialUser: AdminUser
}

const roleOptions = Object.entries(USER_ROLE_MAP).map(([value, label]) => ({
  value: Number(value),
  label
}))

const statusOptions = Object.entries(USER_STATUS_MAP).map(([value, label]) => ({
  value: Number(value),
  label
}))

export const UserEdit = ({ initialUser }: Props) => {
  const [user, setUser] = useState<AdminUser>(initialUser)
  const { isOpen, onOpen, onClose } = useDisclosure()

  const handleChange = (key: keyof AdminUser, value: string | number) => {
    setUser((prev) => ({ ...prev, [key]: value }))
  }

  const [updating, setUpdating] = useState(false)
  const handleUpdateUserInfo = async () => {
    const requestData = {
      uid: user.id,
      name: user.name,
      role: user.role,
      status: user.status,
      dailyImageCount: user.dailyImageCount,
      bio: user.bio
    }

    setUpdating(true)
    const res = await kunFetchPut<KunResponse<{}>>('/admin/user', requestData)
    useErrorHandler(res, () => {
      toast.success('更新用户信息成功')
    })
    setUpdating(false)
    onClose()
  }

  return (
    <>
      <Button isIconOnly size="sm" variant="light" onClick={onOpen}>
        <Edit2 size={16} />
      </Button>

      <Modal size="2xl" isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          <ModalHeader>编辑用户: {user.name}</ModalHeader>
          <ModalBody>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="用户名"
                value={user.name}
                onChange={(e) => handleChange('name', e.target.value)}
              />
              <Select
                label="角色"
                selectedKeys={[String(user.role)]}
                onChange={(e) => handleChange('role', Number(e.target.value))}
              >
                {roleOptions.map((role) => (
                  <SelectItem key={role.value} value={role.value}>
                    {role.label}
                  </SelectItem>
                ))}
              </Select>
              <Select
                label="状态"
                selectedKeys={[String(user.status)]}
                onChange={(e) => handleChange('status', Number(e.target.value))}
              >
                {statusOptions.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </Select>
              <Input
                label="每日图片限额"
                type="number"
                value={String(user.dailyImageCount)}
                onChange={(e) =>
                  handleChange('dailyImageCount', Number(e.target.value))
                }
              />
              <div className="col-span-2">
                <Textarea
                  label="签名"
                  value={user.bio}
                  onChange={(e) => handleChange('bio', e.target.value)}
                />
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="light" onPress={onClose}>
              取消
            </Button>
            <Button
              color="primary"
              isDisabled={updating}
              isLoading={updating}
              onPress={handleUpdateUserInfo}
            >
              保存
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
