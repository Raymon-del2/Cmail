import { Send } from 'lucide-react'
import EmailListPage from '../components/EmailListPage'

const Sent = () => {
  return (
    <EmailListPage
      title="Sent"
      icon={Send}
      fetchUrl="/api/emails/sent"
      emptyMessage="No sent messages yet."
      emptyIcon={Send}
    />
  )
}

export default Sent
