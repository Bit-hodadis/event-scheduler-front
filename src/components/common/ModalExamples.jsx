import React, { useState } from 'react';
import Modal from './Modal';
import Button from './Button';

const ModalExamples = () => {
  const [simpleModal, setSimpleModal] = useState(false);
  const [confirmModal, setConfirmModal] = useState(false);
  const [formModal, setFormModal] = useState(false);
  const [customModal, setCustomModal] = useState(false);

  // Simple Modal Example
  const SimpleModalExample = () => (
    <Modal
      isOpen={simpleModal}
      onClose={() => setSimpleModal(false)}
      title="Simple Modal"
      description="This is a basic modal with a title and description."
      footer={
        <>
          <Button
            variant="secondary"
            onClick={() => setSimpleModal(false)}
          >
            Cancel
          </Button>
          <Button onClick={() => setSimpleModal(false)}>
            Confirm
          </Button>
        </>
      }
    >
      <p className="text-gray-600">
        This is a simple modal example with a title, description, and footer buttons.
      </p>
    </Modal>
  );

  // Confirmation Modal Example
  const ConfirmModalExample = () => (
    <Modal
      isOpen={confirmModal}
      onClose={() => setConfirmModal(false)}
      title="Delete Confirmation"
      size="sm"
      footer={
        <>
          <Button
            variant="secondary"
            onClick={() => setConfirmModal(false)}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              // Handle delete action
              setConfirmModal(false);
            }}
          >
            Delete
          </Button>
        </>
      }
    >
      <div className="text-center py-4">
        <p className="text-gray-600">
          Are you sure you want to delete this item? This action cannot be undone.
        </p>
      </div>
    </Modal>
  );

  // Form Modal Example
  const FormModalExample = () => (
    <Modal
      isOpen={formModal}
      onClose={() => setFormModal(false)}
      title="Add New Item"
      description="Fill in the details to add a new item."
      size="lg"
      footer={
        <>
          <Button
            variant="secondary"
            onClick={() => setFormModal(false)}
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              // Handle form submission
              setFormModal(false);
            }}
          >
            Save Changes
          </Button>
        </>
      }
    >
      <form className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            rows={3}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Category</label>
          <select
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option>Option 1</option>
            <option>Option 2</option>
            <option>Option 3</option>
          </select>
        </div>
      </form>
    </Modal>
  );

  // Custom Modal Example
  const CustomModalExample = () => (
    <Modal
      isOpen={customModal}
      onClose={() => setCustomModal(false)}
      size="xl"
      className="bg-gray-900 text-white"
    >
      <div className="p-8">
        <h2 className="text-3xl font-bold mb-4">Custom Styled Modal</h2>
        <p className="text-gray-300 mb-6">
          This modal demonstrates custom styling possibilities.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-2">Feature 1</h3>
            <p className="text-gray-400">Custom feature description goes here.</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-2">Feature 2</h3>
            <p className="text-gray-400">Another feature description goes here.</p>
          </div>
        </div>
        <div className="mt-8 flex justify-end">
          <Button
            variant="secondary"
            onClick={() => setCustomModal(false)}
          >
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );

  return (
    <div className="p-8 space-y-4">
      <h1 className="text-2xl font-bold mb-6">Modal Examples</h1>
      
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold mb-2">Simple Modal</h2>
          <Button onClick={() => setSimpleModal(true)}>
            Open Simple Modal
          </Button>
          <SimpleModalExample />
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-2">Confirmation Modal</h2>
          <Button
            variant="danger"
            onClick={() => setConfirmModal(true)}
          >
            Open Confirmation Modal
          </Button>
          <ConfirmModalExample />
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-2">Form Modal</h2>
          <Button onClick={() => setFormModal(true)}>
            Open Form Modal
          </Button>
          <FormModalExample />
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-2">Custom Modal</h2>
          <Button
            variant="secondary"
            onClick={() => setCustomModal(true)}
          >
            Open Custom Modal
          </Button>
          <CustomModalExample />
        </div>
      </div>
    </div>
  );
};

export default ModalExamples;
