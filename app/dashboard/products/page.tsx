'use client'

import { useState, useEffect } from 'react'
import { Package, Plus, Trash2, Link as LinkIcon, AlertCircle } from 'lucide-react'

interface Product {
    id: string
    name: string
    description: string
    link: string
    created_at: string
}

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)
    const [isAdding, setIsAdding] = useState(false)
    const [newProduct, setNewProduct] = useState({ name: '', description: '', link: '' })
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        fetchProducts()
    }, [])

    const fetchProducts = async () => {
        try {
            const res = await fetch('/api/products')
            if (res.ok) {
                const data = await res.json()
                setProducts(data)
            }
        } catch (error) {
            console.error('Failed to fetch products:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleAddProduct = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        setSaving(true)

        try {
            const res = await fetch('/api/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newProduct)
            })

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.error || 'Failed to check profile code')
            }

            setProducts([data, ...products])
            setNewProduct({ name: '', description: '', link: '' })
            setIsAdding(false)
        } catch (err: any) {
            setError(err.message)
        } finally {
            setSaving(false)
        }
    }

    const handleDeleteProduct = async (id: string, name: string) => {
        if (!confirm(`Are you sure you want to delete ${name}?`)) return

        try {
            const res = await fetch(`/api/products/${id}`, {
                method: 'DELETE',
            })

            if (res.ok) {
                setProducts(products.filter(p => p.id !== id))
            }
        } catch (error) {
            console.error('Failed to delete product', error)
        }
    }

    return (
        <div className="p-8 max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center border border-indigo-500/20 ring-1 ring-indigo-500/10 shadow-lg shadow-indigo-500/10">
                        <Package className="w-6 h-6 text-indigo-400" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-2">
                            My Products & Services
                        </h1>
                        <p className="text-slate-400 mt-1">Manage links to share with your leads easily.</p>
                    </div>
                </div>
                <button
                    onClick={() => setIsAdding(!isAdding)}
                    className="flex items-center justify-center gap-2 px-6 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl font-medium transition-all shadow-lg shadow-indigo-500/20 group active:scale-95"
                >
                    <Plus className={`w-5 h-5 transition-transform duration-300 ${isAdding ? 'rotate-45' : ''}`} />
                    {isAdding ? 'Cancel' : 'Add New'}
                </button>
            </div>

            {/* Add Note Area */}
            {isAdding && (
                <div className="bg-[#111827] border border-white/5 rounded-2xl p-6 shadow-xl relative overflow-hidden animate-in zoom-in-95 duration-200">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-500" />
                    <h2 className="text-lg font-semibold text-white mb-4">Add New Product / Service</h2>
                    
                    {error && (
                        <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                            <p className="text-sm text-red-200">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleAddProduct} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-1">Product Name</label>
                                <input
                                    type="text"
                                    required
                                    value={newProduct.name}
                                    onChange={e => setNewProduct({...newProduct, name: e.target.value})}
                                    className="w-full bg-[#1f2937] border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium placeholder:text-slate-500"
                                    placeholder="e.g. Premium Consulting"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-1">Link URL</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <LinkIcon className="h-4 w-4 text-slate-400" />
                                    </div>
                                    <input
                                        type="url"
                                        required
                                        value={newProduct.link}
                                        onChange={e => setNewProduct({...newProduct, link: e.target.value})}
                                        className="w-full bg-[#1f2937] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all placeholder:text-slate-500"
                                        placeholder="https://example.com/product"
                                    />
                                </div>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">Description (Optional)</label>
                            <textarea
                                value={newProduct.description}
                                onChange={e => setNewProduct({...newProduct, description: e.target.value})}
                                className="w-full bg-[#1f2937] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all resize-none placeholder:text-slate-500"
                                placeholder="Short description about this product..."
                                rows={2}
                            />
                        </div>
                        <div className="flex justify-end pt-2">
                            <button
                                type="submit"
                                disabled={saving}
                                className="px-6 py-2.5 bg-white text-black hover:bg-slate-200 rounded-xl font-medium transition-all shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                {saving ? 'Saving...' : 'Save Product'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* List */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                     {[1, 2, 3].map((i) => (
                        <div key={i} className="bg-[#111827] rounded-2xl h-48 animate-pulse border border-white/5" />
                    ))}
                </div>
            ) : products.length === 0 ? (
                <div className="text-center py-20 bg-[#111827]/50 rounded-3xl border border-white/5 backdrop-blur-sm">
                    <div className="w-20 h-20 bg-indigo-500/10 rounded-full flex items-center justify-center mx-auto mb-6 ring-1 ring-indigo-500/20">
                        <Package className="w-10 h-10 text-indigo-400 opacity-80" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">No products yet</h3>
                    <p className="text-slate-400 max-w-sm mx-auto mb-8 leading-relaxed">
                        Add your products or services here so you can easily share their links when chatting with leads.
                    </p>
                    <button
                        onClick={() => setIsAdding(true)}
                        className="px-6 py-2.5 bg-white/5 hover:bg-white/10 text-white rounded-xl font-medium transition-all border border-white/10 flex items-center gap-2 mx-auto"
                    >
                        <Plus className="w-5 h-5" />
                        Create First Product
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {products.map((product) => (
                        <div key={product.id} className="bg-[#111827] rounded-2xl p-6 border border-white/5 hover:border-indigo-500/30 transition-all group flex flex-col justify-between shadow-lg relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl -mr-10 -mt-10 transition-transform group-hover:scale-150" />
                            <div>
                                <div className="flex justify-between items-start mb-4 relative z-10">
                                    <h3 className="text-lg font-bold text-white leading-tight">{product.name}</h3>
                                    <button 
                                        onClick={() => handleDeleteProduct(product.id, product.name)}
                                        className="p-2 text-slate-500 hover:text-red-400 bg-white/5 hover:bg-red-400/10 rounded-lg transition-colors"
                                        title="Delete product"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                                {product.description && (
                                    <p className="text-sm text-slate-400 mb-6 line-clamp-2 leading-relaxed relative z-10">{product.description}</p>
                                )}
                            </div>
                            <div className="mt-auto relative z-10">
                                <a 
                                    href={product.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 text-sm text-indigo-400 bg-indigo-500/10 hover:bg-indigo-500/20 px-4 py-2.5 rounded-xl transition-colors border border-indigo-500/10 w-full justify-center group/btn"
                                >
                                    <LinkIcon className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                                    <span className="truncate">Visit Link</span>
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
