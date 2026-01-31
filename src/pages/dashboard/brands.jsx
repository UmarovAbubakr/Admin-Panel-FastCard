import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getBrands, deleteBrands, newBrand, editBrand } from './../../api/brandApi/brandApi';
import { Modal, Input, message } from 'antd';
import { TrashIcon, PencilIcon, PlusIcon, CheckIcon, XMarkIcon } from "@heroicons/react/24/solid";

const Brands = () => {
  const [search, setSearch] = useState('');
  const [brandName, setBrandName] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState(null);
  const [editName, setEditName] = useState('');

  const { data } = useSelector((store) => store.todoBrand);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getBrands(search));
  }, [dispatch, search]);

  const handleDelete = (id) => {
    dispatch(deleteBrands(id)).then(() => {
      dispatch(getBrands());
      setConfirmDelete(null);
      message.success('Бренд успешно удален');
    }).catch(() => {
      message.error('Ошибка при удалении бренда');
    });
  };

  const handleAddBrand = () => {
    if (!brandName.trim()) {
      message.warning('Введите название бренда');
      return;
    }

    dispatch(newBrand(brandName)).then(() => {
      dispatch(getBrands());
      setBrandName('');
      message.success('Бренд успешно добавлен');
    }).catch(() => {
      message.error('Ошибка при добавлении бренда');
    });
  };

  const openEditModal = (brand) => {
    setEditingBrand(brand);
    setEditName(brand.brandName);
    setIsModalOpen(true);
  };

  const handleEdit = () => {
    dispatch(editBrand({
      id: editingBrand.id,
      name: editName
    }))
    dispatch(getBrands());
    setIsModalOpen(false);
    setEditingBrand(null);
    setEditName('');
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setEditingBrand(null);
    setEditName('');
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4 px-4">
        <div className='flex gap-4 items-center'>
          <h1 className="text-2xl font-bold text-blue-gray-900">Brands</h1>
          <div>
            <Input placeholder='Search Brand Name...' size="large" type="text" value={search} onChange={(e) => { setSearch(e.target.value) }} />
          </div>
        </div>
        <div className="flex gap-2">
          <Input
            value={brandName}
            onChange={(e) => setBrandName(e.target.value)}
            placeholder="Brand Name..."
            size="large"
            onPressEnter={handleAddBrand}
          />
          <button
            onClick={handleAddBrand}
            className="bg-gray-900 text-white px-5 py-2 rounded-lg font-medium hover:bg-black transition-all flex items-center gap-2"
          >
            <PlusIcon className="h-4 w-4" /> Add
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {data?.map((e) => (
          <div key={e.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all">
            <div className="p-4 text-center">
              <h3 className="font-bold text-gray-800 text-lg">{e.brandName}</h3>
            </div>

            <div className="flex border-t border-gray-200 h-12">
              {confirmDelete === e.id ? (
                <div className="flex w-full animate-in fade-in duration-300">
                  <button
                    onClick={() => handleDelete(e.id)}
                    className="flex-1 bg-red-50 text-red-600 font-bold text-xs uppercase flex items-center justify-center gap-1 hover:bg-red-100 transition-colors"
                  >
                    <CheckIcon className="h-4 w-4" /> Да
                  </button>
                  <button
                    onClick={() => setConfirmDelete(null)}
                    className="flex-1 bg-gray-50 text-gray-600 font-bold text-xs uppercase flex items-center justify-center gap-1 hover:bg-gray-200 transition-colors"
                  >
                    <XMarkIcon className="h-4 w-4" /> Нет
                  </button>
                </div>
              ) : (
                <>
                  <button
                    onClick={() => openEditModal(e)}
                    className="flex-1 text-blue-500 hover:bg-blue-50 flex items-center justify-center transition-colors"
                  >
                    <PencilIcon className="h-4 w-4" />
                  </button>
                  <div className="w-[1px] bg-gray-200"></div>
                  <button
                    onClick={() => setConfirmDelete(e.id)}
                    className="flex-1 text-red-400 hover:bg-red-50 flex items-center justify-center transition-colors"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      <Modal
        title="Редактировать бренд"
        open={isModalOpen}
        onOk={handleEdit}
        onCancel={handleCancel}
        okText="Save"
        cancelText="Cancel"
        okButtonProps={{
          className: 'bg-blue-500 hover:bg-blue-600'
        }}
      >
        <div className="mt-4">
          <Input
            placeholder="Brand Name..."
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            size="large"
            onPressEnter={handleEdit}
          />
        </div>
      </Modal>
    </div>
  );
};

export default Brands;