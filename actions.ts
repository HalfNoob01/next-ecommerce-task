export const getSingleProduct = async (id : number) => {
    try {
       const response = await fetch(`https://fakestoreapi.com/products/${id}`)
       const data = await response.json();
       return data
    }catch(error) {
        console.log(error)
    }
}

export const getRelatedProducts = async (category: string, excludeId?: number) => {
    try {
      const response = await fetch(`https://fakestoreapi.com/products/category/${category}`);
      const data = await response.json();
  
      // Optionally exclude the current product from the related list
      const related = excludeId ? data.filter((item: any) => item.id !== excludeId) : data;
  
      return related;
    } catch (error) {
      console.log("Error fetching related products:", error);
      return [];
    }
  };
  