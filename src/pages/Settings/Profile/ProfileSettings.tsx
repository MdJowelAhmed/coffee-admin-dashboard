import { useEffect, useRef, useState, type ChangeEvent } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Camera } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { FormInput } from '@/components/common'
import { toast } from '@/utils/toast'
import { motion } from 'framer-motion'
import {
  useGetMyProfileQuery,
  useUpdateMyProfileMutation,
} from '@/redux/api/authApi'
import { resolveMediaUrl } from '@/utils/mediaUrl'
import { getInitials } from '@/utils/formatters'

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  phone: z.string().optional(),
  address: z.string().optional(),
})

type ProfileFormData = z.infer<typeof profileSchema>

function displayAvatarSrc(
  serverProfileImage: string | undefined,
  serverImage: string | undefined,
  localPreview: string | null
): string {
  if (localPreview) return localPreview
  const raw = (serverProfileImage || serverImage || '').trim()
  if (!raw) return ''
  return resolveMediaUrl(raw)
}

export default function ProfileSettings() {
  const { data: profileRes, isLoading: isLoadingProfile } = useGetMyProfileQuery()
  const [updateProfile, { isLoading: isSaving }] = useUpdateMyProfileMutation()

  const profile = profileRes?.data
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const objectUrlRef = useRef<string | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      address: '',
    },
  })

  useEffect(() => {
    if (!profile) return
    reset({
      name: profile.name ?? '',
      email: profile.email ?? '',
      phone: profile.phone ?? '',
      address: profile.address ?? '',
    })
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current)
      objectUrlRef.current = null
    }
    setSelectedFile(null)
    setAvatarPreview(null)
  }, [profile, reset])

  const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current)
    }
    const url = URL.createObjectURL(file)
    objectUrlRef.current = url
    setSelectedFile(file)
    setAvatarPreview(url)
    e.target.value = ''
  }

  const onSubmit = async (form: ProfileFormData) => {
    try {
      await updateProfile({
        name: form.name.trim(),
        phone: form.phone ?? '',
        address: form.address ?? '',
        image: selectedFile ?? undefined,
      }).unwrap()

      toast({
        title: 'Profile updated',
        description: 'Your profile has been updated successfully.',
      })

      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current)
        objectUrlRef.current = null
      }
      setSelectedFile(null)
      setAvatarPreview(null)
    } catch {
      toast({
        title: 'Update failed',
        description: 'Could not save profile. Please try again.',
        variant: 'destructive',
      })
    }
  }

  const avatarSrc = displayAvatarSrc(
    profile?.profileImage,
    profile?.image,
    avatarPreview
  )
  const initials = getInitials(
    profile?.name?.split(/\s+/)[0],
    profile?.name?.split(/\s+/).slice(1).join(' ')
  )

  if (isLoadingProfile && !profile) {
    return (
      <div className="max-w-4xl mx-auto py-12 text-center text-sm text-muted-foreground">
        Loading profile…
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 max-w-4xl mx-auto"
    >
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>
            Update your personal information and profile picture
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <div className="flex items-center gap-6">
              <div className="relative">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={avatarSrc || undefined} />
                  <AvatarFallback className="text-lg">
                    {initials || '—'}
                  </AvatarFallback>
                </Avatar>
                <label
                  htmlFor="avatar-upload"
                  className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-primary flex items-center justify-center cursor-pointer hover:bg-primary/90 transition-colors"
                >
                  <Camera className="h-4 w-4 text-primary-foreground" />
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarChange}
                  />
                </label>
              </div>
              <div>
                <h3 className="font-semibold">Profile Picture</h3>
                <p className="text-sm text-muted-foreground">
                  JPG, PNG or WebP. Max size 5MB.
                </p>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="font-semibold">Personal Information</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <FormInput
                  label="Full name"
                  placeholder="Your name"
                  error={errors.name?.message}
                  required
                  {...register('name')}
                />
                <FormInput
                  label="Email"
                  type="email"
                  placeholder="Email"
                  error={errors.email?.message}
                  readOnly
                  className="bg-muted/50"
                  {...register('email')}
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <FormInput
                  label="Phone"
                  placeholder="Phone number"
                  error={errors.phone?.message}
                  {...register('phone')}
                />
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="font-semibold">Address</h3>
              <FormInput
                label="Street address"
                placeholder="Address"
                error={errors.address?.message}
                {...register('address')}
              />
            </div>

            <div className="flex justify-end gap-3">
              <Button type="submit" disabled={isSaving} isLoading={isSaving}>
                Save Changes
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  )
}
