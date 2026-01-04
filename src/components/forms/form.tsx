'use client'

import { ReactNode } from 'react'

import { ZodSchema } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { FormProvider, useForm, UseFormReturn, FieldValues, DefaultValues } from 'react-hook-form'

interface FormProps<T extends FieldValues> {
  schema: ZodSchema<T>
  defaultValues: DefaultValues<T>
  onSubmit: (data: T) => void | Promise<void>
  children: ReactNode
  className?: string
  id?: string
}

export function Form<T extends FieldValues>({
  schema,
  defaultValues,
  onSubmit,
  children,
  className,
  id,
}: FormProps<T>) {
  const methods = useForm<T>({
    // @ts-ignore - zodResolver type incompatibility with ZodSchema generic
    resolver: zodResolver(schema),
    defaultValues,
    mode: 'onChange', // Validate on change for better UX
  })

  return (
    <FormProvider {...methods}>
      <form id={id} onSubmit={methods.handleSubmit(onSubmit)} className={className} noValidate>
        {children}
      </form>
    </FormProvider>
  )
}

// Export useFormContext for accessing form methods in child components
export { useFormContext } from 'react-hook-form'
export type { UseFormReturn, FieldValues }
