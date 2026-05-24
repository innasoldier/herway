import { z } from 'zod'

export const assessmentSchema = z.object({
  answer: z
    .string()
    .min(10, 'Please share a little more')
    .max(1000, 'That is enough for now'),
})

export type AssessmentFormData = z.infer<typeof assessmentSchema>
