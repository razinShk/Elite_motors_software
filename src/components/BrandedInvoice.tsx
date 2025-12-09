import React from 'react';
import { Phone, Mail, Instagram, MapPin } from 'lucide-react';

interface LineItem {
  name: string;
  description?: string;
  quantity: number;
  price: number;
}

interface BrandedInvoiceProps {
  logoSrc: string;
  invoiceNumber: string;
  date: string;
  customerName: string;
  customerContact?: string;
  contact: {
    phone: string;
    email: string;
    instagram: string;
    address: string;
  };
  items: LineItem[];
  taxPercent?: number; // e.g., 18 for 18%
  discountAmount?: number;
  theme?: 'color' | 'bw';
}

const currency = (n: number) => `₹${n.toFixed(2)}`;

export const BrandedInvoice: React.FC<BrandedInvoiceProps> = ({
  logoSrc,
  invoiceNumber,
  date,
  customerName,
  customerContact,
  contact,
  items,
  taxPercent = 0,
  discountAmount = 0,
  theme = 'color',
}) => {
  const subtotal = items.reduce((sum, it) => sum + it.quantity * it.price, 0);
  const tax = (subtotal * taxPercent) / 100;
  const total = Math.max(0, subtotal + tax - discountAmount);

  return (
    <div
      id="invoice-content"
      className={theme === 'color' ? 'bg-white' : 'bg-white'}
      style={{ width: '210mm', minHeight: '297mm', margin: '0 auto' }}
    >
      {/* Top Header Banner with slants and red strip */}
      <div className="relative w-full" style={{ height: '128px' }}>
        {/* Left black section with slanted right edge */}
        <div
          className="absolute left-0 top-0 h-full flex items-center pl-6"
          style={{
            width: '40%',
            backgroundColor: '#0B0B0B',
            clipPath: 'polygon(0% 0%, 100% 0%, 80% 100%, 0% 100%)',
          }}
        >
          <img src={logoSrc} alt="Elite Car Wash Logo" className="h-20 object-contain" />
        </div>

        {/* Red top bar across the header, above contact details */}
        <div
          className="absolute"
          style={{
            left: 320,
            top: 0,
            width: '57%',
            height: '28px',
            backgroundColor: '#E31837',
            clipPath: 'polygon(3.5% 0, 100% 0, 100% 100%, 0 100%)',
            zIndex: 1,
          }}
        />

        {/* Right details section (white) */}
        <div className="absolute right-0 top-2 h-full flex-1 w-[60%] bg-white flex flex-col justify-center pr-6" style={{ paddingTop: '32px' }}>
          <div className="space-y-1 text-right relative" style={{ zIndex: 2 }}>
            <p className="text-sm font-semibold text-black inline-flex items-center justify-end gap-2 w-full">
              <Phone className="inline-block h-4 w-4" /> {contact.phone}
            </p>
            <p className="text-sm text-gray-700 inline-flex items-center justify-end gap-2 w-full">
              <Mail className="inline-block h-4 w-4" /> {contact.email}
            </p>
            <p className="text-sm text-gray-700 inline-flex items-center justify-end gap-2 w-full">
              <Instagram className="inline-block h-4 w-4" /> {contact.instagram}
            </p>
            <p className="text-sm text-gray-700 inline-flex items-center justify-end gap-2 w-full">
              <MapPin className="inline-block h-4 w-4" /> {contact.address}
            </p>
          </div>
        </div>
      </div>

      {/* Header Meta */}
      <div className="flex justify-between items-start border-b px-6 pb-3">
        <div>
          <h1 className="text-xl font-bold" style={{ color: '#0B0B0B' }}>Service Invoice</h1>
          <p className="text-xs text-gray-600 mt-1">CAR - BUY • SELL • EXCHANGE • Detailing Interior/Exterior • Ceramic Coating </p> <p className="text-xs text-gray-600 mt-1">• Premium Car Wash • Performance upgrade • PPF/Wrap • Custom Mods</p>
        </div>
        <div className="text-right relative top-4">
          <div className="text-sm font-bold" style={{ color: '#0B0B0B' }}>INVOICE</div>
          <div className="text-xs text-gray-700">#{invoiceNumber}</div>
          <div className="text-xs text-gray-700">Date: {date}</div>
        </div>
      </div>

      {/* Customer */}
      <div className="grid grid-cols-2 gap-6 px-6 py-4">
        <div>
          <div className="font-semibold text-sm" style={{ color: '#0B0B0B' }}>Bill To:</div>
          <div className="text-sm">{customerName}</div>
          {customerContact && <div className="text-sm text-gray-600">{customerContact}</div>}
        </div>
        <div />
      </div>

      {/* Items Table */}
      <div className="px-6">
        <table className="w-full text-sm border" style={{ borderColor: '#E5E7EB' }}>
          <thead style={{ backgroundColor: '#0B0B0B', color: 'white' }}>
            <tr>
              <th className="text-left p-2">Service Name</th>
              <th className="text-left p-2">Description</th>
              <th className="text-center p-2">Qty</th>
              <th className="text-right p-2">Price</th>
              <th className="text-right p-2">Total</th>
            </tr>
          </thead>
          <tbody>
            {items.map((it, idx) => (
              <tr key={idx} className="border-b" style={{ borderColor: '#E5E7EB' }}>
                <td className="p-2">{it.name}</td>
                <td className="p-2 text-gray-600">{it.description || '-'}</td>
                <td className="p-2 text-center">{it.quantity}</td>
                <td className="p-2 text-right">{currency(it.price)}</td>
                <td className="p-2 text-right">{currency(it.quantity * it.price)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totals */}
        <div className="w-full flex justify-end mt-4">
          <div className="w-full md:w-1/2 lg:w-1/3">
            <div className="flex justify-between py-1">
              <span className="text-sm">Subtotal</span>
              <span className="text-sm">{currency(subtotal)}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-sm">Tax ({taxPercent}%)</span>
              <span className="text-sm">{currency(tax)}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-sm">Discount</span>
              <span className="text-sm">- {currency(discountAmount)}</span>
            </div>
            <div className="flex justify-between border-t mt-2 pt-2" style={{ borderColor: '#E5E7EB' }}>
              <span className="font-bold">Final Amount</span>
              <span className="font-bold">{currency(total)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer stripe */}
      <div className="mt-16 relative" style={{ height: '60px' }}>
        <div className="absolute inset-x-0 bottom-0 h-4" style={{ backgroundColor: '#E31837' }} />
        <div className="absolute inset-x-0 bottom-4 h-3" style={{ backgroundColor: '#D1D5DB' }} />
        <div className="absolute right-0 bottom-0 h-6 w-1/3" style={{ backgroundColor: '#0B0B0B', clipPath: 'polygon(6% 0, 100% 0, 100% 100%, 0 100%)' }} />
        <div className="absolute left-0 bottom-8 w-full text-center text-xs text-gray-700">
          Thank you for choosing Elite Car Wash & Detailing!
        </div>
      </div>
    </div>
  );
};

export default BrandedInvoice;


