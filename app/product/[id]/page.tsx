
import { getSingleProduct, getRelatedProducts } from "@/actions";
import SingleProductPageContainer from "@/components/SingleProductPageContainer";
import Navbar from "@/components/Navbar";
import { getCurrentUserId } from "@/utils";

export default async function SingleProductPage({ params }: { params: { id: number } }) {
  const { id } = await params;
  const userId = await getCurrentUserId()
  const productDetails = await getSingleProduct(id);
  const relatedProducts = await getRelatedProducts(productDetails.category, id);

  return (
    <div>
      <Navbar userId={userId}/>
      <SingleProductPageContainer
        product={productDetails}
        related={relatedProducts}
        userId={userId}
      />
    </div>
  );
}
