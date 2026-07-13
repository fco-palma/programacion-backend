import type { Product } from "../../data/shopData";
import type { StoreSettings } from "../../data/storeSettings";

interface CartPopoverProps {
  open: boolean;
  cartItems: { productId: number; qty: number }[];
  products: Product[];
  onClose: () => void;
  updateCartItemQty: (productId: number, qty: number) => void;
  removeCartItem: (productId: number) => void;
  onCheckout: () => void;
  storeSettings: StoreSettings;
}

export function CartPopover({
  open,
  cartItems,
  products,
  onClose,
  updateCartItemQty,
  removeCartItem,
  onCheckout,
  storeSettings,
}: CartPopoverProps) {
  if (!open) return null;

  const numericPrice = (value: string) => Number(value.replace(/[^0-9-]/g, "")) || 0;
  const currency = new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP", maximumFractionDigits: 0 });
  const subtotal = cartItems.reduce((sum, item) => {
    const product = products.find((candidate) => candidate.id === item.productId);
    return sum + (product ? numericPrice(product.price) * item.qty : 0);
  }, 0);
  const shippingCost = subtotal >= storeSettings.freeShippingMinimum ? 0 : storeSettings.standardShippingCost;

  return (
    <div
      className="
        fixed
        inset-x-3
        top-[7.5rem]
        z-[999]
        max-h-[calc(100dvh-8.5rem)]
        w-auto
        overflow-y-auto
        rounded-3xl
        border border-slate-200
        bg-white/95
        p-5
        shadow-2xl
        backdrop-blur-xl
        sm:absolute
        sm:inset-x-auto
        sm:right-0
        sm:top-14
        sm:max-h-[80vh]
        sm:w-[380px]
      "
    >
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-semibold text-foreground">Carrito</p>
        <button onClick={onClose} className="bg-transparent p-0 text-sm font-medium text-slate-500 shadow-none hover:text-slate-800">
          Cerrar
        </button>
      </div>
      {cartItems.length === 0 ? (
        <p className="text-sm text-slate-500">No hay artículos en el carrito.</p>
      ) : (
        <div className="space-y-5">
          {cartItems.map((item) => {
            const product = products.find((product) => product.id === item.productId);
            if (!product) return null;
            return (
              <div key={item.productId} className="flex items-center gap-4">
                <img src={product.image} alt={product.name} className="h-16 w-16 rounded-2xl object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="line-clamp-2 text-sm font-semibold text-slate-800">{product.name}</p>
                  <p className="text-sm text-slate-500">{product.price}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <button
                      onClick={() => updateCartItemQty(item.productId, item.qty - 1)}
                      className="h-8 w-8 rounded-full border border-slate-200 bg-white shadow-sm"
                    >
                      -
                    </button>
                    <span className="text-sm text-slate-700">{item.qty}</span>
                    <button
                      onClick={() => updateCartItemQty(item.productId, item.qty + 1)}
                      className="h-8 w-8 rounded-full border border-slate-200 bg-white shadow-sm"
                    >
                      +
                    </button>
                  </div>
                </div>
                <button onClick={() => removeCartItem(item.productId)} className="bg-transparent p-0 text-sm font-semibold text-red-500 shadow-none hover:text-red-600">
                  Eliminar
                </button>
              </div>
            );
          })}
        </div>
      )}
      {cartItems.length > 0 && (
        <div className="mt-4 border-t border-slate-200 pt-4">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-slate-500"><span>Subtotal</span><span>{currency.format(subtotal)}</span></div>
            <div className="flex justify-between text-slate-500"><span>Envío</span><span>{shippingCost === 0 ? "Gratis" : currency.format(shippingCost)}</span></div>
            <div className="flex justify-between font-semibold text-slate-900"><span>Total</span><span>{currency.format(subtotal + shippingCost)}</span></div>
          </div>
          <button
            onClick={onCheckout}
            className="mt-4 w-full rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
          >
            Pagar
          </button>
        </div>
      )}
    </div>
  );
}
