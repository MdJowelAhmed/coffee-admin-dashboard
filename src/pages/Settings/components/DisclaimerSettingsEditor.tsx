import { useEffect, useState } from 'react'
import type { LucideIcon } from 'lucide-react'
import { Save, Eye } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { TiptapEditor } from '@/components/common'
import { toast } from '@/utils/toast'
import { motion } from 'framer-motion'
import {
  useGetDisclaimerQuery,
  useUpdateDisclaimerMutation,
} from '@/redux/api/settingsApi'
import type { DisclaimerType } from '@/redux/packageTypes/disclaimers'

type DisclaimerSettingsEditorProps = {
  type: DisclaimerType
  title: string
  description: string
  Icon: LucideIcon
  placeholder: string
  saveSuccessTitle: string
  saveSuccessDescription: string
}

export function DisclaimerSettingsEditor({
  type,
  title,
  description,
  Icon,
  placeholder,
  saveSuccessTitle,
  saveSuccessDescription,
}: DisclaimerSettingsEditorProps) {
  const { data, isLoading, isError, refetch } = useGetDisclaimerQuery({ type })
  const [updateDisclaimer, { isLoading: isSaving }] =
    useUpdateDisclaimerMutation()

  const [content, setContent] = useState('')
  const [activeTab, setActiveTab] = useState('preview')

  useEffect(() => {
    if (data?.content != null) {
      setContent(data.content)
    }
  }, [data])

  const handleSave = async () => {
    try {
      await updateDisclaimer({ type, content }).unwrap()
      toast({
        title: saveSuccessTitle,
        description: saveSuccessDescription,
      })
      refetch()
    } catch {
      toast({
        title: 'Error',
        description: 'Could not save. Please try again.',
        variant: 'destructive',
      })
    }
  }

  const showInitialLoading = isLoading && !data

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleSave}
                disabled={showInitialLoading || isSaving}
                isLoading={isSaving}
                className="bg-primary text-white hover:bg-primary/80"
              >
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {showInitialLoading ? (
            <p className="text-sm text-muted-foreground py-8 text-center">
              Loading…
            </p>
          ) : null}
          {!showInitialLoading ? (
            <>
              {isError ? (
                <p className="text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 mb-4">
                  Could not load saved content. You can still write below and save to create or update it on the server.
                </p>
              ) : null}
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="mb-4">
                  <TabsTrigger value="edit" className="gap-2">
                    <Icon className="h-4 w-4" />
                    Edit
                  </TabsTrigger>
                  <TabsTrigger value="preview" className="gap-2">
                    <Eye className="h-4 w-4" />
                    Preview
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="edit" className="mt-0">
                  <TiptapEditor
                    content={content}
                    onChange={setContent}
                    placeholder={placeholder}
                    className="min-h-[500px]"
                  />
                </TabsContent>

                <TabsContent value="preview" className="mt-0">
                  <div className="border rounded-xl p-6 min-h-[500px] bg-muted/20">
                    <div
                      className="prose prose-sm dark:prose-invert max-w-none"
                      dangerouslySetInnerHTML={{ __html: content }}
                    />
                  </div>
                </TabsContent>
              </Tabs>
            </>
          ) : null}
        </CardContent>
      </Card>
    </motion.div>
  )
}
