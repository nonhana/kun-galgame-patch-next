'use client'

import { useState } from 'react'
import { Button } from '@nextui-org/button'
import toast from 'react-hot-toast'
import { api } from '~/lib/trpc-client'
import { useErrorHandler } from '~/hooks/useErrorHandler'

interface Props {
  username: string
  email: string
  type: 'register' | 'email'
}

export const EmailVerification = ({ username, email, type }: Props) => {
  const [countdown, setCountdown] = useState(0)
  const [loading, setLoading] = useState(false)

  const startCountdown = () => {
    setCountdown(60)
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const handleSendCode = async () => {
    if (!email) {
      toast.error('请输入合法的邮箱格式')
      return
    }
    setLoading(true)

    let res

    if (type === 'register') {
      res = await api.auth.sendRegisterCode.mutate({
        name: username,
        email
      })
    } else {
      res = await api.user.sendResetEmailVerificationCode.mutate({
        email
      })
    }

    useErrorHandler(res, () => {
      toast.success('发送成功, 验证码已发送到您的邮箱')
      startCountdown()
    })

    setLoading(false)
  }

  return (
    <Button
      onClick={handleSendCode}
      isDisabled={countdown > 0 || loading}
      size="sm"
      variant="light"
    >
      {loading
        ? '发送中...'
        : countdown > 0
          ? `${countdown}秒后重试`
          : '发送验证码'}
    </Button>
  )
}
