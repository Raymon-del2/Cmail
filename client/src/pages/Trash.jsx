import { Trash2 } from 'lucide-react'
import EmailListPage from '../components/EmailListPage'

const Trash = () => {
  return (
    <EmailListPage
      title="Trash"
      icon={Trash2}
      fetchUrl="/api/emails/trash"
      emptyMessage="No conversations in Trash. Messages that have been in Trash for more than 30 days will be automatically deleted."
      emptyIcon={Trash2}
    />
  )
}

export default Trash
