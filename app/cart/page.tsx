import CartContainer from "@/components/CartContainder"
import Navbar from "@/components/Navbar"
import { getCurrentUserId } from "@/utils"

export default async function CartPage() {
 const userId = await getCurrentUserId()
  return (
    <>
    <Navbar/>
      <CartContainer userId={userId}/>
    </>
  )
}
