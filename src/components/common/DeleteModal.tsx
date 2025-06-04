"use client"

import React from 'react'
import {Button} from './Button.tsx'
import Modal from './Modal.tsx'

interface DeleteModalProps {
  showDeleteModal: boolean
  onDelete: (confirm: boolean) => void
  title: string
  topic: string
}

const DeleteModal: React.FC<DeleteModalProps> = ({
  showDeleteModal,
  onDelete,
  title,
  topic,
}) => (
  <Modal
    isOpen={showDeleteModal}
    onClose={() => onDelete(false)}
    title={`Delete ${topic}`}
    size="sm"
    footer={
      <>
        <Button
          variant="secondary"
          className='bg-primary/90 hover:bg-primary'
          onClick={() => onDelete(false)}
        >
          Cancel
        </Button>
        <Button
          variant="danger"
          className='text-red-900  hover:text-white hover:bg-red-700'
          onClick={() => onDelete(true)}
        >
          Delete
        </Button>
      </>
    }
  >
    <div className="text-center py-4">
      <p className="text-gray-600">
        Are you sure you want to delete the {title}? This action cannot be undone.
      </p>
    </div>
  </Modal>
)

export default DeleteModal