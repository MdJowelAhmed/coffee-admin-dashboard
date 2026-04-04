import { FileText } from 'lucide-react'
import { DisclaimerSettingsEditor } from '../components/DisclaimerSettingsEditor'

export default function TermsSettings() {
  return (
    <DisclaimerSettingsEditor
      type="terms-and-conditions"
      title="Terms & Conditions"
      description="Manage your platform's Terms and Conditions"
      Icon={FileText}
      placeholder="Write your terms and conditions here..."
      saveSuccessTitle="Terms updated"
      saveSuccessDescription="Terms and Conditions have been saved successfully."
    />
  )
}
