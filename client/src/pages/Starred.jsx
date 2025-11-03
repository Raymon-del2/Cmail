import { Star } from 'lucide-react'
import EmailListPage from '../components/EmailListPage'

const Starred = () => {
  return (
    <EmailListPage
      title="Starred"
      icon={Star}
      fetchUrl="/api/emails/starred"
      emptyMessage="No starred messages. Stars let you give messages a special status to make them easier to find."
      emptyIcon={Star}
    />
  )
}

export default Starred
