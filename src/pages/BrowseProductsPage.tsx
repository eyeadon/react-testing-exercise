import { useState } from "react";
import "react-loading-skeleton/dist/skeleton.css";
import CategorySelect from "../components/CategorySelect";
import ProductTable from "../components/ProductTable";

function BrowseProducts() {
  // const [products, setProducts] = useState<Product[]>([]);
  // const [categories, setCategories] = useState<Category[]>([]);
  // const [isProductsLoading, setProductsLoading] = useState(false);
  // const [isCategoriesLoading, setCategoriesLoading] = useState(false);
  // const [errorProducts, setErrorProducts] = useState("");
  // const [errorCategories, setErrorCategories] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<
    number | undefined
  >();

  // useEffect(() => {
  //   const fetchProducts = async () => {
  //     try {
  //       setProductsLoading(true);
  //       const { data } = await axios.get<Product[]>("/products");
  //       setProducts(data);
  //     } catch (error) {
  //       if (error instanceof AxiosError) setErrorProducts(error.message);
  //       else setErrorProducts("An unexpected error occurred");
  //     } finally {
  //       setProductsLoading(false);
  //     }
  //   };

  //   const fetchCategories = async () => {
  //     try {
  //       setCategoriesLoading(true);
  //       const { data } = await axios.get<Category[]>("/categories");
  //       setCategories(data);
  //     } catch (error) {
  //       if (error instanceof AxiosError) setErrorCategories(error.message);
  //       else setErrorCategories("An unexpected error occurred");
  //     } finally {
  //       setCategoriesLoading(false);
  //     }
  //   };
  //   fetchCategories();
  //   fetchProducts();
  // }, []);

  return (
    <div>
      <h1>Products</h1>
      <div className="max-w-xs">
        <CategorySelect
          onChange={(categoryId) => setSelectedCategoryId(categoryId)}
        />
      </div>
      <ProductTable selectedCategoryId={selectedCategoryId} />
    </div>
  );
  // end BrowseProducts
}

export default BrowseProducts;
