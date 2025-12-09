import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
	variantId: number;
	productId: number;
	productName: string;
	variantSku: string;
	sizeName: string;
	colorName: string;
	colorHex: string | null;
	quantity: number;
	price: number;
	stock: number;
	imageUrl: string | null;
}

interface CartState {
	cart: CartItem[];

	// Métodos
	addToCart: (item: CartItem) => void;
	updateQuantity: (variantId: number, quantity: number) => void;
	removeFromCart: (variantId: number) => void;
	clearCart: () => void;

	// Getters
	getTotalItems: () => number;
	getSubtotal: () => number;
	getTax: () => number;
	getTotal: () => number;
}

export const useCartStore = create<CartState>()(
	persist(
		(set, get) => ({
			cart: [],

			addToCart: (item: CartItem) => {
				const { cart } = get();
				const existingItem = cart.find((i) => i.variantId === item.variantId);

				if (existingItem) {
					// Si ya existe, aumentar cantidad (respetando el stock)
					set({
						cart: cart.map((i) =>
							i.variantId === item.variantId
								? { ...i, quantity: Math.min(i.quantity + item.quantity, i.stock) }
								: i
						),
					});
				} else {
					// Si no existe, agregarlo
					set({ cart: [...cart, item] });
				}
			},

			updateQuantity: (variantId: number, quantity: number) => {
				const { cart } = get();

				if (quantity <= 0) {
					// Si la cantidad es 0 o negativa, eliminar del carrito
					set({ cart: cart.filter((i) => i.variantId !== variantId) });
					return;
				}

				set({
					cart: cart.map((i) =>
						i.variantId === variantId
							? { ...i, quantity: Math.min(quantity, i.stock) }
							: i
					),
				});
			},

			removeFromCart: (variantId: number) => {
				set({ cart: get().cart.filter((i) => i.variantId !== variantId) });
			},

			clearCart: () => {
				set({ cart: [] });
			},

			getTotalItems: () => {
				return get().cart.reduce((total, item) => total + item.quantity, 0);
			},

			getSubtotal: () => {
				return get().cart.reduce((total, item) => total + item.price * item.quantity, 0);
			},

			getTax: () => {
				// 15% de impuesto (puedes ajustarlo)
				return get().getSubtotal() * 0.15;
			},

			getTotal: () => {
				return get().getSubtotal() + get().getTax();
			},
		}),
		{
			name: 'cart-storage',
		}
	)
);
