import { AlertOctagon } from 'lucide-react'
import EmailListPage from '../components/EmailListPage'

const Spam = () => {
  return (
    <EmailListPage
      title="Spam"
      icon={AlertOctagon}
      fetchUrl="/api/emails/spam"
      emptyMessage="Messages that have been in Spam for more than 30 days will be automatically deleted."
      emptyIcon={AlertOctagon}
    />
  )
}

export default Spam
