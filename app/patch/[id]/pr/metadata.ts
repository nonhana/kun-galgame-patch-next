import { kunMoyuMoe } from '~/config/moyu-moe'
import type { Metadata } from 'next'
import type { KunSiteAuthor } from '~/config/config'
import type { PatchPullRequest, Patch } from '~/types/api/patch'

export const generateKunMetadataTemplate = (
  patch: Patch,
  pr: PatchPullRequest[]
): Metadata => {
  const authors: KunSiteAuthor[] = pr.map((p) => ({
    name: p.user.name,
    url: `${kunMoyuMoe.domain.main}/user/${p.user.id}/resource`
  }))
  const uniqueAuthors = authors.filter(
    (author, index, self) =>
      index === self.findIndex((a) => a.name === author.name)
  )
  const uniqueAuthorsName = uniqueAuthors.map((u) => u.name)

  return {
    title: `${patch.name} | ${patch.alias[0]} 的 pull request`,
    keywords: [...patch.alias, '更新请求'],
    authors: uniqueAuthors,
    creator: patch.user.name,
    publisher: patch.user.name,
    description: `${uniqueAuthorsName} 在 ${patch.name} 下提出了 ${pr[0].content} 等 ${pr.length} 个 pull request`,
    openGraph: {
      title: `${patch.name} | ${patch.alias[0]} 的 pull request`,
      description: `${uniqueAuthorsName} 在 ${patch.name} 下提出了 ${pr[0].content} 等 ${pr.length} 个 pull request`,
      type: 'article',
      publishedTime: patch.created,
      modifiedTime: patch.updated,
      images: [
        {
          url: patch.banner,
          width: 1920,
          height: 1080,
          alt: patch.name
        }
      ]
    },
    twitter: {
      card: 'summary',
      title: `${patch.name} | ${patch.alias[0]} 的 pull request`,
      description: `${uniqueAuthorsName} 在 ${patch.name} 下提出了 ${pr[0].content} 等 ${pr.length} 个 pull request`,
      images: [patch.banner]
    },
    alternates: {
      canonical: `${kunMoyuMoe.domain.main}/patch/${patch.id}/pr`
    }
  }
}