import Navbar from "@/components/Navbar"
import OrderHistoryContainer from "@/components/OrderHistoryContainer"
import { getCurrentUserId } from "@/utils"

export default async function OrderHistoryPage() {
 const id = await getCurrentUserId()
  return (
    <>
    <Navbar/>
      <OrderHistoryContainer userId={id}/>
    </>
  )
}
