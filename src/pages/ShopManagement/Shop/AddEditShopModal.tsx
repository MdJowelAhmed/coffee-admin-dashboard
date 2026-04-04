import { useEffect, useRef, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ModalWrapper, FormInput, FormTextarea, FormSelect, ImageUploader } from '@/components/common'
import { Button } from '@/components/ui/button'
import type { Shop } from '@/types'
import { toast } from '@/utils/toast'
import { loadGoogleMapsPlaces } from '@/utils/loadGoogleMapsPlaces'
import {
  useCreateShopMutation,
  useUpdateShopMutation,
} from '@/redux/api/shopManagementApi'
import type { StoreDataPayload } from '@/redux/packageTypes/shop'

/** Radix Select cannot use `value=""`; use a sentinel for “no off day”. */
const OFF_DAY_NONE = '__off_none__'

const OFF_DAY_OPTIONS = [
  { value: 'Sunday', label: 'Sunday' },
  { value: 'Monday', label: 'Monday' },
  { value: 'Tuesday', label: 'Tuesday' },
  { value: 'Wednesday', label: 'Wednesday' },
  { value: 'Thursday', label: 'Thursday' },
  { value: 'Friday', label: 'Friday' },
  { value: 'Saturday', label: 'Saturday' },
]

const OFF_DAY_SELECT_OPTIONS = [
  { value: OFF_DAY_NONE, label: 'No off day' },
  ...OFF_DAY_OPTIONS,
]

const schema = z.object({
  shopName: z.string().min(1, 'Shop name is required'),
  contact: z.string().min(1, 'Contact is required'),
  location: z.string().min(1, 'Address is required'),
  latitude: z.string().min(1, 'Latitude is required (use address search or enter manually)'),
  longitude: z.string().min(1, 'Longitude is required (use address search or enter manually)'),
  openTime: z.string().min(1, 'Open time is required'),
  closeTime: z.string().min(1, 'Close time is required'),
  offDay: z.string().optional(),
  aboutShop: z.string().min(1, 'About shop is required'),
})

type FormData = z.infer<typeof schema>

interface AddEditShopModalProps {
  open: boolean
  onClose: () => void
  editingId: string | null
  shop: Shop | null
}

