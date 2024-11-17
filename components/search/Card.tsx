'use client'

import { useRouter } from 'next/navigation'
import { Card, CardBody } from '@nextui-org/card'
import { Image } from '@nextui-org/image'
import { Chip } from '@nextui-org/chip'
import { KunCardStats } from '~/components/kun/CardStats'

interface Props {
  patch: GalgameCard
}

export const SearchCard = ({ patch }: Props) => {
  const router = useRouter()

  return (
    <Card
      className="transition-transform hover:scale-105"
      isPressable
      onPress={() => router.push(`/patch/${patch.id}/introduction`)}
    >
      <CardBody className="p-4">
        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="relative w-full sm:w-40">
            <Image
              src={patch.banner.replace(/\.avif$/, '-mini.avif')}
              alt={patch.name}
              className="object-cover w-full h-full rounded-lg"
              radius="lg"
            />
          </div>
          <div className="flex-1 space-y-3">
            <h3 className="text-xl font-semibold line-clamp-2">{patch.name}</h3>

            <KunCardStats patch={patch} />

            <div className="flex flex-wrap gap-2">
              {patch.type.map((type) => (
                <Chip
                  key={type}
                  size="sm"
                  color="primary"
                  variant="flat"
                  className="text-xs"
                >
                  {type}
                </Chip>
              ))}
              {patch.platform.map((platform) => (
                <Chip
                  key={platform}
                  size="sm"
                  color="secondary"
                  variant="flat"
                  className="text-xs"
                >
                  {platform}
                </Chip>
              ))}
              {patch.language.map((lang) => (
                <Chip
                  key={lang}
                  size="sm"
                  color="success"
                  variant="flat"
                  className="text-xs"
                >
                  {lang}
                </Chip>
              ))}
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  )
}