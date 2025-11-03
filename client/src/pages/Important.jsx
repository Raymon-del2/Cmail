import { Tag } from 'lucide-react'
import EmailListPage from '../components/EmailListPage'

const Important = () => {
  return (
    <EmailListPage
      title="Important"
      icon={Tag}
      fetchUrl="/api/emails/important"
      emptyMessage="No important messages."
      emptyIcon={Tag}
    />
  )
}

export default Important
