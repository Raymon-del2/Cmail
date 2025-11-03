import { Mail } from 'lucide-react'
import EmailListPage from '../components/EmailListPage'

const AllMail = () => {
  return (
    <EmailListPage
      title="All Mail"
      icon={Mail}
      fetchUrl="/api/emails/all"
      emptyMessage="No messages found."
      emptyIcon={Mail}
    />
  )
}

export default AllMail
