import { Shield } from 'lucide-react'
import { DisclaimerSettingsEditor } from '../components/DisclaimerSettingsEditor'

export default function PrivacySettings() {
  return (
    <DisclaimerSettingsEditor
      type="privacy-policy"
      title="Privacy Policy"
      description="Manage your platform's Privacy Policy"
      Icon={Shield}
      placeholder="Write your privacy policy here..."
      saveSuccessTitle="Privacy policy updated"
      saveSuccessDescription="Privacy Policy has been saved successfully."
    />
  )
}
