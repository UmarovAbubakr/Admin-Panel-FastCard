import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Input, Modal, message } from 'antd';
import { getColors, deleteColor, newColor, editColor } from '../../api/colorApi/colorApi';

const Colors = () => {
  const [search, setSearch] = useState('');
  const [colorInput, setColorInput] = useState('')
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editId, setEditId] = useState(null)
  const [editName, setEditName] = useState('')

  const { data } = useSelector((store) => store.todoColor);
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getColors(search))
  }, [dispatch, search])

  const handleAddColor = () => {
    dispatch(newColor(colorInput))
    setColorInput('');
  };

  const handleEditSubmit = () => {
    dispatch(editColor({ id: editId, name: editName }))
    setIsEditModalOpen(false);
    setEditId(null);
    setEditName('');
  };

  const handleDelete = (id, colorName) => {
    Modal.confirm({
      title: 'Confirm Delete',
      content: `Are you sure you want to delete "${colorName}" color?`,
      okText: 'Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk() {
        dispatch(deleteColor(id)).then(() => {
          message.success('Color deleted successfully');
        }).catch(() => {
          message.error('Error deleting color');
        });
      },
    });
  };

  const getContrastColor = (hexColor) => {

    hexColor = hexColor.replace('#', '');

    if (hexColor.length === 3) {
      hexColor = hexColor.split('').map(char => char + char).join('');
    }

    const r = parseInt(hexColor.substr(0, 2), 16);
    const g = parseInt(hexColor.substr(2, 2), 16);
    const b = parseInt(hexColor.substr(4, 2), 16);

    const brightness = (r * 299 + g * 587 + b * 114) / 1000;

    return brightness > 128 ? '#000000' : '#ffffff';
  };

  const isValidColor = (color) => {
    const s = new Option().style;
    s.color = color;
    return s.color !== '';
  };

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Colors</h1>
      </div>
      <div className='flex justify-between items-center '>
        <div>
          <Input placeholder='Search Brand Name...' size="large" type="text" value={search} onChange={(e) => { setSearch(e.target.value) }} />
        </div>
        <div className="mb-6 flex gap-2">
          <input
            value={colorInput}
            type="text"
            placeholder="Color Name"
            className="w-40 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none flex-1"
            onChange={(e) => setColorInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddColor()}
          />
          <button
            onClick={handleAddColor}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            Add Color
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
        {data?.map((e) => {
          const color = e.colorName || '#cccccc';
          const textColor = getContrastColor(color);
          const isValid = isValidColor(color);

          return (
            <div
              key={e.id}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200"
            >
              <div
                className="h-32 flex items-center justify-center relative"
                style={{
                  backgroundColor: isValid ? color : '#cccccc',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                <div className="absolute top-0 left-0 w-20 h-20 bg-white opacity-20 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute bottom-0 right-0 w-16 h-16 bg-white opacity-15 rounded-full translate-x-1/3 translate-y-1/3"></div>

                <div
                  className="w-16 h-16 rounded-full border-4 border-white shadow-lg flex items-center justify-center"
                  style={{
                    backgroundColor: isValid ? color : '#cccccc',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                  }}
                >
                  <span
                    className="font-bold text-sm"
                    style={{ color: textColor }}
                  >
                    {e.colorName?.substring(0, 2).toUpperCase()}
                  </span>
                </div>
              </div>

              <div className="p-4">
                <div className="flex justify-between items-center mb-3">
                  <span
                    className="font-semibold truncate"
                    style={{ color: textColor }}
                    title={e.colorName}
                  >
                    {e.colorName}
                  </span>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEditId(e.id);
                      setEditName(e.colorName);
                      setIsEditModalOpen(true);
                    }}
                    className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-600 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(e.id, e.colorName)}
                    className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <Modal
        title="Edit Color"
        open={isEditModalOpen}
        onCancel={() => {
          setIsEditModalOpen(false);
          setEditId(null);
          setEditName('');
        }}
        onOk={handleEditSubmit}
        okText="Save"
        cancelText="Cancel"
        width={400}
      >
        <div className="mb-4">
          <div className="mb-2 font-medium">Color Name</div>
          <input
            type="text"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            value={editName}
            onChange={(ev) => setEditName(ev.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleEditSubmit()}
          />
        </div>

        <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
          <div
            className="w-10 h-10 rounded-full border"
            style={{ backgroundColor: isValidColor(editName) ? editName : '#cccccc' }}
          ></div>
          <div className="text-sm text-gray-600">
            Preview of the color
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default Colors