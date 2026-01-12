import api from "./axios";

// Upload gallery images
export const uploadProductImages = (productId, formData) =>
  api.post(`/products/${productId}/images`, formData);

// Fetch gallery images
export const getProductImages = (productId) =>
  api.get(`/products/${productId}/images`);

// Delete single image
export const deleteProductImage = (imageId) =>
  api.delete(`/products/images/${imageId}`);
