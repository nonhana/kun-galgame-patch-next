'use client'

import { useEffect } from 'react'
import { Card, CardBody, Button } from '@nextui-org/react'
import { motion } from 'framer-motion'
import { BadgeCheck, Rocket, Home } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useConfetti } from '~/hooks/useConfetti'

export default function Kun() {
  const router = useRouter()
  const triggerConfetti = useConfetti()

  useEffect(() => {
    triggerConfetti()
  }, [triggerConfetti])

  return (
    <div className="w-full m-auto">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="mx-auto max-w-96">
          <CardBody className="flex flex-col items-center gap-6 py-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="flex items-center justify-center w-20 h-20 rounded-full"
            >
              <BadgeCheck
                className="w-20 h-20 text-primary-foreground"
                fill="#006FEE"
              />
            </motion.div>

            <div className="space-y-2 text-center">
              <motion.h1
                className="text-3xl font-bold"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                恭喜成为创作者！
              </motion.h1>
              <motion.p
                className="text-default-500"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                您现在可以使用创作者专属功能了
              </motion.p>
            </div>

            <motion.div
              className="space-x-4"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <Button
                startContent={<Rocket className="w-4 h-4" />}
                color="primary"
                variant="shadow"
                className="flex-1"
                size="lg"
                onClick={() => router.push('/edit/create')}
              >
                发布补丁
              </Button>
              <Button
                startContent={<Home className="w-4 h-4" />}
                variant="bordered"
                className="flex-1"
                size="lg"
                onClick={() => router.push('/')}
              >
                返回首页
              </Button>
            </motion.div>
          </CardBody>
        </Card>
      </motion.div>
    </div>
  )
}