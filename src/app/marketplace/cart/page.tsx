"use client";

import { useEffect, useState } from 'react';
import { backendService } from '@/lib/backend-service';
import { Button } from '@/components/ui/Button';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function CartPage() {
    const [cart, setCart] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isCartLoaded, setIsCartLoaded] = useState(false);
    const [processingCheckout, setProcessingCheckout] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const storedCart = localStorage.getItem('petMarketplaceCart');
        if (storedCart) {
            try {
                setCart(JSON.parse(storedCart));
            } catch (error) {
                console.error("Failed to parse cart", error);
            }
        }
        setLoading(false);
        setIsCartLoaded(true);
    }, []);

    useEffect(() => {
        if (isCartLoaded) {
            localStorage.setItem('petMarketplaceCart', JSON.stringify(cart));
        }
    }, [cart, isCartLoaded]);

    const addToCart = (product: any) => {
        setCart([...cart, product]);
    };

    const removeOneInstance = (productId: number) => {
        const index = cart.findIndex(item => item.id === productId);
        if (index !== -1) {
            const newCart = [...cart];
            newCart.splice(index, 1);
            setCart(newCart);
        }
    };

    const removeLine = (productId: number) => {
        setCart(cart.filter(item => item.id !== productId));
    };

    const groupedItems = cart.reduce((acc: any[], item: any) => {
        const existing = acc.find((i: any) => i.id === item.id);
        if (existing) {
            existing.quantity += 1;
        } else {
            acc.push({ ...item, quantity: 1 });
        }
        return acc;
    }, []);

    const subtotal = cart.reduce((total, item) => total + item.price, 0);
    const shipping = 0; // Free shipping logic for now
    const tax = 0; // Tax logic
    const total = subtotal + shipping + tax;

    const handleCheckout = async () => {
        if (cart.length === 0) return;
        setProcessingCheckout(true);

        try {
            const itemsToPurchase = groupedItems.map((item: any) => ({
                id: item.id,
                quantity: item.quantity
            }));

            await backendService.purchaseProducts(itemsToPurchase);

            alert('Thank you for your purchase!');
            setCart([]);
            localStorage.removeItem('petMarketplaceCart');
            router.push('/marketplace');
        } catch (error: any) {
            console.error('Checkout error:', error);
            alert(error.message || 'Checkout failed. Some items may be out of stock.');
        } finally {
            setProcessingCheckout(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-[1200px] mx-auto">
                <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Your Shopping Cart</h1>

                {cart.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
                        <div className="w-32 h-32 mb-6 mx-auto">
                            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-gray-200">
                                <path d="M4.15989 5.86982C3.80989 3.86982 5.37989 2.13982 7.40989 2.13982H16.5999C18.6299 2.13982 20.1999 3.86982 19.8499 5.86982L18.4999 13.5498C18.2799 15.0198 17.0099 16.0998 15.5199 16.0998H8.48989C6.98989 16.0998 5.71989 15.0198 5.49989 13.5498L4.15989 5.86982Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M16 16.1L16.89 19.68C17.06 20.35 16.55 21 15.86 21H8.13999C7.44999 21 6.93999 20.35 7.10999 19.68L8 16.1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M9 7H15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                        <h2 className="text-xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
                        <p className="text-gray-500 mb-8 text-sm">Looks like you haven't added anything yet.</p>
                        <Link href="/marketplace">
                            <Button className="px-8 py-3 rounded-full bg-slate-900 text-white hover:bg-slate-800">
                                Browse Products
                            </Button>
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                        {/* Left Column: Cart Items (70% rough equivalent) */}
                        <div className="lg:col-span-8 space-y-6">
                            {/* Header Row (Desktop) */}
                            <div className="hidden md:grid grid-cols-12 text-sm font-medium text-gray-500 pb-2 border-b border-gray-200 px-4">
                                <div className="col-span-6">Product</div>
                                <div className="col-span-2 text-center">Price</div>
                                <div className="col-span-2 text-center">Quantity</div>
                                <div className="col-span-2 text-right">Total</div>
                            </div>

                            <div className="space-y-4">
                                {groupedItems.map((item: any) => (
                                    <div
                                        key={item.id}
                                        className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col md:grid md:grid-cols-12 md:items-center gap-6 transition-shadow hover:shadow-md"
                                    >
                                        {/* Product Image & Name */}
                                        <div className="col-span-6 flex items-start gap-4">
                                            <div
                                                className="w-16 h-16 bg-gray-100 rounded-lg bg-cover bg-center flex-shrink-0 border border-gray-200"
                                                style={{ backgroundImage: `url(${item.image})` }}
                                            />
                                            <div className="flex flex-col justify-between h-24 py-1">
                                                <div>
                                                    <h3 className="text-lg font-bold text-gray-900 leading-tight mb-1">{item.name}</h3>
                                                    <p className="text-sm text-gray-500">ID: {item.id}</p>
                                                </div>
                                                <button
                                                    onClick={() => removeLine(item.id)}
                                                    className="text-red-500 hover:text-red-700 text-sm font-medium flex items-center gap-1 self-start group transition-colors"
                                                >
                                                    <svg className="w-4 h-4 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                    Remove
                                                </button>
                                            </div>
                                        </div>

                                        {/* Unit Price */}
                                        <div className="col-span-2 text-center hidden md:block">
                                            <span className="text-gray-900 font-medium">₹{item.price.toLocaleString('en-IN')}</span>
                                        </div>

                                        {/* Quantity Stepper */}
                                        <div className="col-span-2 flex justify-center">
                                            <div className="flex items-center bg-gray-50 rounded-lg p-1 border border-gray-200">
                                                <button
                                                    onClick={() => removeOneInstance(item.id)}
                                                    disabled={item.quantity <= 1}
                                                    className="w-8 h-8 flex items-center justify-center rounded-md bg-white text-gray-600 shadow-sm hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                                >
                                                    -
                                                </button>
                                                <span className="w-10 text-center font-semibold text-gray-900">{item.quantity}</span>
                                                <button
                                                    onClick={() => addToCart(item)}
                                                    className="w-8 h-8 flex items-center justify-center rounded-md bg-white text-gray-600 shadow-sm hover:bg-gray-100 transition-all"
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </div>

                                        {/* Subtotal */}
                                        <div className="col-span-2 text-right md:text-right flex justify-between md:block items-center border-t md:border-t-0 border-gray-100 pt-4 md:pt-0 mt-4 md:mt-0">
                                            <span className="md:hidden text-gray-500 font-medium">Subtotal</span>
                                            <span className="text-lg font-bold text-gray-900">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Right Column: Order Summary (30% rough equivalent) */}
                        <div className="lg:col-span-4">
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-8">
                                <h2 className="text-lg font-bold text-gray-900 mb-6">Order Summary</h2>

                                <div className="space-y-4 mb-6">
                                    <div className="flex justify-between text-gray-600">
                                        <span>Subtotal</span>
                                        <span className="font-medium text-gray-900">₹{subtotal.toLocaleString('en-IN')}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-600">
                                        <span>Delivery</span>
                                        <span className="text-green-600 font-medium">Free</span>
                                    </div>
                                    <div className="flex justify-between text-gray-600">
                                        <span>Tax</span>
                                        <span className="font-medium text-gray-900">₹0</span>
                                    </div>
                                    <div className="h-px bg-gray-200 my-4"></div>
                                    <div className="flex justify-between items-end">
                                        <span className="text-base font-bold text-gray-900">Total</span>
                                        <span className="text-2xl font-extrabold text-gray-900">₹{total.toLocaleString('en-IN')}</span>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <Button
                                        onClick={handleCheckout}
                                        loading={processingCheckout}
                                        className="w-full bg-slate-900 hover:bg-slate-800 text-white rounded-lg py-3 h-auto text-base"
                                        fullWidth
                                    >
                                        Proceed to Checkout
                                    </Button>
                                    <Link href="/marketplace" className="block w-full">
                                        <Button
                                            variant="outline"
                                            className="w-full justify-center rounded-lg border-gray-300 text-gray-700 hover:bg-gray-50 py-3 h-auto"
                                            fullWidth
                                        >
                                            Continue Shopping
                                        </Button>
                                    </Link>
                                </div>

                                <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-400">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                    <span>Secure Checkout</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
