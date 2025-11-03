import { Clock } from 'lucide-react'
import EmailListPage from '../components/EmailListPage'

const Snoozed = () => {
  return (
    <EmailListPage
      title="Snoozed"
      icon={Clock}
      fetchUrl="/api/emails/snoozed"
      emptyMessage="No snoozed messages. Snooze emails to have them reappear at a later time."
      emptyIcon={Clock}
    />
  )
}

export default Snoozed
