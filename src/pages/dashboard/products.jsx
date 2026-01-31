import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getProducts, deleteProducts, addImg, postProduct, editProduct } from './../../api/productApi/productApi'
import { URL } from '../../utils/url'
import { getSubCategory } from './../../api/subCategoryApi/subCategoryApi'
import { PlusCircle, Trash2, Edit2, Image as ImageIcon, Upload, DollarSign, Hash, Package, Tag, Percent, X } from 'lucide-react'

const Products = () => {
  const dispatch = useDispatch()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)

  const { data = {} } = useSelector((store) => store.todo)
  const { subCategory = [] } = useSelector((store) => store.subCategory)

  const [editForm, setEditForm] = useState({
    Id: '',
    BrandId: '',
    ColorId: '',
    ProductName: '',
    Description: '',
    Quantity: '',
    Code: '',
    Price: '',
    HasDiscount: 'false',
    DiscountPrice: '',
    SubCategoryId: ''
  })

  const handleFileChange = (event, id) => {
    const file = event.target.files[0]
    const formData = new FormData()
    formData.append('image', file)
    formData.append('id', id)
    dispatch(addImg(formData))
  }

  const addProductSubmit = (e) => {
    e.preventDefault()
    const formData = new FormData()

    const files = e.target.images.files
    if (files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        formData.append("Images", files[i])
      }
    }

    formData.append("ProductName", e.target.productName.value)
    formData.append("Description", e.target.description.value)
    formData.append("Quantity", Number(e.target.quantity.value))
    formData.append("Code", e.target.code.value)
    formData.append("Price", Number(e.target.price.value))
    formData.append("HasDiscount", e.target.hasDiscount.value === "true")
    formData.append("DiscountPrice", Number(e.target.discountPrice.value))
    formData.append("SubCategoryId", Number(e.target.subCategoryId.value))
    formData.append("BrandId", Number(e.target.brandId.value))
    formData.append("ColorId", Number(e.target.colorId.value))

    dispatch(postProduct(formData))
    setIsModalOpen(false)
    e.target.reset()
  }

  const handleEditProduct = (product) => {
    setSelectedProduct(product)
    setEditForm({
      Id: product.id,
      BrandId: product.brandId || '',
      ColorId: product.colorId || '',
      ProductName: product.productName,
      Description: product.description,
      Quantity: product.quantity,
      Code: product.code,
      Price: product.price,
      HasDiscount: product.hasDiscount ? 'true' : 'false',
      DiscountPrice: product.discountPrice || '',
      SubCategoryId: product.subCategoryId || ''
    })
    setIsEditModalOpen(true)
  }

  const handleEditSubmit = (e) => {
    e.preventDefault()
    
    const params = new URLSearchParams({
      Id: editForm.Id,
      BrandId: editForm.BrandId,
      ColorId: editForm.ColorId,
      ProductName: editForm.ProductName,
      Description: editForm.Description,
      Quantity: editForm.Quantity,
      Code: editForm.Code,
      Price: editForm.Price,
      HasDiscount: editForm.HasDiscount,
      DiscountPrice: editForm.DiscountPrice,
      SubCategoryId: editForm.SubCategoryId
    })

    dispatch(editProduct(params))
      .then(() => {
        dispatch(getProducts())
        setIsEditModalOpen(false)
        setSelectedProduct(null)
        setEditForm({
          Id: '',
          BrandId: '',
          ColorId: '',
          ProductName: '',
          Description: '',
          Quantity: '',
          Code: '',
          Price: '',
          HasDiscount: 'false',
          DiscountPrice: '',
          SubCategoryId: ''
        })
      })
  }

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      dispatch(deleteProducts(id)).then(() => dispatch(getProducts()))
    }
  }

  useEffect(() => {
    dispatch(getProducts())
    dispatch(getSubCategory())
  }, [dispatch])

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Product Management</h1>
          <p className="text-gray-600 mt-2">Manage your products, inventory, and pricing</p>
        </div>

        <div className="mb-8">
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-all duration-200 shadow-md hover:shadow-lg"
          >
            <PlusCircle size={20} />
            Add New Product
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {data?.products?.map((product) => (
            <div key={product.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-gray-100">
              <div className="relative h-48 bg-gray-100">
                <img
                  src={URL + `/images/${product.image}`}
                  alt={product.productName}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/300x200?text=No+Image'
                  }}
                />
                {product.hasDiscount && (
                  <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                    -{Math.round((product.price - product.discountPrice) / product.price * 100)}% OFF
                  </div>
                )}
              </div>

              <div className="p-5">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-semibold text-gray-800 truncate">{product.productName}</h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditProduct(product)}
                      className="text-blue-600 hover:text-blue-800 p-1 hover:bg-blue-50 rounded"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="text-red-600 hover:text-red-800 p-1 hover:bg-red-50 rounded"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 text-sm">Price:</span>
                    <div className="flex items-center gap-2">
                      {product.hasDiscount ? (
                        <>
                          <span className="text-red-600 font-bold">${product.discountPrice}</span>
                          <span className="text-gray-400 line-through text-sm">${product.price}</span>
                        </>
                      ) : (
                        <span className="text-gray-800 font-bold">${product.price}</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 text-sm">Stock:</span>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${product.quantity > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {product.quantity > 0 ? `${product.quantity} in stock` : 'Out of stock'}
                    </span>
                  </div>
                </div>

                <div className="mt-4">
                  <label className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800 cursor-pointer">
                    <input
                      type="file"
                      onChange={(event) => handleFileChange(event, product.id)}
                      className="hidden"
                      id={`file-${product.id}`}
                    />
                    <ImageIcon size={16} />
                    <span>Change image</span>
                  </label>
                </div>
              </div>
            </div>
          ))}
        </div>

        {(!data?.products || data.products.length === 0) && (
          <div className="text-center py-16">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-500 mb-2">No products yet</h3>
            <p className="text-gray-400 mb-6">Add your first product to get started</p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg inline-flex items-center gap-2"
            >
              <PlusCircle size={20} />
              Add Product
            </button>
          </div>
        )}

        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">Add New Product</h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  &times;
                </button>
              </div>

              <form onSubmit={addProductSubmit} className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                        <Upload size={18} />
                        Product Images
                      </label>
                      <input
                        name="images"
                        multiple
                        type="file"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                        <Tag size={18} />
                        Product Name
                      </label>
                      <input
                        placeholder="Enter product name"
                        name="productName"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                        <Edit2 size={18} />
                        Description
                      </label>
                      <textarea
                        placeholder="Enter product description"
                        name="description"
                        rows="3"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition resize-none"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                        <Package size={18} />
                        Quantity
                      </label>
                      <input
                        placeholder="Enter quantity"
                        name="quantity"
                        type="number"
                        min="0"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                        <Hash size={18} />
                        Product Code
                      </label>
                      <input
                        placeholder="Enter product code"
                        name="code"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                        <DollarSign size={18} />
                        Price ($)
                      </label>
                      <input
                        placeholder="Enter price"
                        name="price"
                        type="number"
                        step="0.01"
                        min="0"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                          <Percent size={18} />
                          Discount
                        </label>
                        <select
                          name="hasDiscount"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                        >
                          <option value="false">No Discount</option>
                          <option value="true">Has Discount</option>
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Discount Price ($)</label>
                        <input
                          placeholder="Discount price"
                          name="discountPrice"
                          type="number"
                          step="0.01"
                          min="0"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Subcategory ID</label>
                      <input
                        placeholder="Enter subcategory ID"
                        name="subCategoryId"
                        type="number"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Brand</label>
                      <select
                        name="brandId"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                      >
                        <option value="">Select Brand</option>
                        {data?.brands?.map((brand) => (
                          <option key={brand.id} value={brand.id}>{brand.brandName}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Color</label>
                      <select
                        name="colorId"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                      >
                        <option value="">Select Color</option>
                        {data?.colors?.map((color) => (
                          <option key={color.id} value={color.id}>{color.colorName}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-4 mt-8 pt-6 border-t">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                  >
                    <PlusCircle size={20} />
                    Add Product
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {isEditModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">Edit Product</h2>
                <button
                  onClick={() => {
                    setIsEditModalOpen(false)
                    setSelectedProduct(null)
                    setEditForm({
                      Id: '',
                      BrandId: '',
                      ColorId: '',
                      ProductName: '',
                      Description: '',
                      Quantity: '',
                      Code: '',
                      Price: '',
                      HasDiscount: 'false',
                      DiscountPrice: '',
                      SubCategoryId: ''
                    })
                  }}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  &times;
                </button>
              </div>

              <form onSubmit={handleEditSubmit} className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                        <Tag size={18} />
                        Product Name
                      </label>
                      <input
                        placeholder="Enter product name"
                        value={editForm.ProductName}
                        onChange={(e) => setEditForm({...editForm, ProductName: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                        <Edit2 size={18} />
                        Description
                      </label>
                      <textarea
                        placeholder="Enter product description"
                        value={editForm.Description}
                        onChange={(e) => setEditForm({...editForm, Description: e.target.value})}
                        rows="3"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition resize-none"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                        <Package size={18} />
                        Quantity
                      </label>
                      <input
                        placeholder="Enter quantity"
                        value={editForm.Quantity}
                        onChange={(e) => setEditForm({...editForm, Quantity: e.target.value})}
                        type="number"
                        min="0"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                        <Hash size={18} />
                        Product Code
                      </label>
                      <input
                        placeholder="Enter product code"
                        value={editForm.Code}
                        onChange={(e) => setEditForm({...editForm, Code: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                        <DollarSign size={18} />
                        Price ($)
                      </label>
                      <input
                        placeholder="Enter price"
                        value={editForm.Price}
                        onChange={(e) => setEditForm({...editForm, Price: e.target.value})}
                        type="number"
                        step="0.01"
                        min="0"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                          <Percent size={18} />
                          Discount
                        </label>
                        <select
                          value={editForm.HasDiscount}
                          onChange={(e) => setEditForm({...editForm, HasDiscount: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                        >
                          <option value="false">No Discount</option>
                          <option value="true">Has Discount</option>
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Discount Price ($)</label>
                        <input
                          placeholder="Discount price"
                          value={editForm.DiscountPrice}
                          onChange={(e) => setEditForm({...editForm, DiscountPrice: e.target.value})}
                          type="number"
                          step="0.01"
                          min="0"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Subcategory ID</label>
                      <input
                        placeholder="Enter subcategory ID"
                        value={editForm.SubCategoryId}
                        onChange={(e) => setEditForm({...editForm, SubCategoryId: e.target.value})}
                        type="number"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Brand ID</label>
                      <input
                        placeholder="Enter brand ID"
                        value={editForm.BrandId}
                        onChange={(e) => setEditForm({...editForm, BrandId: e.target.value})}
                        type="number"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Color ID</label>
                      <input
                        placeholder="Enter color ID"
                        value={editForm.ColorId}
                        onChange={(e) => setEditForm({...editForm, ColorId: e.target.value})}
                        type="number"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-4 mt-8 pt-6 border-t">
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditModalOpen(false)
                      setSelectedProduct(null)
                      setEditForm({
                        Id: '',
                        BrandId: '',
                        ColorId: '',
                        ProductName: '',
                        Description: '',
                        Quantity: '',
                        Code: '',
                        Price: '',
                        HasDiscount: 'false',
                        DiscountPrice: '',
                        SubCategoryId: ''
                      })
                    }}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                  >
                    <Edit2 size={20} />
                    Update Product
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Products