import { File } from 'lucide-react'
import EmailListPage from '../components/EmailListPage'

const Drafts = () => {
  return (
    <EmailListPage
      title="Drafts"
      icon={File}
      fetchUrl="/api/emails/drafts"
      emptyMessage="You don't have any saved drafts. Saving a draft allows you to keep a message you aren't ready to send yet."
      emptyIcon={File}
    />
  )
}

export default Drafts
