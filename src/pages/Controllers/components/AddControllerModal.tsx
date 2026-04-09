import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ModalWrapper, FormInput, FormSelect } from '@/components/common'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Eye, EyeOff } from 'lucide-react'
import type { ControllerRole, Shop } from '@/types'
import { toast } from '@/utils/toast'
import { useGetShopsQuery } from '@/redux/api/shopManagementApi'
import { apiStoreToShop } from '@/redux/packageTypes/shop'
import { useCreateControllerMutation } from '@/redux/api/controllersApi'

const SHOP_NONE = '__none__'

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(1, 'Phone is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['admin', 'marketer']),
  shopId: z.string().optional(),
})

type FormData = z.infer<typeof schema>

interface AddControllerModalProps {
  open: boolean
  onClose: () => void
}

const API_BASE = import.meta.env.VITE_API_BASE_URL

export function AddControllerModal({ open, onClose }: AddControllerModalProps) {
  const [createController] = useCreateControllerMutation()
  const [showPassword, setShowPassword] = useState(false)
  const { data: shopsData } = useGetShopsQuery(
    { page: 1, limit: 500 },
    { skip: !open }
  )
  const shops: Shop[] =
    shopsData?.items.map((item) => apiStoreToShop(item, API_BASE)) ?? []

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      password: '',
      role: 'admin',
      shopId: SHOP_NONE,
    },
  })

  const selectedRole = watch('role')
  const showShopField = selectedRole === 'admin'

  const shopOptions = [
    { value: SHOP_NONE, label: 'Select shop (optional)' },
    ...shops.map((s: Shop) => ({ value: s.id, label: s.shopName })),
  ]

  useEffect(() => {
    if (open) {
      reset({
        name: '',
        email: '',
        phone: '',
        password: '',
        role: 'admin',
        shopId: SHOP_NONE,
      })
    }
  }, [open, reset])

  useEffect(() => {
    if (selectedRole !== 'admin') {
      setValue('shopId', SHOP_NONE)
    }
  }, [selectedRole, setValue])

  const onSubmit = async (data: FormData) => {
    try {
      const storeId =
        data.shopId && data.shopId !== SHOP_NONE ? data.shopId : undefined
      await createController({
        name: data.name,
        email: data.email,
        phone: data.phone,
        password: data.password,
        role: data.role as ControllerRole,
        ...(storeId ? { store: storeId } : {}),
      }).unwrap()
      toast({ title: 'Added', description: 'Controller added successfully.' })
      onClose()
    } catch (e) {
      toast({ title: 'Failed', description: 'Could not add controller.', variant: 'destructive' })
    }
  }

  return (
    <ModalWrapper
      open={open}
      onClose={onClose}
      title="Add Controller"
      size="lg"
      className="bg-white"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <FormInput
          label="Name"
          placeholder="Enter name"
          error={errors.name?.message}
          required
          {...register('name')}
        />

        <FormInput
          label="Email"
          type="email"
          placeholder="Enter email"
          error={errors.email?.message}
          required
          {...register('email')}
        />

        <FormInput
          label="Phone"
          placeholder="Enter phone number"
          error={errors.phone?.message}
          required
          {...register('phone')}
        />

        <div className="space-y-1.5">
          <Label
            htmlFor="controller-password"
            className={errors.password?.message ? 'text-destructive' : undefined}
          >
            Password<span className="text-destructive ml-1">*</span>
          </Label>
          <div className="relative">
            <Input
              id="controller-password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter password (min 6 characters)"
              className="pr-10"
              error={!!errors.password?.message}
              {...register('password')}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.password?.message && (
            <p className="text-xs text-destructive">{errors.password.message}</p>
          )}
        </div>

        <FormSelect
          label="Role"
          value={watch('role')}
          onChange={(v) => setValue('role', v as ControllerRole)}
          options={[
            { value: 'admin', label: 'Admin' },
            { value: 'marketer', label: 'Marketer' },
          ]}
          required
        />

        {showShopField && (
          <FormSelect
            label="Store (optional)"
            value={watch('shopId') || SHOP_NONE}
            onChange={(v) => setValue('shopId', v)}
            options={shopOptions}
            placeholder="Select store (optional)"
          />
        )}

        <div className="flex justify-end gap-3 pt-4 border-t">
          {/* <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button> */}
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Adding...' : 'Add Controller'}
          </Button>
        </div>
      </form>
    </ModalWrapper>
  )
}
