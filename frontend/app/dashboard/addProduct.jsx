"use client";
import { useState } from "react";
import * as SDK from "node-appwrite";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ORDERS_URL } from "../config";
const AddProduct = () => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [stock, setStock] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(true)
  const { toast } = useToast();
  // Initialize Appwrite Client
  const client = new SDK.Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID)
    .setKey(process.env.NEXT_PUBLIC_APPWRITE_API_KEY);

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleImageUpload = async (image) => {
    const storageClient = new SDK.Storage(client);

    try {
      const response = await storageClient.createFile(
        process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID,
        SDK.ID.unique(),
        image
      );
      return response.$id; // Use the file ID as the image URL
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Upload the image first
    const imageUrl = await handleImageUpload(image);

    // Prepare the product data with the image URL
    const productData = {
      name,
      price,
      description,
      category,
      stock,
      imageUrl,
    };

    const response = await fetch(ORDERS_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(productData),
    });

    if (response.ok) {
      setLoading(false)
      toast({
        title: "product added succesfully",
      });
      return;
    } else {
      const errorData = await response.json();
      setLoading(false)
      toast({
        title: "Add Product Error",
        description: `${errorData.message}`,
      });
      return;
    }
  };

  return (
    <div className="flex  justify-center items-center mt-5">
    <form className="w-1/2 flex flex-col gap-y-10" onSubmit={handleSubmit}>
      <Input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Name"
        required
      />
      <Input
        type="number"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        placeholder="Price"
        required
      />
      <Textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description"
        required
      />
      <Input
        type="text"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        placeholder="Category"
        required
      />
      <Input
        type="number"
        value={stock}
        onChange={(e) => setStock(e.target.value)}
        placeholder="Stock"
        required
      />
      <Input type="file" onChange={handleImageChange} required />
      <Button type="submit">{loading ? 'Add Product' : 'Adding ...'}</Button>
    </form>
    </div>
  );
};

export default AddProduct;
