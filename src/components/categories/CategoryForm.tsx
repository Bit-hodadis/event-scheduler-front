import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import type { Category, CreateCategoryDto } from '../../types/category.types';
import { useCreateCategoryMutation, useUpdateCategoryMutation } from '../../services/category.service';
import { useToast } from '../../context/ToastContext';

const categorySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  color: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Invalid color hex code'),
  description: z.string().optional(),
});

interface CategoryFormProps {
  category?: Category;
  onSubmit: (data: CreateCategoryDto) => Promise<void>;
  isLoading?: boolean;
}

export const CategoryForm: React.FC<CategoryFormProps> = ({
  category,
  onSubmit,
  isLoading,
}) => {
  const methods = useForm<z.infer<typeof categorySchema>>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: category?.name || '',
      color: category?.color || '#6366F1',
      description: category?.description || '',
    },
  });

  const [createCategory] = useCreateCategoryMutation()
  const [updateCategory] = useUpdateCategoryMutation()
const toast = useToast()
  const handleSubmit = methods.handleSubmit(async (data) => {
    try {
      if(category){
        await updateCategory({ id: category.id, data:data }).unwrap();
        toast.success('Category updated successfully');
      }else{
        await createCategory(data).unwrap();
        toast.success('Category created successfully');
      }
      methods.reset();
      onSubmit(data)
    } catch (error) {
      toast.error(error?.data?.detail||error?.data?.name||'Failed to create category');
      console.error('Failed to create category:', error);
      // TODO: Show error toast
    }
  });

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">
          Category Name
        </label>
        <input
          type="text"
          {...methods.register('name')}
          className={`mt-1 block w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-1 ${methods.formState.errors.name ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-primary-500'}`}
        />
        {methods.formState.errors.name && (
          <p className="text-sm text-red-600">{methods.formState.errors.name.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Color
        </label>
        <div className="flex items-center space-x-2">
          <input
            type="color"
            value={methods.watch('color')}
            onChange={(e) => methods.setValue('color', e.target.value.toUpperCase())}
            className="h-10 w-full w-20 p-1 rounded border border-gray-300"
          />
          <input
            type="text"
            {...methods.register('color')}
            onChange={(e) => methods.setValue('color', e.target.value.toUpperCase())}
            className="mt-1 w-full block w-32 px-3 py-2 text-sm border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 rounded-md bg-gray-50"
            placeholder="#6366F1"
          />
        </div>
        {methods.formState.errors.color && (
          <p className="mt-1 text-sm text-red-600">
            {methods.formState.errors.color.message}
          </p>
        )}
      </div>

      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">
          Description (Optional)
        </label>
        <textarea
          {...methods.register('description')}
          className={`mt-1 block w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-1 ${methods.formState.errors.description ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-primary-500'}`}
          rows={3}
        />
        {methods.formState.errors.description && (
          <p className="text-sm text-red-600">{methods.formState.errors.description.message}</p>
        )}
      </div>

      <div className="flex justify-end pt-4">
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 rounded-md disabled:opacity-50"
        >
          {isLoading ? 'Saving...' : category ? 'Update Category' : 'Create Category'}
        </button>
      </div>
    </form>
  );
};
