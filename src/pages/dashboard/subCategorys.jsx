import React, { useEffect, useState, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { URL } from './../../utils/url'
import { getSubCategory, deleteSubCategory, postSubCategory, editSubCategory } from '../../api/subCategoryApi/subCategoryApi'
import { Modal, message, Input } from 'antd'

const SubCategorys = () => {
  const { data } = useSelector((store) => store.subCategory)

  const dispatch = useDispatch()
  const [search, setSearch] = useState('')
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editId, setEditId] = useState(null)
  const [editName, setEditName] = useState('')
  const [subCategoryName, setSubCategoryName] = useState('')

  const filteredData = useMemo(() => {
    const searchLower = search.toLowerCase()
    return data.filter(item =>
      item.subCategoryName &&
      item.subCategoryName.toLowerCase().includes(searchLower)
    )
  }, [data, search])

  const addProductSubmit = (e) => {
    e.preventDefault()
    dispatch(postSubCategory(subCategoryName))
    dispatch(getSubCategory())
    setSubCategoryName('')
  }

  const handleEditSubmit = () => {
    dispatch(editSubCategory({ id: editId, name: editName }))
    dispatch(getSubCategory())
    setIsEditModalOpen(false)
    setEditId(null)
    setEditName('')
  }

  const handleDelete = (id) => {
    dispatch(deleteSubCategory(id))
    dispatch(getSubCategory())
  }

  useEffect(() => {
    dispatch(getSubCategory())
  }, [dispatch])

  return (
    <div className="p-6">
      <div className='flex justify-between items-center mb-6'>
        <form onSubmit={addProductSubmit} className="flex items-center gap-4">
          <input
            type="text"
            className="border p-2 rounded"
            placeholder="Sub Category Name"
            value={subCategoryName}
            onChange={(e) => setSubCategoryName(e.target.value)}
          />
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
            Add Sub Category
          </button>
        </form>
        <div className="w-64">
          <Input
            placeholder='Search sub categories...'
            size="large"
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value) }}
            allowClear
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredData.map((e) => {
          return (
            <div key={e.id} className="border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow p-4">
              <div className="p-3">
                <h3 className="font-semibold text-gray-800 text-lg mb-2">{e.subCategoryName}</h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEditId(e.id)
                      setEditName(e.subCategoryName)
                      setIsEditModalOpen(true)
                    }}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(e.id)}
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

      <Modal
        title="Edit Sub Category"
        open={isEditModalOpen}
        onCancel={() => {
          setIsEditModalOpen(false)
          setEditId(null)
          setEditName('')
        }}
        onOk={handleEditSubmit}
        okText="Save"
        cancelText="Cancel"
        width={400}
      >
        <div className="mb-4">
          <div className="mb-2">Sub Category Name</div>
          <input
            className="border p-2 rounded w-full"
            value={editName}
            onChange={(ev) => setEditName(ev.target.value)}
            placeholder="Sub Category Name"
          />
        </div>
      </Modal>
    </div>
  )
}

export default SubCategorys