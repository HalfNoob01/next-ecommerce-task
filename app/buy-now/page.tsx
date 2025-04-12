import BuyNowContainerPage from "@/components/BuyNowContainer";

interface Props {
  searchParams: {
    [key: string]: string ;
  };
}

export default async function BuyNowPage({ searchParams }: Props) {
  const {id,userId} = await searchParams;
  return (
    <>
    <BuyNowContainerPage id={id} userId={userId}/>
    </>
  );
}
