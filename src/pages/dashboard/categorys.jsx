import React, { useEffect, useState, useMemo, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getCategory, deleteCategory, postCategory, editCategory } from './../../api/categoryApi/categoryApi'
import { URL } from './../../utils/url'
import { message } from 'antd'
import  '../../../public/css/tailwind.css'
import {
  PencilIcon,
  TrashIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  PhotoIcon,
  XMarkIcon,
  FolderIcon,
  CheckIcon,
  ArrowUpTrayIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'

const Category = () => {
  const { data, loading } = useSelector((store) => store.todoCategory)
  
  const dispatch = useDispatch()
  const [search, setSearch] = useState('')
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [editId, setEditId] = useState(null)
  const [editName, setEditName] = useState('')
  const [editImage, setEditImage] = useState(null)
  const [previewImage, setPreviewImage] = useState('')
  const [categoryName, setCategoryName] = useState('')
  const [uploadedImage, setUploadedImage] = useState(null)
  const [imagePreview, setImagePreview] = useState('')
  const [isDeleting, setIsDeleting] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const fileInputRef = useRef(null)
  const addFileInputRef = useRef(null)

  const filteredCategories = useMemo(() => {
    const searchLower = search.toLowerCase()
    return data.filter(category =>
      category.categoryName &&
      category.categoryName.toLowerCase().includes(searchLower)
    )
  }, [data, search])

  const handleAddSubmit = (e) => {
    e.preventDefault()
    if (!uploadedImage || !categoryName.trim()) {
      message.error('Please provide both category name and image')
      return
    }

    const formData = new FormData()
    formData.append("CategoryImage", uploadedImage)
    formData.append("CategoryName", categoryName)

    dispatch(postCategory(formData)).then(() => {
      dispatch(getCategory())
      message.success('Category added successfully!')
      setIsAddModalOpen(false)
      setCategoryName('')
      setUploadedImage(null)
      setImagePreview('')
    }).catch(() => {
      message.error('Failed to add category')
    })
  }

  const handleEditSubmit = () => {
    if (!editName.trim()) {
      message.error('Category name is required')
      return
    }

    const formData = new FormData()
    formData.append("CategoryName", editName)
    formData.append("Id", editId)
    
    if (editImage) {
      formData.append("CategoryImage", editImage)
    }

    dispatch(editCategory(formData)).then(() => {
      dispatch(getCategory())
      message.success('Category updated successfully!')
      setIsEditModalOpen(false)
      resetEditForm()
    }).catch(() => {
      message.error('Failed to update category')
    })
  }

  const resetEditForm = () => {
    setEditId(null)
    setEditName('')
    setEditImage(null)
    setPreviewImage('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleEditClick = (category) => {
    setEditId(category.id)
    setEditName(category.categoryName)
    setPreviewImage(URL + `/images/${category.categoryImage}`)
    setIsEditModalOpen(true)
  }

  const handleEditImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        message.error('Image size should be less than 5MB')
        return
      }
      setEditImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewImage(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        message.error('Image size should be less than 5MB')
        return
      }
      setUploadedImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDelete = (id) => {
    setDeleteConfirm(id)
  }

  const confirmDelete = (id) => {
    setIsDeleting(id)
    dispatch(deleteCategory(id)).then(() => {
      dispatch(getCategory())
      message.success('Category deleted successfully')
      setIsDeleting(null)
      setDeleteConfirm(null)
    }).catch(() => {
      message.error('Failed to delete category')
      setIsDeleting(null)
      setDeleteConfirm(null)
    })
  }

  useEffect(() => {
    dispatch(getCategory())
  }, [dispatch])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6">
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-xl">
                <FolderIcon className="h-8 w-8 text-blue-600" />
              </div>
              Categories
            </h1>
            <p className="text-gray-600 mt-2">Manage your product categories ({data?.length || 0} total)</p>
          </div>
          
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="group flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
          >
            <PlusIcon className="h-5 w-5 group-hover:rotate-90 transition-transform" />
            Add Category
          </button>
        </div>

        <div className="relative max-w-lg">
          <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search categories..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-4 top-1/2 transform -translate-y-1/2"
            >
              <XMarkIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : filteredCategories.length === 0 ? (
        <div className="text-center py-16">
          <div className="max-w-md mx-auto">
            <div className="p-4 bg-gray-100 rounded-2xl inline-block mb-4">
              <FolderIcon className="h-12 w-12 text-gray-400 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              {search ? 'No categories found' : 'No categories yet'}
            </h3>
            <p className="text-gray-500 mb-6">
              {search ? 'Try a different search term' : 'Get started by creating your first category'}
            </p>
            {!search && (
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-colors"
              >
                <PlusIcon className="h-5 w-5" />
                Create First Category
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
          {filteredCategories.map((category) => (
            <div
              key={category.id}
              className="group bg-white rounded-2xl shadow-md hover:shadow-xl border border-gray-200 overflow-hidden transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="relative h-48 overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
                <img
                  src={URL + `/images/${category.categoryImage}`}
                  alt={category.categoryName}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1579546929662-711aa81148cf?w=400&h=300&fit=crop'
                  }}
                />
                
                <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button
                    onClick={() => handleEditClick(category)}
                    className="p-2 bg-white/90 backdrop-blur-sm rounded-lg shadow-md hover:bg-white hover:scale-110 transition-all duration-200"
                    title="Edit category"
                  >
                    <PencilIcon className="h-4 w-4 text-blue-600" />
                  </button>
                  
                  {deleteConfirm === category.id ? (
                    <div className="flex gap-1 bg-white/90 backdrop-blur-sm rounded-lg shadow-md p-1">
                      <button
                        onClick={() => confirmDelete(category.id)}
                        disabled={isDeleting === category.id}
                        className="p-1.5 bg-red-500 hover:bg-red-600 text-white rounded transition-colors disabled:opacity-50"
                        title="Confirm delete"
                      >
                        {isDeleting === category.id ? (
                          <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <CheckIcon className="h-4 w-4" />
                        )}
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(null)}
                        className="p-1.5 bg-gray-100 hover:bg-gray-200 rounded transition-colors"
                        title="Cancel"
                      >
                        <XMarkIcon className="h-4 w-4 text-gray-600" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleDelete(category.id)}
                      className="p-2 bg-white/90 backdrop-blur-sm rounded-lg shadow-md hover:bg-red-50 hover:scale-110 transition-all duration-200"
                      title="Delete category"
                    >
                      <TrashIcon className="h-4 w-4 text-red-500" />
                    </button>
                  )}
                </div>
              </div>

              <div className="p-5">
                <h3 className="font-semibold text-gray-800 text-lg mb-2 truncate">
                  {category.categoryName}
                </h3>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">
                    ID: {category.id}
                  </span>
                  <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                    Active
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                  <PlusIcon className="h-6 w-6 text-blue-600" />
                  Add New Category
                </h2>
                <button
                  onClick={() => {
                    setIsAddModalOpen(false)
                    setCategoryName('')
                    setUploadedImage(null)
                    setImagePreview('')
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <XMarkIcon className="h-5 w-5 text-gray-500" />
                </button>
              </div>

              <form onSubmit={handleAddSubmit}>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category Image
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-400 transition-colors">
                    {imagePreview ? (
                      <div className="relative">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-40 h-40 object-cover rounded-lg mx-auto mb-4"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setImagePreview('')
                            setUploadedImage(null)
                          }}
                          className="absolute top-0 right-0 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                        >
                          <XMarkIcon className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <PhotoIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                        <p className="text-gray-500 mb-2">Drag & drop or click to upload</p>
                        <p className="text-sm text-gray-400 mb-4">PNG, JPG up to 5MB</p>
                      </>
                    )}
                    <input
                      ref={addFileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                      required={!imagePreview}
                    />
                    <label
                      htmlFor="image-upload"
                      className="inline-flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg cursor-pointer transition-colors"
                    >
                      <ArrowUpTrayIcon className="h-4 w-4" />
                      {imagePreview ? 'Change Image' : 'Choose Image'}
                    </label>
                  </div>
                </div>

                <div className="mb-8">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category Name
                  </label>
                  <input
                    type="text"
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                    placeholder="Enter category name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    required
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddModalOpen(false)
                      setCategoryName('')
                      setUploadedImage(null)
                      setImagePreview('')
                    }}
                    className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-medium shadow-md hover:shadow-lg transition-all"
                  >
                    Create Category
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                  <PencilIcon className="h-6 w-6 text-blue-600" />
                  Edit Category
                </h2>
                <button
                  onClick={() => {
                    setIsEditModalOpen(false)
                    resetEditForm()
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <XMarkIcon className="h-5 w-5 text-gray-500" />
                </button>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Image
                </label>
                <img
                  src={previewImage}
                  alt="Current"
                  className="w-40 h-40 object-cover rounded-xl border border-gray-200 mx-auto"
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Change Image (Optional)
                </label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleEditImageChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                <p className="text-xs text-gray-500 mt-2">Leave empty to keep current image</p>
              </div>

              <div className="mb-8">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category Name
                </label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="Enter category name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  required
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditModalOpen(false)
                    resetEditForm()
                  }}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleEditSubmit}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-xl font-medium shadow-md hover:shadow-lg transition-all"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && !isEditModalOpen && !isAddModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-40">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full">
            <div className="p-6">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-red-100 rounded-full">
                  <ExclamationTriangleIcon className="h-8 w-8 text-red-600" />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 text-center mb-2">
                Delete Category?
              </h3>
              <p className="text-gray-600 text-center mb-6">
                This action cannot be undone. All products in this category will be affected.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={() => confirmDelete(deleteConfirm)}
                  disabled={isDeleting === deleteConfirm}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-xl font-medium shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isDeleting === deleteConfirm ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {!loading && data.length === 0 && !isAddModalOpen && (
        <div className="text-center py-16">
          <div className="max-w-md mx-auto">
            <div className="relative mb-8">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 blur-2xl opacity-20 rounded-full h-48 w-48 mx-auto"></div>
              <div className="relative p-8 bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-lg border border-gray-200">
                <FolderIcon className="h-20 w-20 text-gray-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-800 mb-3">No Categories Yet</h3>
                <p className="text-gray-600 mb-6">
                  Start organizing your products by creating categories. It helps customers find what they're looking for faster.
                </p>
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
                >
                  <PlusIcon className="h-5 w-5" />
                  Create Your First Category
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Category