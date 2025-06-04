import React, { useState } from 'react';
import { CategoryModal } from '../components/categories/CategoryModal';
import type { Category, CreateCategoryDto } from '../types/category.types';
import { useGetCategoriesQuery, useUpdateCategoryMutation, useDeleteCategoryMutation } from '../services/category.service';
import { useToast } from '../context/ToastContext';

export const CategoriesPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | undefined>();
const { data: categories,refetch:refetchCategory } = useGetCategoriesQuery();
const [updateCategory] = useUpdateCategoryMutation();
const [deleteCategory] = useDeleteCategoryMutation();

const toast = useToast()

  const handleDeleteCategory = async (id: string) => {
    try {
      await deleteCategory(id).unwrap();
      refetchCategory()
      toast.success('Category deleted successfully');
    } catch (error) {
      toast.error(error?.data?.detail||error?.data?.name||'Failed to delete category');
      console.error('Failed to delete category:', error);
    }
  };

  return (
    <div className="mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
        <button
          onClick={() => {
            setSelectedCategory(undefined);
            setIsModalOpen(true);
          }}
          className="px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 rounded-md"
        >
          Add Category
        </button>
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {categories?.map((category) => (
          <div
            key={category.id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-4"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: category.color }}
                />
                <h3 className="text-lg font-medium text-gray-900">
                  {category.name}
                </h3>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    setSelectedCategory(category);
                    setIsModalOpen(true);
                  }}
                  className="p-1 text-gray-400 hover:text-gray-500"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </button>
                <button
                  onClick={() => handleDeleteCategory(category.id)}
                  className="p-1 text-gray-400 hover:text-red-500"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
            {category.description && (
              <p className="text-sm text-gray-500">{category.description}</p>
            )}
          </div>
        ))}
      </div>

      <CategoryModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedCategory(undefined);
        }}
        category={selectedCategory}
        onSubmit={async (data) => {
          refetchCategory()
          setIsModalOpen(false);
          setSelectedCategory(undefined);
        }}
      />
    </div>
  );
};
