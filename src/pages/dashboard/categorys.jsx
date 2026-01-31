import React, { useEffect, useState, useMemo, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getCategory, deleteCategory, postCategory, editCategory } from './../../api/categoryApi/categoryApi'
import { URL } from './../../utils/url'
import { Input, Modal, message } from 'antd'

const Category = () => {
  const { data } = useSelector((store) => store.todoCategory)

  const dispatch = useDispatch()
  const [search, setSearch] = useState('')
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editId, setEditId] = useState(null)
  const [editName, setEditName] = useState('')
  const [editImage, setEditImage] = useState(null)
  const [previewImage, setPreviewImage] = useState('')
  const [categoryName, setCategoryName] = useState('')
  const [fileList, setFileList] = useState([])
  const fileInputRef = useRef(null)

  const filteredCategories = useMemo(() => {
    const searchLower = search.toLowerCase()
    return data.filter(category =>
      category.categoryName &&
      category.categoryName.toLowerCase().includes(searchLower)
    )
  }, [data, search])

  const addProductSubmit = (e) => {
    e.preventDefault()
    const formData = new FormData()

    const files = e.target.Images.files
    if (files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        formData.append("CategoryImage", files[i])
      }
    }

    formData.append("CategoryName", e.target.CategoryName.value)

    dispatch(postCategory(formData))
    dispatch(getCategory())
    e.target.reset()
    setCategoryName('')
    setFileList([])
  }

  const handleEditSubmit = () => {
    const formData = new FormData()
    formData.append("CategoryName", editName)
    formData.append("Id", editId)
    formData.append("CategoryImage", editImage)

    dispatch(editCategory(formData))
    dispatch(getCategory())
    setIsEditModalOpen(false)
    setEditId(null)
    setEditName('')
    setEditImage(null)
    setPreviewImage('')
    fileInputRef.current.value = ''
  }

  const handleEditClick = (category) => {
    setEditId(category.id)
    setEditName(category.categoryName)
    setPreviewImage(URL + `/images/${category.categoryImage}`)
    setIsEditModalOpen(true)
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setEditImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewImage(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  useEffect(() => {
    dispatch(getCategory())
  }, [dispatch])

  return (
    <div className="p-6">
      <div className='flex justify-between items-center mb-6'>
        <form onSubmit={addProductSubmit} className="flex items-center gap-4">
          <div className="flex flex-col">
            <input
              name='Images'
              type="file"
              className="border p-2 rounded mb-2"
            />
            <input
              name='CategoryName'
              type="text"
              className="border p-2 rounded"
              placeholder="Category Name"
              required
            />
          </div>
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded h-fit">
            Add Category
          </button>
        </form>
        <div className="w-64">
          <Input
            placeholder='Search categories...'
            size="large"
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value) }}
            allowClear
          />
        </div>
      </div>

      {filteredCategories.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          {search ? 'No categories found' : 'No categories'}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {filteredCategories.map((e) => {
            return (
              <div key={e.id} className="border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                <img
                  className='w-full h-32 object-cover'
                  src={URL + `/images/${e.categoryImage}`}
                  alt={e.categoryName}
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/150'
                  }}
                />
                <div className="p-3">
                  <h3 className="font-semibold text-gray-800 mb-2 truncate">{e.categoryName}</h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditClick(e)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        dispatch(deleteCategory(e.id)).then(() => {
                          dispatch(getCategory())
                          message.success('Category deleted successfully')
                        })
                      }}
                      className="text-red-500 hover:text-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      <Modal
        title="Edit Category"
        open={isEditModalOpen}
        onCancel={() => {
          setIsEditModalOpen(false)
          setEditId(null)
          setEditName('')
          setEditImage(null)
          setPreviewImage('')
          if (fileInputRef.current) {
            fileInputRef.current.value = ''
          }
        }}
        onOk={handleEditSubmit}
        okText="Save"
        cancelText="Cancel"
        width={500}
      >
        <div className="space-y-4">
          <div>
            <div className="mb-2 font-medium">Current Image</div>
            {previewImage && (
              <div className="mb-4">
                <img
                  src={previewImage}
                  alt="Preview"
                  className="w-32 h-32 object-cover rounded border"
                />
              </div>
            )}
            <div className="mb-2 font-medium">Change Image</div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="border p-2 rounded w-full"
            />
          </div>

          <div>
            <div className="mb-2 font-medium">Category Name</div>
            <input
              className="border p-2 rounded w-full"
              value={editName}
              onChange={(ev) => setEditName(ev.target.value)}
              placeholder="Category Name"
              autoFocus
            />
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default Category