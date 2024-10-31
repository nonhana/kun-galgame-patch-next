import sharp from 'sharp'
import { router, privateProcedure } from '~/lib/trpc'
import { patchSchema } from '~/validations/edit'
import { uploadObject } from '~/server/utils/uploadImage'
import { checkBufferSize } from '~/server/utils/checkBufferSize'

export const uploadPatchBanner = async (image: ArrayBuffer, id: number) => {
  const banner = await sharp(image)
    .resize(1920, 1080, {
      fit: 'inside',
      withoutEnlargement: true
    })
    .avif({ quality: 50 })
    .toBuffer()
  const miniBanner = await sharp(image)
    .resize(460, 259, {
      fit: 'inside',
      withoutEnlargement: true
    })
    .avif({ quality: 50 })
    .toBuffer()

  if (!checkBufferSize(miniBanner, 1.007)) {
    return '图片体积过大'
  }

  const bucketName = `kun-galgame-patch/patch/${id}/banner`
  const res1 = await uploadObject(banner, 'banner.avif', bucketName)
  const res2 = await uploadObject(miniBanner, 'banner-mini.avif', bucketName)

  return !!(res1 && res2)
}

export const editRouter = router({
  edit: privateProcedure.input(patchSchema).mutation(async ({ ctx, input }) => {
    const { name, vndbId, alias, banner, introduction } = input

    // await ctx.prisma.$executeRaw`ALTER SEQUENCE patch_id_seq RESTART WITH 1`
    // await ctx.prisma
    //   .$executeRaw`ALTER SEQUENCE patch_history_id_seq RESTART WITH 1`

    const currentId: { last_value: number }[] = await ctx.prisma
      .$queryRaw`SELECT last_value FROM patch_id_seq`
    const newId = Number(currentId[0].last_value) + 1

    const bannerArrayBuffer = await banner.arrayBuffer()
    const res = await uploadPatchBanner(bannerArrayBuffer, newId)
    if (!res) {
      return '上传图片错误, 未知错误'
    }
    if (typeof res === 'string') {
      return res
    }

    const imageLink = `${process.env.KUN_VISUAL_NOVEL_IMAGE_BED_URL}/kun-galgame-patch/patch/${newId}/banner/banner.webp`

    return await ctx.prisma.$transaction(async (prisma) => {
      const patch = await prisma.patch.create({
        data: {
          name,
          vndb_id: vndbId,
          alias: alias ?? [],
          introduction,
          user_id: ctx.uid,
          banner: imageLink
        }
      })

      await prisma.user.update({
        where: { id: ctx.uid },
        data: {
          daily_image_count: { increment: 1 },
          moemoepoint: { increment: 1 }
        }
      })

      await prisma.patch_history.create({
        data: {
          action: '创建了',
          type: '补丁',
          content: name,
          user_id: ctx.uid,
          patch_id: patch.id
        }
      })

      return patch.id
    })
  }),

  duplicate: privateProcedure
    .input(patchSchema)
    .mutation(async ({ ctx, input }) => {})
})
