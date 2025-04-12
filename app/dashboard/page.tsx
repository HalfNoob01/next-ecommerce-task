import Main from '@/components/Main'
import Navbar from '@/components/Navbar'
import { getCurrentUserId } from '@/utils'

const DashboardPage = async () => {
   const id = await getCurrentUserId()
  return (
    <div>
      <Navbar userId={id}/>
       <Main userId={id}/>
    </div>
  )
}

export default DashboardPage
