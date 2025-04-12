import Navbar from "@/components/Navbar";
import WishlistContainer from "@/components/WishlistContainer";
import { getCurrentUserId } from "@/utils";

export default async function WishlistPage() {
  const userId = await getCurrentUserId()
   
  return (
    <>
    <Navbar/>
      <WishlistContainer userId={userId}/>
    </>
  )
}
