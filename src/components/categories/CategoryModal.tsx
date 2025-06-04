import React from 'react';
import Modal from '../common/Modal';
import { CategoryForm } from './CategoryForm';
import type { Category, CreateCategoryDto } from '../../types/category.types';

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  category?: Category;
  onSubmit: (data: CreateCategoryDto) => Promise<void>;
  isLoading?: boolean;
}

export const CategoryModal: React.FC<CategoryModalProps> = ({
  isOpen,
  onClose,
  category,
  onSubmit,
  isLoading,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={category ? 'Edit Category' : 'Create New Category'}
      size="md"
    >
      <CategoryForm
        category={category}
        onSubmit={onSubmit}
        isLoading={isLoading}
      />
    </Modal>
  );
};
