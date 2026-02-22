"use client";

import { useEffect, useState } from 'react';
import { backendService } from '@/lib/backend-service';
import { Button } from '@/components/ui/Button';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './cart.module.css';

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
    const tax = Math.round(subtotal * 0.02); // 2% tax logic
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
            <div className="container" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <p className="text-subtle">Loading cart...</p>
            </div>
        );
    }

    return (
        <div className="container" style={{ padding: '3rem 1.5rem', minHeight: '80vh' }}>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '2rem' }}>Your Shopping Cart</h1>

            {cart.length === 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '4rem 1rem', textAlign: 'center', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-lg)' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>Your cart is empty</h2>
                    <p className="text-subtle" style={{ marginBottom: '2rem' }}>Looks like you haven't added anything yet.</p>
                    <Link href="/marketplace">
                        <Button variant="primary">Browse Products</Button>
                    </Link>
                </div>
            ) : (
                <div className={styles.cartContainer}>
                    {/* Left Column: Cart Items */}
                    <div className={styles.leftColumn}>
                        {/* Header Row */}
                        <div className={styles.headerRow}>
                            <div className={styles.headerProduct}>Product</div>
                            <div className={styles.headerPrice}>Price</div>
                            <div className={styles.headerQuantity}>Quantity</div>
                            <div className={styles.headerTotal}>Total</div>
                        </div>

                        <div className={styles.itemList}>
                            {groupedItems.map((item: any) => (
                                <div key={item.id} className={styles.itemRow}>
                                    {/* Product Area */}
                                    <div className={styles.itemProductArea}>
                                        <div
                                            className={styles.itemImage}
                                            style={{ backgroundImage: `url(${item.image})` }}
                                        />
                                        <div className={styles.itemDetails}>
                                            <h3 className={styles.itemName}>{item.name}</h3>
                                            <p className={styles.itemId}>(ID: {item.id})</p>
                                            <button
                                                onClick={() => removeLine(item.id)}
                                                className={styles.removeBtn}
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </div>

                                    {/* Unit Price */}
                                    <div className={styles.itemPriceArea}>
                                        ₹{item.price.toLocaleString('en-IN')}
                                    </div>

                                    {/* Quantity Stepper */}
                                    <div className={styles.itemQuantityArea}>
                                        <div className={styles.quantityStepper}>
                                            <button
                                                onClick={() => removeOneInstance(item.id)}
                                                disabled={item.quantity <= 1}
                                                className={styles.stepperBtn}
                                                aria-label="Decrease quantity"
                                            >
                                                -
                                            </button>
                                            <span className={styles.stepperValue}>{item.quantity}</span>
                                            <button
                                                onClick={() => addToCart(item)}
                                                className={styles.stepperBtn}
                                                aria-label="Increase quantity"
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>

                                    {/* Subtotal */}
                                    <div className={styles.itemTotalArea}>
                                        ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Continue Shopping Button */}
                        <div className={styles.continueShoppingWrapper}>
                            <Link href="/marketplace">
                                <button className={styles.continueShoppingBtn}>
                                    Continue Shopping
                                </button>
                            </Link>
                        </div>
                    </div>

                    {/* Right Column: Order Summary */}
                    <div className={styles.rightColumn}>
                        <div className={styles.summaryCard}>
                            <h2 className={styles.summaryTitle}>Order Summary</h2>

                            <div className={styles.summaryRows}>
                                <div className={styles.summaryRow}>
                                    <span>Subtotal</span>
                                    <span className={styles.summaryValue}>₹{subtotal.toLocaleString('en-IN')}</span>
                                </div>
                                <div className={styles.summaryRow}>
                                    <span>Delivery</span>
                                    <span className={styles.summaryValue}>Free</span>
                                </div>
                                <div className={styles.summaryRow}>
                                    <span>Tax (2%)</span>
                                    <span className={styles.summaryValue}>₹{tax.toLocaleString('en-IN')}</span>
                                </div>
                            </div>

                            <div className={styles.summaryTotalRow}>
                                <span>Total</span>
                                <span>₹{total.toLocaleString('en-IN')}</span>
                            </div>

                            <button
                                onClick={handleCheckout}
                                disabled={processingCheckout}
                                className={styles.checkoutBtn}
                            >
                                {processingCheckout ? 'Processing...' : 'Proceed to Checkout'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