export function AddEditShopModal({
  open,
  onClose,
  editingId,
  shop,
}: AddEditShopModalProps) {
  const isEdit = !!editingId
  const [image, setImage] = useState<File | string | null>(null)
  const addressInputRef = useRef<HTMLInputElement | null>(null)
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null)
  const mapContainerRef = useRef<HTMLDivElement | null>(null)
  const mapInstanceRef = useRef<google.maps.Map | null>(null)
  const markerRef = useRef<google.maps.Marker | null>(null)

  const [createShop, { isLoading: isCreating }] = useCreateShopMutation()
  const [updateShop, { isLoading: isUpdating }] = useUpdateShopMutation()

  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      shopName: '',
      contact: '',
      location: '',
      latitude: '',
      longitude: '',
      openTime: '09:00',
      closeTime: '18:00',
      offDay: OFF_DAY_NONE,
      aboutShop: '',
    },
  })

  const { ref: locationFieldRef, ...locationFieldRest } = register('location')

  /**
   * Hydrate the form only once per modal open / per shop id.
   * Including `shop` in deps caused reset on every parent re-render (new object refs) and cleared edits.
   */
  const hydratedModalKeyRef = useRef<string | null>(null)

  /** Waits until the address input is in the DOM (modal paint), then binds Places Autocomplete. */
  useEffect(() => {
    if (!open) {
      if (autocompleteRef.current && window.google?.maps?.event) {
        google.maps.event.clearInstanceListeners(autocompleteRef.current)
      }
      autocompleteRef.current = null
      return
    }

    let cancelled = false
    let rafId = 0
    let attempt = 0
    const maxAttempts = 24

    const bindAutocomplete = (el: HTMLInputElement) => {
      if (autocompleteRef.current) {
        google.maps.event.clearInstanceListeners(autocompleteRef.current)
        autocompleteRef.current = null
      }
      const ac = new google.maps.places.Autocomplete(el, {
        // `geocode` is broader than `address` — more results return geometry
        types: ['geocode'],
        fields: ['geometry', 'formatted_address', 'name'],
      })
      autocompleteRef.current = ac
      ac.addListener('place_changed', () => {
        const place = ac.getPlace()
        const loc = place.geometry?.location
        const addr = place.formatted_address ?? place.name
        if (addr) {
          setValue('location', addr, { shouldValidate: true, shouldDirty: true })
        }
        if (loc) {
          setValue('latitude', loc.lat().toFixed(6), {
            shouldValidate: true,
            shouldDirty: true,
          })
          setValue('longitude', loc.lng().toFixed(6), {
            shouldValidate: true,
            shouldDirty: true,
          })
          if (mapInstanceRef.current && markerRef.current) {
            markerRef.current.setPosition(loc)
            mapInstanceRef.current.panTo(loc)
            mapInstanceRef.current.setZoom(16)
          }
        } else if (addr) {
          toast({
            title: 'Coordinates unavailable',
            description:
              'This place has no map position. Enter latitude and longitude manually.',
            variant: 'warning',
          })
        }
      })
    }

    const tryAttach = () => {
      if (cancelled) return
      const el = addressInputRef.current
      if (el) {
        loadGoogleMapsPlaces()
          .then(() => {
            if (cancelled || addressInputRef.current !== el) return
            bindAutocomplete(el)
          })
          .catch(() => {
            /* API key missing / blocked — manual lat/lng still works */
          })
        return
      }
      attempt += 1
      if (attempt < maxAttempts) {
        rafId = requestAnimationFrame(tryAttach)
      }
    }

    tryAttach()

    return () => {
      cancelled = true
      cancelAnimationFrame(rafId)
      if (autocompleteRef.current && window.google?.maps?.event) {
        google.maps.event.clearInstanceListeners(autocompleteRef.current)
      }
      autocompleteRef.current = null
    }
  }, [open, setValue])

  useEffect(() => {
    if (!open) {
      hydratedModalKeyRef.current = null
      return
    }

    if (isEdit && editingId) {
      if (!shop || shop.id !== editingId) return
      const key = `edit:${editingId}`
      if (hydratedModalKeyRef.current === key) return
      hydratedModalKeyRef.current = key

      const offDayVal =
        shop.offDay && OFF_DAY_OPTIONS.some((o) => o.value === shop.offDay)
          ? shop.offDay
          : OFF_DAY_NONE

      reset({
        shopName: shop.shopName,
        contact: shop.contact,
        location: shop.location,
        latitude: shop.latitude ?? '',
        longitude: shop.longitude ?? '',
        openTime: shop.openTime,
        closeTime: shop.closeTime,
        offDay: offDayVal,
        aboutShop: shop.aboutShop,
      })
      setImage(shop.shopPicture ?? null)
      return
    }

    if (!isEdit) {
      if (hydratedModalKeyRef.current === 'create') return
      hydratedModalKeyRef.current = 'create'
      reset({
        shopName: '',
        contact: '',
        location: '',
        latitude: '',
        longitude: '',
        openTime: '09:00',
        closeTime: '18:00',
        offDay: OFF_DAY_NONE,
        aboutShop: '',
      })
      setImage(null)
    }
  }, [open, isEdit, editingId, shop, reset])

  const DEFAULT_MAP_CENTER = { lat: 23.8103, lng: 90.4125 }

  /** Interactive map: click or drag pin → address + lat/lng. */
  useEffect(() => {
    if (!open) {
      markerRef.current?.setMap(null)
      markerRef.current = null
      mapInstanceRef.current = null
      return
    }

    let cancelled = false
    let attempt = 0
    const maxAttempts = 36
    let rafChain = 0

    const initMap = () => {
      if (cancelled) return
      const container = mapContainerRef.current
      if (!container) {
        attempt += 1
        if (attempt < maxAttempts) {
          rafChain = requestAnimationFrame(initMap)
        }
        return
      }

      loadGoogleMapsPlaces()
        .then(() => {
          if (cancelled || !mapContainerRef.current) return

          const latVal = parseFloat(getValues('latitude') || '')
          const lngVal = parseFloat(getValues('longitude') || '')
          const hasCoords = !Number.isNaN(latVal) && !Number.isNaN(lngVal)
          const center = hasCoords
            ? { lat: latVal, lng: lngVal }
            : DEFAULT_MAP_CENTER

          const map = new google.maps.Map(container, {
            center,
            zoom: hasCoords ? 16 : 12,
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: false,
          })
          mapInstanceRef.current = map

          const marker = new google.maps.Marker({
            position: center,
            map,
            draggable: true,
          })
          markerRef.current = marker

          const applyFromLatLng = (latLng: google.maps.LatLng) => {
            setValue('latitude', latLng.lat().toFixed(6), {
              shouldValidate: true,
              shouldDirty: true,
            })
            setValue('longitude', latLng.lng().toFixed(6), {
              shouldValidate: true,
              shouldDirty: true,
            })
            const geocoder = new google.maps.Geocoder()
            geocoder.geocode({ location: latLng }, (results, status) => {
              if (cancelled) return
              if (status === 'OK' && results?.[0]?.formatted_address) {
                setValue('location', results[0].formatted_address, {
                  shouldValidate: true,
                  shouldDirty: true,
                })
              }
            })
          }

          map.addListener('click', (e: google.maps.MapMouseEvent) => {
            if (e.latLng) {
              marker.setPosition(e.latLng)
              applyFromLatLng(e.latLng)
            }
          })

          marker.addListener('dragend', () => {
            const p = marker.getPosition()
            if (p) applyFromLatLng(p)
          })

          google.maps.event.addListenerOnce(map, 'idle', () => {
            if (!cancelled) {
              google.maps.event.trigger(map, 'resize')
            }
          })

          window.setTimeout(() => {
            if (!cancelled && mapInstanceRef.current) {
              google.maps.event.trigger(mapInstanceRef.current, 'resize')
            }
          }, 250)
        })
        .catch(() => {
          /* Geocoder / map optional if key invalid */
        })
    }

    const t = window.setTimeout(initMap, 80)

    return () => {
      cancelled = true
      clearTimeout(t)
      cancelAnimationFrame(rafChain)
      markerRef.current?.setMap(null)
      markerRef.current = null
      mapInstanceRef.current = null
    }
  }, [open, setValue, getValues, editingId, shop?.id])

  const onSubmit = async (data: FormData) => {
    const payload: StoreDataPayload = {
      name: data.shopName.trim(),
      address: data.location.trim(),
      latitude: data.latitude.trim(),
      longitude: data.longitude.trim(),
      phone: data.contact.trim(),
      about: data.aboutShop.trim(),
      openTime: data.openTime,
      closeTime: data.closeTime,
      offDay:
        !data.offDay || data.offDay === OFF_DAY_NONE
          ? ''
          : data.offDay.trim(),
    }

    try {
      if (isEdit && editingId) {
        const file = typeof image === 'object' && image instanceof File ? image : undefined
        await updateShop({
          id: editingId,
          data: payload,
          image: file,
        }).unwrap()
        toast({ title: 'Updated', description: 'Shop updated successfully.' })
      } else {
        if (!(image instanceof File)) {
          toast({
            title: 'Image required',
            description: 'Please upload a shop image.',
            variant: 'destructive',
          })
          return
        }
        await createShop({ data: payload, image }).unwrap()
        toast({ title: 'Added', description: 'Shop added successfully.' })
      }
      onClose()
    } catch {
      toast({
        title: 'Request failed',
        description: 'Could not save the shop. Check your connection and try again.',
        variant: 'destructive',
      })
    }
  }

  const saving = isSubmitting || isCreating || isUpdating

  return (
    <ModalWrapper
      open={open}
      onClose={onClose}
      title={isEdit ? 'Edit Shop' : 'New Shop'}
      size="xl"
      className="bg-white"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            label="Shop Name"
            placeholder="Enter shop name"
            error={errors.shopName?.message}
            required
            {...register('shopName')}
          />
          <FormInput
            label="Contact"
            placeholder="e.g. +1234567890"
            error={errors.contact?.message}
            required
            {...register('contact')}
          />
        </div>

        <FormInput
          label="Address"
          placeholder="Search address (Google) or type manually"
          error={errors.location?.message}
          required
          ref={(el) => {
            locationFieldRef(el)
            addressInputRef.current = el
          }}
          {...locationFieldRest}
        />

        <div className="space-y-2">
          <div>
            <span className="text-sm font-medium">Location on map</span>
            <p className="text-xs text-muted-foreground mt-0.5">
              Click on the map or drag the pin — address, latitude, and longitude will update.
            </p>
          </div>
          <div
            ref={mapContainerRef}
            className="w-full h-[280px] rounded-lg border border-input bg-muted overflow-hidden"
            aria-label="Pick location on map"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            label="Latitude"
            placeholder="e.g. 40.712800"
            error={errors.latitude?.message}
            required
            {...register('latitude')}
          />
          <FormInput
            label="Longitude"
            placeholder="e.g. -74.006000"
            error={errors.longitude?.message}
            required
            {...register('longitude')}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            label="Open Time"
            type="time"
            error={errors.openTime?.message}
            required
            {...register('openTime')}
          />
          <FormInput
            label="Close Time"
            type="time"
            error={errors.closeTime?.message}
            required
            {...register('closeTime')}
          />
        </div>

        <Controller
          name="offDay"
          control={control}
          render={({ field }) => (
            <FormSelect
              label="Off Day"
              value={field.value || OFF_DAY_NONE}
              options={OFF_DAY_SELECT_OPTIONS}
              onChange={field.onChange}
              placeholder="Select off day (optional)"
            />
          )}
        />

        <FormTextarea
          label="About Shop"
          placeholder="Describe your shop..."
          error={errors.aboutShop?.message}
          required
          rows={4}
          {...register('aboutShop')}
        />

        <div>
          <label className="text-sm font-medium mb-2 block">Shop Picture</label>
          <ImageUploader
            key={editingId ? `shop-${editingId}` : 'shop-new'}
            value={image}
            onChange={(f) => setImage(f)}
          />
          {!isEdit && (
            <p className="text-xs text-muted-foreground mt-1">Required for new shops</p>
          )}
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button type="submit" disabled={saving}>
            {saving ? 'Saving...' : isEdit ? 'Save changes' : 'Add New Shop'}
          </Button>
        </div>
      </form>
    </ModalWrapper>
  )
}
