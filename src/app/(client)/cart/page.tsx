'use client';

import React, { useEffect, useState } from 'react';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/useAuth';
import { api } from '@/services/api';
import { Cart, CartItem } from '@/types/cart';

import { motion } from 'framer-motion';
import {
    AlertCircle,
    ArrowRight,
    Award,
    BookOpen,
    Cloud,
    Coffee,
    Compass,
    Crown,
    Flower2,
    Gem,
    Headphones,
    Heart,
    Loader2,
    Minus,
    Moon,
    Package,
    Plus,
    Shield,
    ShoppingCart,
    Sparkles,
    Sun,
    Trash2,
    TrendingUp,
    Truck,
    XCircle,
    Zap
} from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function CartPage() {
    const router = useRouter();
    const { user, isAuthenticated, isLoading: authLoading } = useAuth();

    const [loading, setLoading] = useState(true);
    const [cart, setCart] = useState<Cart | null>(null);
    const [updating, setUpdating] = useState<string | null>(null);
    const [promoCode, setPromoCode] = useState('');
    const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
    const [discount, setDiscount] = useState(0);
    const [selectedItems, setSelectedItems] = useState<string[]>([]);
    const [selectAll, setSelectAll] = useState(false);
    const [cartCount, setCartCount] = useState(0);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    // Track mouse position for parallax effect
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMousePosition({
                x: (e.clientX / window.innerWidth - 0.5) * 20,
                y: (e.clientY / window.innerHeight - 0.5) * 20
            });
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    // Floating icons array
    const floatingIcons = [
        ShoppingCart,
        BookOpen,
        Headphones,
        Sparkles,
        Crown,
        Zap,
        Award,
        Gem,
        Flower2,
        Sun,
        Moon,
        Cloud,
        Coffee,
        Compass,
        TrendingUp
    ];

    useEffect(() => {
        if (authLoading) return;

        if (!isAuthenticated) {
            router.push('/auth/login?redirect=/cart');

            return;
        }

        loadCart();
    }, [isAuthenticated, authLoading, router]);

    useEffect(() => {
        if (cart?.items) {
            if (selectedItems.length === cart.items.length) {
                setSelectAll(true);
            } else {
                setSelectAll(false);
            }
        }
    }, [selectedItems, cart]);

    const loadCart = async () => {
        try {
            setLoading(true);
            const response = await api.get('/cart');

            if (response.data?.success && response.data.data) {
                setCart(response.data.data);
                const totalItems = response.data.data.items.reduce(
                    (sum: number, item: CartItem) => sum + item.quantity,
                    0
                );
                setCartCount(totalItems);

                if (response.data.data.items) {
                    setSelectedItems(response.data.data.items.map((item: CartItem) => item.product._id));
                }
            } else {
                setCart(null);
                setCartCount(0);
            }
        } catch (error) {
            console.error('Savat yuklanmadi:', error);
            toast.error('Savat yuklanmadi');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateQuantity = async (productId: string, newQuantity: number) => {
        if (newQuantity < 1) return;

        const item = cart?.items.find((item) => item.product._id === productId);
        if (item && newQuantity > item.product.stock) {
            toast.error(`Omborda atigi ${item.product.stock} dona qolgan`);
            return;
        }

        // UI ni darhol yangilash (optimistic update)
        if (cart) {
            const updatedItems = cart.items.map((item) =>
                item.product._id === productId ? { ...item, quantity: newQuantity } : item
            );

            setCart({
                ...cart,
                items: updatedItems,
                totalPrice: updatedItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
            });

            const newTotalItems = updatedItems.reduce((sum, item) => sum + item.quantity, 0);
            setCartCount(newTotalItems);
        }

        try {
            setUpdating(productId);

            console.log(`📤 So'rov yuborilmoqda: PATCH /cart/update`, { productId, quantity: newQuantity });

            const response = await api.patch('/cart/update', {
                productId,
                quantity: newQuantity
            });

            console.log('✅ Server javobi:', response.data);

            if (response.data?.success) {
                // Serverdan kelgan ma'lumotlar bilan yangilash
                setCart(response.data.data);
                const totalItems = response.data.data.items.reduce((sum: number, item: any) => sum + item.quantity, 0);
                setCartCount(totalItems);
            }
        } catch (error: any) {
            console.error('❌ Xatolik:', error);

            if (error.response) {
                console.error('Server javobi:', error.response.data);
                console.error('Status kod:', error.response.status);

                if (error.response.status === 500) {
                    toast.error('Serverda xatolik yuz berdi. Backend loglarni tekshiring.');
                } else {
                    toast.error(error.response.data?.message || 'Xatolik yuz berdi');
                }
            } else if (error.request) {
                toast.error("Server bilan bog'lanishda xatolik");
            } else {
                toast.error('Xatolik yuz berdi');
            }

            // Xatolik bo'lsa, eski holatga qaytarish
            loadCart();
        } finally {
            setUpdating(null);
        }
    };

    const tryAlternativeEndpoints = async (productId: string, quantity: number) => {
        console.log("🔄 Alternativ endpointlar sinab ko'rilmoqda...");

        const alternatives = [
            { method: 'patch', url: '/cart/item', body: { productId, quantity } },
            { method: 'patch', url: `/cart/${productId}`, body: { quantity } },
            { method: 'post', url: '/cart/update', body: { productId, quantity } },
            { method: 'put', url: '/cart/update', body: { productId, quantity } }
        ];

        for (const alt of alternatives) {
            try {
                console.log(`Sinov: ${alt.method.toUpperCase()} ${alt.url}`);

                let response;
                if (alt.method === 'patch') {
                    response = await api.patch(alt.url, alt.body);
                } else if (alt.method === 'post') {
                    response = await api.post(alt.url, alt.body);
                } else if (alt.method === 'put') {
                    response = await api.put(alt.url, alt.body);
                }

                if (response && response.status === 200) {
                    console.log(`✅ Muvaffaqiyatli: ${alt.method.toUpperCase()} ${alt.url}`);
                    toast.success(`Alternativ endpoint ishladi: ${alt.url}`);
                    return;
                }
            } catch (err) {
                console.log(`❌ Xatolik: ${alt.method.toUpperCase()} ${alt.url}`);
            }
        }

        console.log('❌ Hech qanday alternativ endpoint ishlamadi');
    };

    // Backend endpointlarni tekshirish funksiyasi
    // Debug funksiyasini to'ldiramiz
    const testBackendEndpoints = async () => {
        try {
            console.log('🔍 Backend endpointlarni tekshirish...');
            console.log('📡 Backend URL:', process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1');

            const results = [];

            // 1. GET /cart - Savatni olish
            try {
                const getCartRes = await api.get('/cart');
                results.push({
                    endpoint: 'GET /cart',
                    status: getCartRes.status,
                    success: getCartRes.data?.success,
                    data: getCartRes.data
                });
                console.log('✅ GET /cart:', getCartRes.status);
            } catch (err: any) {
                results.push({
                    endpoint: 'GET /cart',
                    status: err.response?.status || 'Network Error',
                    error: err.message
                });
                console.error('❌ GET /cart:', err.response?.status || err.message);
            }

            // 2. PATCH /cart/update - Miqdorni yangilash
            try {
                // Avval savatda mahsulot borligini tekshirish
                if (cart?.items && cart.items.length > 0) {
                    const testProductId = cart.items[0].product._id;
                    const updateRes = await api.patch('/cart/update', {
                        productId: testProductId,
                        quantity: 2
                    });
                    results.push({
                        endpoint: 'PATCH /cart/update',
                        status: updateRes.status,
                        success: updateRes.data?.success,
                        data: updateRes.data
                    });
                    console.log('✅ PATCH /cart/update:', updateRes.status);
                } else {
                    console.log("⚠️ Savat bo'sh, PATCH test o'tkazib bo'lmadi");
                }
            } catch (err: any) {
                results.push({
                    endpoint: 'PATCH /cart/update',
                    status: err.response?.status || 'Network Error',
                    error: err.message,
                    responseData: err.response?.data
                });
                console.error('❌ PATCH /cart/update:', err.response?.status, err.response?.data);
            }

            // 3. POST /cart/add - Qo'shish
            try {
                // Test uchun mavjud product ID (sizning backenddagi haqiqiy ID bilan almashtiring)
                const testProductId = 'some-existing-product-id';
                const addRes = await api.post('/cart/add', {
                    productId: testProductId,
                    quantity: 1
                });
                results.push({
                    endpoint: 'POST /cart/add',
                    status: addRes.status,
                    success: addRes.data?.success
                });
                console.log('✅ POST /cart/add:', addRes.status);
            } catch (err: any) {
                results.push({
                    endpoint: 'POST /cart/add',
                    status: err.response?.status || 'Network Error',
                    error: err.message
                });
                console.error('❌ POST /cart/add:', err.response?.status);
            }

            // 4. DELETE /cart/remove/:productId - O'chirish
            try {
                if (cart?.items && cart.items.length > 0) {
                    const testProductId = cart.items[0].product._id;
                    const removeRes = await api.delete(`/cart/remove/${testProductId}`);
                    results.push({
                        endpoint: `DELETE /cart/remove/${testProductId}`,
                        status: removeRes.status,
                        success: removeRes.data?.success
                    });
                    console.log('✅ DELETE /cart/remove:', removeRes.status);
                }
            } catch (err: any) {
                results.push({
                    endpoint: 'DELETE /cart/remove/:id',
                    status: err.response?.status || 'Network Error',
                    error: err.message
                });
                console.error('❌ DELETE /cart/remove:', err.response?.status);
            }

            // 5. DELETE /cart/clear - Tozalash
            try {
                const clearRes = await api.delete('/cart/clear');
                results.push({
                    endpoint: 'DELETE /cart/clear',
                    status: clearRes.status,
                    success: clearRes.data?.success
                });
                console.log('✅ DELETE /cart/clear:', clearRes.status);
            } catch (err: any) {
                results.push({
                    endpoint: 'DELETE /cart/clear',
                    status: err.response?.status || 'Network Error',
                    error: err.message
                });
                console.error('❌ DELETE /cart/clear:', err.response?.status);
            }

            // Natijalarni ko'rsatish
            console.table(results);

            // Xulosa
            const working = results.filter((r) => r.status === 200 || r.status === 201);
            const failed = results.filter((r) => r.status !== 200 && r.status !== 201);

            toast.success(`${working.length} ta endpoint ishladi, ${failed.length} ta xatolik`);

            return results;
        } catch (error) {
            console.error('Test xatoligi:', error);
        }
    };

    const handleRemoveItem = async (productId: string) => {
        if (!confirm('Ushbu mahsulotni savatdan olib tashlashni tasdiqlaysizmi?')) return;

        try {
            setUpdating(productId);
            const response = await api.delete(`/cart/remove/${productId}`);

            if (response.data?.success) {
                setCart(response.data.data);
                setSelectedItems((prev) => prev.filter((id) => id !== productId));

                if (response.data.data?.items) {
                    const totalItems = response.data.data.items.reduce(
                        (sum: number, item: CartItem) => sum + item.quantity,
                        0
                    );
                    setCartCount(totalItems);
                } else {
                    setCartCount(0);
                }

                toast.success('Mahsulot savatdan olib tashlandi');
            }
        } catch (error: any) {
            console.error('Remove error:', error);
            toast.error(error.response?.data?.message || 'Xatolik yuz berdi');
        } finally {
            setUpdating(null);
        }
    };

    const handleClearCart = async () => {
        if (!cart?.items.length) return;

        if (!confirm('Savatni butunlay tozalashni tasdiqlaysizmi?')) return;

        try {
            const response = await api.delete('/cart/clear');

            if (response.data?.success) {
                setCart(null);
                setSelectedItems([]);
                setCartCount(0);
                toast.success('Savat tozalandi');
            }
        } catch (error: any) {
            console.error('Clear error:', error);
            toast.error(error.response?.data?.message || 'Xatolik yuz berdi');
        }
    };

    const handleApplyPromo = () => {
        if (!promoCode.trim()) {
            toast.error('Promokodni kiriting');
            return;
        }

        // Promokod logikasi (mock)
        if (promoCode.toUpperCase() === 'WELCOME10') {
            setDiscount(10);
            setAppliedPromo(promoCode);
            toast.success('Promokod qabul qilindi! 10% chegirma');
        } else if (promoCode.toUpperCase() === 'BOOK20') {
            setDiscount(20);
            setAppliedPromo(promoCode);
            toast.success('Promokod qabul qilindi! 20% chegirma');
        } else {
            toast.error("Noto'g'ri promokod");
        }

        setPromoCode('');
    };

    const handleRemovePromo = () => {
        setDiscount(0);
        setAppliedPromo(null);
    };

    const handleToggleSelect = (productId: string) => {
        setSelectedItems((prev) => {
            if (prev.includes(productId)) {
                return prev.filter((id) => id !== productId);
            } else {
                return [...prev, productId];
            }
        });
    };

    const handleToggleSelectAll = () => {
        if (selectAll) {
            setSelectedItems([]);
        } else {
            setSelectedItems(cart?.items.map((item) => item.product._id) || []);
        }
    };

    const getSelectedTotal = () => {
        if (!cart) return 0;

        return cart.items
            .filter((item) => selectedItems.includes(item.product._id))
            .reduce((sum, item) => sum + item.quantity * item.price, 0);
    };

    const getSelectedCount = () => {
        if (!cart) return 0;

        return cart.items
            .filter((item) => selectedItems.includes(item.product._id))
            .reduce((count, item) => count + item.quantity, 0);
    };

    const getDiscountedPrice = (price: number) => {
        if (discount > 0) {
            return price - (price * discount) / 100;
        }

        return price;
    };

    const getSelectedTotalWithDiscount = () => {
        const total = getSelectedTotal();

        return getDiscountedPrice(total);
    };

    const handleCheckout = () => {
        if (selectedItems.length === 0) {
            toast.error('Iltimos, kamida bitta mahsulot tanlang');

            return;
        }

        const selectedProducts = cart?.items
            .filter((item) => selectedItems.includes(item.product._id))
            .map((item) => ({
                productId: item.product._id,
                quantity: item.quantity,
                price: item.price
            }));

        localStorage.setItem('checkoutItems', JSON.stringify(selectedProducts));
        router.push('/checkout');
    };

    const getFormatIcon = (format?: string) => {
        switch (format) {
            case 'audio':
                return <Headphones size={14} className='text-[#FF8A00] dark:text-orange-400' />;
            case 'ebook':
                return <BookOpen size={14} className='text-[#005CB9] dark:text-blue-400' />;
            default:
                return <BookOpen size={14} className='text-gray-400 dark:text-gray-500' />;
        }
    };

    // Xavfsiz sarlavha olish funksiyasi
    const getProductTitle = (product: CartItem['product']): string => {
        if (!product) return "Noma'lum kitob";

        // title obyektini tekshirish
        if (product.title && typeof product.title === 'object') {
            return product.title.uz || product.title.ru || product.title.en || "Noma'lum kitob";
        }

        // Agar title string bo'lsa
        if (typeof product.title === 'string') {
            return product.title;
        }

        return "Noma'lum kitob";
    };

    if (authLoading || loading) {
        return (
            <div className='relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-b from-gray-50 to-white dark:from-slate-900 dark:to-slate-800'>
                {/* Animated Background Elements */}
                <div className='pointer-events-none absolute inset-0 overflow-hidden'>
                    {[...Array(15)].map((_, i) => {
                        const IconComponent = floatingIcons[i % floatingIcons.length];
                        const randomTop = Math.random() * 100;
                        const randomLeft = Math.random() * 100;
                        const randomFontSize = Math.random() * 40 + 20;

                        return (
                            <motion.div
                                key={i}
                                className='absolute text-[#00a0e3]/10 dark:text-[#ef7f1a]/10'
                                style={{
                                    top: `${randomTop}%`,
                                    left: `${randomLeft}%`,
                                    fontSize: `${randomFontSize}px`
                                }}
                                animate={{
                                    y: [0, -30, 30, 0],
                                    x: [0, 30, -30, 0],
                                    rotate: [0, 180, 360, 0],
                                    opacity: [0.1, 0.3, 0.2, 0.1]
                                }}
                                transition={{
                                    duration: Math.random() * 20 + 10,
                                    repeat: Infinity,
                                    delay: Math.random() * 5
                                }}>
                                <IconComponent />
                            </motion.div>
                        );
                    })}

                    <motion.div
                        animate={{
                            x: mousePosition.x * 2,
                            y: mousePosition.y * 2
                        }}
                        transition={{ type: 'spring', damping: 50 }}
                        className='absolute top-20 left-20 h-96 w-96 rounded-full bg-[#00a0e3]/5 blur-3xl'
                    />
                    <motion.div
                        animate={{
                            x: mousePosition.x * -2,
                            y: mousePosition.y * -2
                        }}
                        transition={{ type: 'spring', damping: 50 }}
                        className='absolute right-20 bottom-20 h-96 w-96 rounded-full bg-[#ef7f1a]/5 blur-3xl'
                    />

                    <div className='absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]' />
                </div>

                <div className='relative z-10 text-center'>
                    <div className='relative'>
                        <div className='mx-auto mb-4 h-16 w-16 animate-spin rounded-full border-4 border-[#005CB9]/20 border-t-[#005CB9] dark:border-blue-400/20 dark:border-t-blue-400' />
                        <ShoppingCart
                            className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform text-[#005CB9] dark:text-blue-400'
                            size={24}
                        />
                    </div>
                    <p className='animate-pulse text-gray-500 dark:text-gray-400'>Savat yuklanmoqda...</p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return null;
    }

    return (
        <div className='relative min-h-screen overflow-hidden bg-gradient-to-b from-gray-50 to-white py-8 dark:from-slate-900 dark:to-slate-800'>
            {/* Animated Background Elements */}
            <div className='pointer-events-none absolute inset-0 overflow-hidden'>
                {/* Floating Icons */}
                {[...Array(25)].map((_, i) => {
                    const IconComponent = floatingIcons[i % floatingIcons.length];
                    const randomTop = Math.random() * 100;
                    const randomLeft = Math.random() * 100;
                    const randomFontSize = Math.random() * 40 + 20;

                    return (
                        <motion.div
                            key={i}
                            className='absolute text-[#00a0e3]/10 dark:text-[#ef7f1a]/10'
                            style={{
                                top: `${randomTop}%`,
                                left: `${randomLeft}%`,
                                fontSize: `${randomFontSize}px`
                            }}
                            animate={{
                                y: [0, -30, 30, 0],
                                x: [0, 30, -30, 0],
                                rotate: [0, 180, 360, 0],
                                opacity: [0.1, 0.3, 0.2, 0.1]
                            }}
                            transition={{
                                duration: Math.random() * 20 + 10,
                                repeat: Infinity,
                                delay: Math.random() * 5
                            }}>
                            <IconComponent />
                        </motion.div>
                    );
                })}

                {/* Gradient Orbs with Parallax */}
                <motion.div
                    animate={{
                        x: mousePosition.x * 2,
                        y: mousePosition.y * 2
                    }}
                    transition={{ type: 'spring', damping: 50 }}
                    className='absolute top-20 left-20 h-96 w-96 rounded-full bg-[#00a0e3]/5 blur-3xl'
                />
                <motion.div
                    animate={{
                        x: mousePosition.x * -2,
                        y: mousePosition.y * -2
                    }}
                    transition={{ type: 'spring', damping: 50 }}
                    className='absolute right-20 bottom-20 h-96 w-96 rounded-full bg-[#ef7f1a]/5 blur-3xl'
                />

                {/* Grid Pattern */}
                <div className='absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]' />
            </div>
            <div className='relative z-10 container mx-auto max-w-7xl px-4'>
                {/* Debug panel - faqat developmentda ko'rsatish */}
                {process.env.NODE_ENV === 'development' && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className='mb-4 rounded-xl border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-800 dark:bg-yellow-900/20'>
                        <div className='mb-2 flex items-center gap-2'>
                            <AlertCircle size={16} className='text-yellow-600 dark:text-yellow-400' />
                            <span className='text-sm font-bold text-yellow-800 dark:text-yellow-300'>
                                {"Debug ma'lumot"}
                            </span>
                        </div>
                        <div className='space-y-1 text-xs text-yellow-700 dark:text-yellow-400'>
                            <p>Backend URL: {process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1'}</p>
                            <p>Savatdagi mahsulotlar: {cart?.items.length || 0}</p>
                            <p>Tanlangan mahsulotlar: {selectedItems.length}</p>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={testBackendEndpoints}
                                className='rounded bg-yellow-200 px-2 py-1 text-xs dark:bg-yellow-800'>
                                Endpointlarni tekshirish
                            </motion.button>
                        </div>
                    </motion.div>
                )}

                {/* Header with animation */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className='mb-8 flex items-center justify-between'>
                    <div className='flex items-center gap-3'>
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: 'spring' }}
                            className='rounded-2xl bg-gradient-to-r from-[#005CB9]/10 to-[#FF8A00]/10 p-3 dark:from-blue-600/20 dark:to-orange-600/20'>
                            <ShoppingCart size={28} className='text-[#005CB9] dark:text-blue-400' />
                        </motion.div>
                        <div>
                            <motion.h1
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.3 }}
                                className='text-2xl font-black md:text-3xl'>
                                <span className='text-[#005CB9] dark:text-blue-400'>Savat</span>
                            </motion.h1>
                            <motion.p
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.4 }}
                                className='mt-1 text-sm text-gray-500 dark:text-gray-400'>
                                {cartCount > 0 ? `${cartCount} ta mahsulot` : "Savat bo'sh"}
                            </motion.p>
                        </div>
                    </div>

                    {cart?.items && cart.items.length > 0 && (
                        <motion.div
                            initial={{ x: 20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}>
                            <Button
                                onClick={handleClearCart}
                                variant='outline'
                                className='border-red-200 text-red-500 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20'>
                                <Trash2 size={16} className='mr-2' />
                                Savatni tozalash
                            </Button>
                        </motion.div>
                    )}
                </motion.div>

                {cart?.items && cart.items.length > 0 ? (
                    <div className='grid grid-cols-1 gap-8 lg:grid-cols-3'>
                        {/* Cart Items */}
                        <div className='space-y-4 lg:col-span-2'>
                            {/* Select All with animation */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.6 }}
                                className='rounded-xl border border-gray-100 bg-white/80 p-4 shadow-lg backdrop-blur-sm dark:border-slate-700 dark:bg-slate-800/80'>
                                <div className='flex items-center gap-4'>
                                    <motion.input
                                        whileTap={{ scale: 0.9 }}
                                        type='checkbox'
                                        checked={selectAll}
                                        onChange={handleToggleSelectAll}
                                        className='h-4 w-4 rounded border-gray-300 bg-white text-[#005CB9] focus:ring-[#005CB9] dark:border-slate-600 dark:bg-slate-700 dark:text-blue-400 dark:focus:ring-blue-400'
                                    />
                                    <span className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                                        Hammasini tanlash ({cart.items.length} ta mahsulot)
                                    </span>
                                </div>
                            </motion.div>

                            {/* Cart Items List */}
                            {cart.items.map((item, index) => {
                                // Agar product mavjud bo'lmasa, render qilma
                                if (!item || !item.product) return null;

                                return (
                                    <motion.div
                                        key={item._id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.1 + 0.7 }}
                                        whileHover={{ scale: 1.01, x: 5 }}
                                        className='rounded-xl border border-gray-100 bg-white/80 p-4 shadow-lg backdrop-blur-sm transition-all hover:shadow-xl dark:border-slate-700 dark:bg-slate-800/80'>
                                        <div className='flex flex-col gap-4 sm:flex-row'>
                                            {/* Checkbox */}
                                            <div className='flex items-start pt-2'>
                                                <motion.input
                                                    whileTap={{ scale: 0.9 }}
                                                    type='checkbox'
                                                    checked={selectedItems.includes(item.product._id)}
                                                    onChange={() => handleToggleSelect(item.product._id)}
                                                    className='h-4 w-4 rounded border-gray-300 bg-white text-[#005CB9] focus:ring-[#005CB9] dark:border-slate-600 dark:bg-slate-700 dark:text-blue-400 dark:focus:ring-blue-400'
                                                />
                                            </div>

                                            {/* Product Image */}
                                            <Link
                                                href={`/book/${item.product.slug || item.product._id}`}
                                                className='flex-shrink-0'>
                                                <motion.div
                                                    whileHover={{ scale: 1.05 }}
                                                    className='relative h-32 w-24 overflow-hidden rounded-lg shadow-md'>
                                                    <Image
                                                        src={
                                                            item.product.images?.[0] ||
                                                            'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=1887'
                                                        }
                                                        alt={getProductTitle(item.product)}
                                                        fill
                                                        className='object-cover transition-transform duration-300 hover:scale-110'
                                                        onError={(e) => {
                                                            // Rasm yuklanmasa, placeholder ko'rsatish
                                                            const target = e.target as HTMLImageElement;
                                                            target.src =
                                                                'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=1887';
                                                        }}
                                                    />
                                                </motion.div>
                                            </Link>

                                            {/* Product Info */}
                                            <div className='flex-1'>
                                                <div className='flex flex-col justify-between gap-4 sm:flex-row sm:items-start'>
                                                    <div>
                                                        <Link
                                                            href={`/book/${item.product.slug || item.product._id}`}
                                                            className='text-lg font-bold text-gray-900 transition-colors hover:text-[#005CB9] dark:text-white dark:hover:text-blue-400'>
                                                            {getProductTitle(item.product)}
                                                        </Link>

                                                        {item.product.author?.name && (
                                                            <p className='mt-1 text-sm text-gray-500 dark:text-gray-400'>
                                                                {item.product.author.name}
                                                            </p>
                                                        )}

                                                        <div className='mt-2 flex items-center gap-2'>
                                                            <span className='text-sm font-bold text-[#005CB9] dark:text-blue-400'>
                                                                {item.price.toLocaleString()}
                                                                {" so'm "}
                                                            </span>

                                                            {/* Format Badge */}
                                                            {item.product.format && (
                                                                <div className='flex items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5 dark:bg-slate-700'>
                                                                    {getFormatIcon(item.product.format)}
                                                                    <span className='text-[10px] font-medium text-gray-600 dark:text-gray-400'>
                                                                        {item.product.format === 'audio'
                                                                            ? 'Audio'
                                                                            : item.product.format === 'ebook'
                                                                              ? 'E-kitob'
                                                                              : "Qog'oz"}
                                                                    </span>
                                                                </div>
                                                            )}
                                                        </div>

                                                        <p className='mt-1 text-xs text-gray-400 dark:text-gray-500'>
                                                            Omborda: {item.product.stock} dona
                                                        </p>
                                                    </div>

                                                    {/* Price and Actions */}
                                                    <div className='flex flex-col items-end gap-4'>
                                                        {/* Quantity Controls */}
                                                        <div className='flex items-center gap-2'>
                                                            <motion.button
                                                                whileHover={{ scale: 1.1 }}
                                                                whileTap={{ scale: 0.9 }}
                                                                onClick={() =>
                                                                    handleUpdateQuantity(
                                                                        item.product._id,
                                                                        item.quantity - 1
                                                                    )
                                                                }
                                                                disabled={
                                                                    updating === item.product._id || item.quantity <= 1
                                                                }
                                                                className='rounded-lg border border-gray-200 p-1.5 text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-600 dark:text-gray-300 dark:hover:bg-slate-700'>
                                                                <Minus size={14} />
                                                            </motion.button>

                                                            <motion.span
                                                                key={item.quantity}
                                                                initial={{ scale: 1.2 }}
                                                                animate={{ scale: 1 }}
                                                                className='w-10 text-center font-bold text-gray-900 dark:text-white'>
                                                                {updating === item.product._id ? (
                                                                    <Loader2
                                                                        size={14}
                                                                        className='mx-auto animate-spin text-blue-500 dark:text-blue-400'
                                                                    />
                                                                ) : (
                                                                    item.quantity
                                                                )}
                                                            </motion.span>

                                                            <motion.button
                                                                whileHover={{ scale: 1.1 }}
                                                                whileTap={{ scale: 0.9 }}
                                                                onClick={() =>
                                                                    handleUpdateQuantity(
                                                                        item.product._id,
                                                                        item.quantity + 1
                                                                    )
                                                                }
                                                                disabled={
                                                                    updating === item.product._id ||
                                                                    item.quantity >= item.product.stock
                                                                }
                                                                className='rounded-lg border border-gray-200 p-1.5 text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-600 dark:text-gray-300 dark:hover:bg-slate-700'>
                                                                <Plus size={14} />
                                                            </motion.button>
                                                        </div>

                                                        {/* Item Total */}
                                                        <div className='text-right'>
                                                            <p className='text-sm text-gray-400 dark:text-gray-500'>
                                                                Umumiy:
                                                            </p>
                                                            <motion.p
                                                                key={item.quantity * item.price}
                                                                initial={{ scale: 1.2 }}
                                                                animate={{ scale: 1 }}
                                                                className='text-lg font-black text-[#005CB9] dark:text-blue-400'>
                                                                {(item.quantity * item.price).toLocaleString()}
                                                                {" so'm "}
                                                            </motion.p>
                                                        </div>

                                                        {/* Remove Button */}
                                                        <motion.button
                                                            whileHover={{ scale: 1.1, color: '#ef4444' }}
                                                            whileTap={{ scale: 0.9 }}
                                                            onClick={() => handleRemoveItem(item.product._id)}
                                                            disabled={updating === item.product._id}
                                                            className='text-gray-400 transition-colors hover:text-red-500 disabled:opacity-50 dark:text-gray-500 dark:hover:text-red-400'>
                                                            <Trash2 size={18} />
                                                        </motion.button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>

                        {/* Order Summary */}
                        <div className='lg:col-span-1'>
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.8 }}
                                className='sticky top-24 rounded-xl border border-gray-100 bg-white/80 p-6 shadow-lg backdrop-blur-sm dark:border-slate-700 dark:bg-slate-800/80'>
                                <h2 className='mb-4 text-lg font-black text-gray-900 dark:text-white'>
                                    Buyurtma haqida
                                </h2>

                                {/* Promo Code */}
                                <motion.div
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.9 }}
                                    className='mb-6'>
                                    {appliedPromo ? (
                                        <motion.div
                                            initial={{ scale: 0.9 }}
                                            animate={{ scale: 1 }}
                                            className='flex items-center justify-between rounded-lg border border-green-200 bg-green-50 p-3 dark:border-green-800 dark:bg-green-900/20'>
                                            <div>
                                                <p className='text-xs text-green-600 dark:text-green-400'>
                                                    {"Promokod qo'llanildi"}
                                                </p>
                                                <p className='font-bold text-green-700 dark:text-green-400'>
                                                    {appliedPromo} ({discount}% chegirma)
                                                </p>
                                            </div>
                                            <motion.button
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                onClick={handleRemovePromo}
                                                className='rounded-full p-1 text-green-700 hover:bg-green-100 dark:text-green-400 dark:hover:bg-green-800'>
                                                <XCircle size={16} />
                                            </motion.button>
                                        </motion.div>
                                    ) : (
                                        <div className='flex gap-2'>
                                            <Input
                                                value={promoCode}
                                                onChange={(e) => setPromoCode(e.target.value)}
                                                placeholder='Promokod'
                                                className='flex-1 border-gray-200 bg-white text-gray-900 placeholder-gray-400 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:placeholder-gray-500'
                                            />
                                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                                <Button
                                                    onClick={handleApplyPromo}
                                                    className='bg-gradient-to-r from-[#005CB9] to-[#FF8A00] text-white hover:from-[#004a96] hover:to-[#e67a00] dark:from-blue-600 dark:to-orange-600'>
                                                    {" Qo'llash "}
                                                </Button>
                                            </motion.div>
                                        </div>
                                    )}
                                </motion.div>

                                {/* Summary Items */}
                                <motion.div
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 1.0 }}
                                    className='mb-6 space-y-3'>
                                    <div className='flex justify-between text-sm'>
                                        <span className='text-gray-500 dark:text-gray-400'>
                                            Tanlangan mahsulotlar ({getSelectedCount()} ta)
                                        </span>
                                        <motion.span
                                            key={getSelectedTotal()}
                                            initial={{ scale: 1.2 }}
                                            animate={{ scale: 1 }}
                                            className='font-bold text-gray-900 dark:text-white'>
                                            {getSelectedTotal().toLocaleString()}
                                            {" so'm "}
                                        </motion.span>
                                    </div>

                                    {discount > 0 && (
                                        <div className='flex justify-between text-sm'>
                                            <span className='text-gray-500 dark:text-gray-400'>
                                                Chegirma ({discount}%)
                                            </span>
                                            <motion.span
                                                key={(getSelectedTotal() * discount) / 100}
                                                initial={{ scale: 1.2 }}
                                                animate={{ scale: 1 }}
                                                className='font-bold text-green-600 dark:text-green-400'>
                                                -{((getSelectedTotal() * discount) / 100).toLocaleString()}
                                                {" so'm "}
                                            </motion.span>
                                        </div>
                                    )}

                                    <div className='flex justify-between text-sm'>
                                        <span className='text-gray-500 dark:text-gray-400'>Yetkazib berish</span>
                                        <span className='font-bold text-gray-900 dark:text-white'>Bepul</span>
                                    </div>

                                    <div className='my-3 border-t border-gray-100 dark:border-slate-700' />

                                    <div className='flex justify-between'>
                                        <span className='font-bold text-gray-900 dark:text-white'>Jami</span>
                                        <motion.span
                                            key={getSelectedTotalWithDiscount()}
                                            initial={{ scale: 1.2 }}
                                            animate={{ scale: 1 }}
                                            className='text-2xl font-black text-[#005CB9] dark:text-blue-400'>
                                            {getSelectedTotalWithDiscount().toLocaleString()}
                                            {" so'm "}
                                        </motion.span>
                                    </div>
                                </motion.div>

                                {/* Checkout Button */}
                                <motion.div
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 1.1 }}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}>
                                    <Button
                                        onClick={handleCheckout}
                                        disabled={selectedItems.length === 0}
                                        className='mb-4 w-full rounded-xl bg-gradient-to-r from-[#005CB9] to-[#FF8A00] py-6 text-lg font-bold text-white transition-all hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50 dark:from-blue-600 dark:to-orange-600 dark:hover:shadow-2xl dark:hover:shadow-blue-900/20'>
                                        <ArrowRight size={20} className='mr-2' />
                                        Buyurtma berish
                                    </Button>
                                </motion.div>

                                {/* Info Icons */}
                                <motion.div
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 1.2 }}
                                    className='grid grid-cols-3 gap-2 text-center text-xs'>
                                    {[
                                        { icon: Truck, text: 'Bepul yetkazish' },
                                        { icon: Shield, text: "Xavfsiz to'lov" },
                                        { icon: Package, text: 'Kafolat' }
                                    ].map((item, index) => (
                                        <motion.div key={index} whileHover={{ y: -5 }} className='p-2'>
                                            <item.icon
                                                size={16}
                                                className='mx-auto mb-1 text-gray-400 dark:text-gray-500'
                                            />
                                            <span className='text-gray-400 dark:text-gray-500'>{item.text}</span>
                                        </motion.div>
                                    ))}
                                </motion.div>
                            </motion.div>
                        </div>
                    </div>
                ) : (
                    // Empty Cart with animation
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3, type: 'spring' }}
                        className='rounded-2xl border border-gray-100 bg-white/80 p-12 text-center backdrop-blur-sm dark:border-slate-700 dark:bg-slate-800/80'>
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.5, type: 'spring' }}
                            className='mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-r from-[#005CB9]/10 to-[#FF8A00]/10 dark:from-blue-600/20 dark:to-orange-600/20'>
                            <ShoppingCart size={48} className='text-[#005CB9] dark:text-blue-400' />
                        </motion.div>
                        <motion.h2
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.6 }}
                            className='mb-3 text-2xl font-black text-gray-900 dark:text-white'>
                            {" Savat bo'sh "}
                        </motion.h2>
                        <motion.p
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.7 }}
                            className='mx-auto mb-8 max-w-md text-gray-500 dark:text-gray-400'>
                            {
                                " Savatingizda hali mahsulotlar yo'q. Katalogdan o'zingizga yoqqan kitoblarni toping va savatga qo'shing. "
                            }
                        </motion.p>
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.8 }}
                            className='flex flex-col justify-center gap-4 sm:flex-row'>
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Link
                                    href='/catalog'
                                    className='inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#005CB9] to-[#FF8A00] px-6 py-3 font-bold text-white transition-all hover:shadow-lg dark:from-blue-600 dark:to-orange-600 dark:hover:shadow-2xl dark:hover:shadow-blue-900/20'>
                                    <BookOpen size={18} />
                                    {" Katalogga o'tish "}
                                </Link>
                            </motion.div>
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Link
                                    href='/wishlist'
                                    className='inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-6 py-3 font-bold text-gray-600 transition-all hover:border-[#005CB9] hover:text-[#005CB9] dark:border-slate-700 dark:text-gray-400 dark:hover:border-blue-400 dark:hover:text-blue-400'>
                                    <Heart size={18} />
                                    Sevimlilar
                                </Link>
                            </motion.div>
                        </motion.div>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
