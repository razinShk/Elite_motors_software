
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Receipt, Download } from 'lucide-react';
import { SaleWithItems } from '@/hooks/useSalesData';
import { numberToWords } from '@/utils/numberToWords';

interface SalesInvoiceProps {
  sale: SaleWithItems;
}

export const SalesInvoice = ({ sale }: SalesInvoiceProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [theme, setTheme] = useState<'color' | 'bw'>('color');
  const [discountName, setDiscountName] = useState<string>('');
  const [discountType, setDiscountType] = useState<'percent' | 'amount'>('percent');
  const [discountValue, setDiscountValue] = useState<number>(0);

  const handlePrint = () => {
    window.print();
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <div className="flex gap-2">
        <Button variant="default" size="sm" onClick={() => { setTheme('color'); setIsOpen(true); }}>
          <Receipt className="h-4 w-4 mr-2" />
          Color Invoice
        </Button>
        <Button variant="outline" size="sm" onClick={() => { setTheme('bw'); setIsOpen(true); }}>
          <Receipt className="h-4 w-4 mr-2" />
          B/W Invoice
        </Button>
      </div>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Sales Invoice</DialogTitle>
        </DialogHeader>
        
        <div id="invoice-content" className={theme === 'color' ? 'space-y-6 p-6 bg-gradient-to-b from-gray-900 via-black to-gray-900 text-white' : 'space-y-6 p-6 bg-white text-gray-900'}>
          {/* Header */}
          <div className={theme === 'color' ? 'flex justify-between items-start border-b border-gray-700 pb-6' : 'flex justify-between items-start border-b pb-6'}>
            <div className="flex items-start gap-4">
              <img src="/images/@EliteLogo.png" alt="Elite Motor and Detailing" className="h-16 w-40 object-contain" />
              <div>
                <h1 className={theme === 'color' ? 'text-3xl font-bold text-white' : 'text-3xl font-bold text-gray-900'}>Elite Motor and Detailing</h1>
                <div className="mt-1 text-xs">
                  <p className={theme === 'color' ? 'text-gray-200 font-semibold tracking-wide' : 'text-gray-700 font-semibold tracking-wide'}>
                    CAR - BUY • SELL • EXCHANGE.  Car Detailing Interior • Exterior
                  </p>
                  <p className={theme === 'color' ? 'text-gray-300' : 'text-gray-600'}>
                    Car Ppf / Colour Ppf  • Car Wrap  • Customer Mods
                  </p>
                  <p className={theme === 'color' ? 'text-gray-300' : 'text-gray-600'}>
                    Ceramic Coating  • Premium Car Wash  • Performance upgrade
                  </p>
                </div>
                
              </div>
            </div>
            <div className="text-right">
              <h2 className={theme === 'color' ? 'text-2xl font-bold text-white' : 'text-2xl font-bold text-gray-900'}>INVOICE</h2>
              <p className={theme === 'color' ? 'text-gray-300' : 'text-gray-600'}>#{sale.invoice_number}</p>
              <p className={theme === 'color' ? 'text-sm text-gray-300' : 'text-sm text-gray-600'}>Date: {sale.sale_date}</p>
            </div>
          </div>

          {/* Customer Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Bill To:</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                <p className="font-semibold">{sale.customer_name}</p>
              </div>
            </CardContent>
          </Card>

          {/* Items (optional) */}
          <Card className={theme === 'color' ? 'bg-black/40 border-gray-700' : ''}>
            <CardHeader>
              <CardTitle className={theme === 'color' ? 'text-white' : ''}>Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className={theme === 'color' ? 'w-full text-white' : 'w-full'}>
                  <thead>
                    <tr className={theme === 'color' ? 'border-b border-gray-700' : 'border-b'}>
                      <th className="text-left py-2">Part Name</th>
                      <th className="text-left py-2">Part Number</th>
                      <th className="text-center py-2">Qty</th>
                      <th className="text-right py-2">Unit Price</th>
                      <th className="text-right py-2">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(sale.sale_items || []).length === 0 ? (
                      <tr>
                        <td colSpan={5} className={theme === 'color' ? 'py-4 text-center text-gray-400' : 'py-4 text-center text-gray-500'}>No items</td>
                      </tr>
                    ) : (
                      sale.sale_items.map((item, index) => (
                        <tr key={index} className={theme === 'color' ? 'border-b border-gray-800' : 'border-b'}>
                          <td className="py-2">{item.spare_parts.part_name}</td>
                          <td className={theme === 'color' ? 'py-2 text-sm text-gray-300' : 'py-2 text-sm text-gray-600'}>{item.spare_parts.part_number}</td>
                          <td className="py-2 text-center">{item.quantity}</td>
                          <td className="py-2 text-right">₹{Number(item.unit_price).toFixed(2)}</td>
                          <td className="py-2 text-right font-medium">₹{Number(item.subtotal).toFixed(2)}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Discount & Total */}
          <Card className={theme === 'color' ? 'bg-black/40 border-gray-700' : ''}>
            <CardContent className="pt-6">
              <div className="space-y-2">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <input
                    className={theme === 'color' ? 'border border-gray-700 bg-black/30 text-white rounded px-2 py-1 placeholder-gray-400' : 'border rounded px-2 py-1'}
                    placeholder="Discount name (optional)"
                    value={discountName}
                    onChange={(e) => setDiscountName(e.target.value)}
                  />
                  <select
                    className={theme === 'color' ? 'border border-gray-700 bg-black/30 text-white rounded px-2 py-1' : 'border rounded px-2 py-1'}
                    value={discountType}
                    onChange={(e) => setDiscountType(e.target.value as 'percent' | 'amount')}
                  >
                    <option value="percent">Percent %</option>
                    <option value="amount">Flat Amount</option>
                  </select>
                  <input
                    className={theme === 'color' ? 'border border-gray-700 bg-black/30 text-white rounded px-2 py-1' : 'border rounded px-2 py-1'}
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder={discountType === 'percent' ? 'Percent %' : 'Amount'}
                    value={discountValue}
                    onChange={(e) => setDiscountValue(Number(e.target.value))}
                  />
                </div>
                {(discountValue || 0) > 0 && (
                  <div className="flex justify-between">
                    <span>
                      Discount{discountName ? ` - ${discountName}` : ''} ({discountType === 'percent' ? `${discountValue}%` : `₹${discountValue}`}):
                    </span>
                    <span>-₹{(discountType === 'percent' ? (Number(sale.total_amount) * (discountValue || 0)) / 100 : (discountValue || 0)).toFixed(2)}</span>
                  </div>
                )}
                <div className={theme === 'color' ? 'flex justify-between text-xl font-bold border-t border-gray-700 pt-2 text-white' : 'flex justify-between text-xl font-bold border-t pt-2'}>
                  <span>Grand Total:</span>
                  <span>
                    ₹{(
                      Math.max(
                        0,
                        Number(sale.total_amount) - (discountType === 'percent' ? (Number(sale.total_amount) * (discountValue || 0)) / 100 : (discountValue || 0))
                      )
                    ).toFixed(2)}
                  </span>
                </div>
                <div className={theme === 'color' ? 'text-sm text-gray-300 italic border-t border-gray-700 pt-2' : 'text-sm text-gray-600 italic border-t pt-2'}>
                  <p><strong>Amount in Words:</strong> {numberToWords(
                    Math.max(
                      0,
                      Number(sale.total_amount) - (discountType === 'percent' ? (Number(sale.total_amount) * (discountValue || 0)) / 100 : (discountValue || 0))
                    )
                  )}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Footer */}
          <div className={theme === 'color' ? 'text-center text-sm text-gray-300 border-t border-gray-700 pt-6' : 'text-center text-sm text-gray-600 border-t pt-6'}>
            <p>Thank you for choosing Elite Motor and Detailing!</p>
            <p>Contact: 8888688448 • ELITEMOTORSANDDETAILING5588@gmail.com</p>
            <p>Address: Elite Motors & Detailing, Ashoka Marg, Near Ashoka School, Nashik- 422011</p>
          </div>
        </div>

        {/* Print Button */}
        <div className="flex justify-end space-x-2 mt-4">
          <Button onClick={handlePrint} className="flex items-center">
            <Download className="h-4 w-4 mr-2" />
            Print Invoice
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
