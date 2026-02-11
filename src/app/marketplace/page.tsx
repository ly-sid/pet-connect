"use client";

import { useEffect, useState } from 'react';
import { backendService } from '@/lib/backend-service';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

interface Product {
    id: number;
    name: string;
    price: number;
    image: string;
}

export default function MarketplacePage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [cart, setCart] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [showCart, setShowCart] = useState(false);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const data = await backendService.getProducts();
                setProducts(data);
            } catch (error) {
                console.error('Failed to fetch products:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const addToCart = (product: Product) => {
        setCart([...cart, product]);
        alert(`${product.name} added to cart!`);
    };

    const removeFromCart = (indexToRemove: number) => {
        setCart(cart.filter((_, index) => index !== indexToRemove));
    };

    const cartTotal = cart.reduce((total, item) => total + item.price, 0);
    const [processingCheckout, setProcessingCheckout] = useState(false);

    const handleCheckout = async () => {
        // Immediate Feedback
        try {
            // Trigger deletion in background but don't await blocking UI
            // However, alert blocks execution, so we start it first if possible
            const deletionPromise = Promise.all(cart.map(item => backendService.deleteProduct(item.id)))
                .then(() => backendService.getProducts())
                .then(data => setProducts(data))
                .catch(err => console.error("Background deletion failed", err));

            alert('Thankyou for the purchasing');
            setCart([]);
            setShowCart(false);

            // Ensure background process completes eventually
            await deletionPromise;
        } catch (error) {
            console.error('Checkout error:', error);
        } finally {
            setProcessingCheckout(false);
        }
    };

    return (
        <div className="container py-12 relative">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 800 }}>Pet Marketplace</h1>
                    <p className="text-subtle">Essentials for your furry friends. Proceeds support our shelter.</p>
                </div>
                <Button variant={showCart ? "primary" : "outline"} onClick={() => setShowCart(!showCart)}>
                    View Cart ({cart.length})
                </Button>
            </div>

            {/* Cart Overlay */}
            {showCart && (
                <div className="mb-8 bg-white border border-gray-200 rounded-xl p-6 shadow-lg animate-in fade-in slide-in-from-top-4">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold">Your Cart</h2>
                        <Button variant="ghost" size="sm" onClick={() => setShowCart(false)}>Close</Button>
                    </div>
                    {cart.length === 0 ? (
                        <p className="text-subtle text-center py-4">Your cart is empty.</p>
                    ) : (
                        <div className="flex flex-col gap-4">
                            {cart.map((item, index) => (
                                <div key={index} className="flex justify-between items-center border-b border-gray-100 pb-2">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-gray-100 rounded-md bg-cover bg-center" style={{ backgroundImage: `url(${item.image})` }} />
                                        <div>
                                            <p className="font-medium">{item.name}</p>
                                            <p className="text-sm text-subtle">₹{item.price}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => removeFromCart(index)}
                                        className="text-red-500 text-sm hover:underline"
                                    >
                                        Remove
                                    </button>
                                </div>
                            ))}
                            <div className="flex justify-between items-center pt-4 font-bold text-lg">
                                <span>Total:</span>
                                <span>₹{cartTotal}</span>
                            </div>
                            <div className="flex justify-end mt-4">
                                <Button onClick={handleCheckout} loading={processingCheckout}>
                                    Proceed to Checkout
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {loading ? (
                <div className="text-center py-12 text-subtle">Loading marketplace...</div>
            ) : products.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <p className="text-subtle">No products available at the moment.</p>
                </div>
            ) : (
                <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '2rem' }}>
                    {products.map(product => (
                        <Card key={product.id} padding="none" interactive>
                            <div style={{ height: '200px', backgroundColor: '#f3f4f6', backgroundImage: `url(${product.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
                            <div className="p-4">
                                <h3 className="font-bold text-lg mb-1">{product.name}</h3>
                                <p className="text-secondary mb-4">₹{product.price}</p>
                                <Button fullWidth onClick={() => addToCart(product)}>Add to Cart</Button>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
