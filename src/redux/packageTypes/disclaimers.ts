export type DisclaimerType = 'terms-and-conditions' | 'privacy-policy'

export type DisclaimerDto = {
  _id: string
  type: DisclaimerType
  content: string
  createdAt: string
  updatedAt: string
  __v?: number
}

export type GetDisclaimerApiResponse = {
  success: boolean
  message: string
  data: DisclaimerDto
}

export type UpdateDisclaimerBody = {
  type: DisclaimerType
  content: string
}
