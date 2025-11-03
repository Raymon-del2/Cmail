import { Calendar } from 'lucide-react'
import EmailListPage from '../components/EmailListPage'

const Scheduled = () => {
  return (
    <EmailListPage
      title="Scheduled"
      icon={Calendar}
      fetchUrl="/api/emails/scheduled"
      emptyMessage="Messages in Scheduled will be sent at their scheduled time."
      emptyIcon={Calendar}
    />
  )
}

export default Scheduled
