import SearchPageContainer from "@/components/SearchPageContainer"
import { getCurrentUserId } from "@/utils"

export default async function Searchpage() {
   const userId = await getCurrentUserId()
  return (
    <>
      <SearchPageContainer userId={userId}/>
    </>
  )
}
