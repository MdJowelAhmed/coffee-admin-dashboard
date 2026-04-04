import type { Poster } from '@/types'
import type { Pagination } from './revenue'
import { resolveMediaUrl } from '@/utils/mediaUrl'

export type PromotionDto = {
  _id: string
  name: string
  image: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export type GetPromotionsApiResponse = {
  success: boolean
  message: string
  pagination: Pagination
  data: PromotionDto[]
}

export type PromotionListResult = {
  items: Poster[]
  pagination: Pagination
}

export type GetPromotionsArgs = {
  page: number
  limit: number
  search?: string
}

export function promotionDtoToPoster(row: PromotionDto): Poster {
  return {
    id: row._id,
    imageUrl: resolveMediaUrl(row.image),
    title: row.name,
    description: '',
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    isActive: row.isActive,
  }
}
