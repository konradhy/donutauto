import { useState, useEffect } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Spinner } from "@/components/spinner";

export default function BrandDetails() {
  const [brandName, setBrandName] = useState("");
  const [brandProducts, setBrandProducts] = useState<string[]>([]);
  const [brandDescription, setBrandDescription] = useState("");
  const [newProduct, setNewProduct] = useState("");

  const brandDetails = useQuery(api.organizations.getBrandDetails);
  const updateBrandDetails = useMutation(api.organizations.updateBrandDetails);

  useEffect(() => {
    if (brandDetails) {
      setBrandName(brandDetails.name || "");
      setBrandProducts(brandDetails.products || []);
      setBrandDescription(brandDetails.description || "");
    }
  }, [brandDetails]);

  const handleAddProduct = () => {
    if (newProduct.trim()) {
      setBrandProducts([...brandProducts, newProduct.trim()]);
      setNewProduct("");
    }
  };

  const handleRemoveProduct = (index: number) => {
    setBrandProducts(brandProducts.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateBrandDetails({
      brandDetails: {
        name: brandName,
        products: brandProducts,
        description: brandDescription,
      },
    })
      .then(() => {
        toast.success("Brand details updated successfully!");
      })
      .catch((error) => {
        toast.error("Failed to update brand details: " + error.message);
      });
  };

  if (brandDetails === undefined) {
    return <Spinner />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-pink-50 dark:from-gray-900 dark:to-purple-900 p-8">
      <div className="container mx-auto space-y-8">
        <Card className="bg-transparent dark:bg-gray-800 shadow-md hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
              Brand Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label
                  htmlFor="brandName"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Brand Name
                </label>
                <Input
                  id="brandName"
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                  required
                  placeholder="Enter your brand name"
                  className="border-2 border-gray-200 dark:border-gray-700 focus:border-blue-300 dark:focus:border-blue-600 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="brandProducts"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Brand Products
                </label>
                <div className="flex space-x-2">
                  <Input
                    id="newProduct"
                    value={newProduct}
                    onChange={(e) => setNewProduct(e.target.value)}
                    placeholder="Add a product"
                    className="flex-grow border-2 border-gray-200 dark:border-gray-700 focus:border-blue-300 dark:focus:border-blue-600 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none"
                  />
                  <Button
                    type="button"
                    onClick={handleAddProduct}
                    className="bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 text-white"
                  >
                    Add
                  </Button>
                </div>
                <ul className="mt-2 space-y-2">
                  {brandProducts.map((product, index) => (
                    <li
                      key={index}
                      className="flex justify-between items-center bg-gray-100 dark:bg-gray-700 p-2 rounded"
                    >
                      <span className="text-gray-800 dark:text-gray-200">
                        {product}
                      </span>
                      <Button
                        type="button"
                        onClick={() => handleRemoveProduct(index)}
                        className="bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 text-white text-sm py-1 px-2"
                      >
                        Remove
                      </Button>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="brandDescription"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Brand Description
                </label>
                <Textarea
                  id="brandDescription"
                  value={brandDescription}
                  onChange={(e) => setBrandDescription(e.target.value)}
                  required
                  placeholder="Enter your brand description"
                  className="border-2 border-gray-200 dark:border-gray-700 focus:border-blue-300 dark:focus:border-blue-600 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none"
                  rows={4}
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white transition-colors duration-300"
              >
                Update Brand Details
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
