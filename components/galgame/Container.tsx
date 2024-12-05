'use client'

import { useState, useEffect } from 'react'
import { Pagination } from '@nextui-org/pagination'
import { kunFetchPost } from '~/utils/kunFetch'
import { GalgameCard } from './Card'
import { KunMasonryGrid } from '~/components/kun/MasonryGrid'
import { FilterBar } from './FilterBar'
import { useMounted } from '~/hooks/useMounted'
import { KunLoading } from '~/components/kun/Loading'
import type { SortOption, SortDirection } from './_sort'

interface Props {
  initialGalgames: GalgameCard[]
}

export const CardContainer = ({ initialGalgames }: Props) => {
  const [galgames, setGalgames] = useState<GalgameCard[]>(initialGalgames)
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [selectedTypes, setSelectedTypes] = useState<string[]>(['all'])
  const [sortField, setSortField] = useState<SortOption>('created')
  const [sortOrder, setSortOrder] = useState<SortDirection>('desc')
  const isMounted = useMounted()
  const [page, setPage] = useState(1)

  const fetchPatches = async () => {
    setLoading(true)

    const { galgames, total } = await kunFetchPost<{
      galgames: GalgameCard[]
      total: number
    }>('/galgame', {
      selectedTypes,
      sortField,
      sortOrder,
      page,
      limit: 24
    })

    setGalgames(galgames)
    setTotal(total)
    setLoading(false)
  }

  useEffect(() => {
    if (!isMounted) {
      return
    }
    fetchPatches()
  }, [sortField, sortOrder, selectedTypes, page])

  return (
    <div className="container mx-auto my-4 space-y-6">
      <FilterBar
        selectedTypes={selectedTypes}
        setSelectedTypes={setSelectedTypes}
        sortField={sortField}
        setSortField={setSortField}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
      />

      {loading ? (
        <KunLoading hint="正在获取 Galgame 数据..." />
      ) : (
        <KunMasonryGrid columnWidth={256} gap={24}>
          {galgames.map((pa) => (
            <GalgameCard key={pa.id} patch={pa} />
          ))}
        </KunMasonryGrid>
      )}

      {total > 24 && (
        <div className="flex justify-center">
          <Pagination
            total={Math.ceil(total / 24)}
            page={page}
            onChange={(newPage: number) => setPage(newPage)}
            showControls
            color="primary"
            size="lg"
          />
        </div>
      )}
    </div>
  )
}
