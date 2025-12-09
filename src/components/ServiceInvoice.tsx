import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Receipt, Download, Printer } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { ServiceWithDetails } from '@/hooks/useServicesData';
import { numberToWords } from '@/utils/numberToWords';
import { BrandedInvoice } from '@/components/BrandedInvoice';

interface ServiceInvoiceProps {
  service: ServiceWithDetails;
}

export const ServiceInvoice = ({ service }: ServiceInvoiceProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [theme, setTheme] = useState<'color' | 'bw'>('color');

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPdf = async () => {
    // Ensure invoice is rendered before capture
    if (!isOpen) {
      setTheme('color');
      setIsOpen(true);
      await new Promise((r) => setTimeout(r, 300));
    }

    const invoiceElement = document.getElementById('invoice-content');
    if (!invoiceElement) return;

    const canvas = await html2canvas(invoiceElement as HTMLElement, {
      scale: 2,
      backgroundColor: '#ffffff',
      useCORS: true,
      scrollY: -window.scrollY,
    });

    const imgData = canvas.toDataURL('image/png');

    const pdf = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    const imgWidth = pageWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0; // top-left corner on the first page

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
    heightLeft -= pageHeight;
    position -= pageHeight;

    while (heightLeft > 0) {
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
      heightLeft -= pageHeight;
      position -= pageHeight;
    }

    pdf.save(`Service_Invoice_${service.id.slice(0, 8).toUpperCase()}.pdf`);
  };

  const totalPartsAmount = service.service_parts?.reduce((sum, part) => sum + Number(part.subtotal), 0) || 0;
  const [discountName, setDiscountName] = useState<string>('');
  const [discountType, setDiscountType] = useState<'percent' | 'amount'>('percent');
  const [discountValue, setDiscountValue] = useState<number>(0);

  const serviceTypeBase = Number((service as any)?.service_types?.base_price || 0);
  const subtotal = serviceTypeBase + Number(service.labor_charges || 0) + totalPartsAmount;
  const computedDiscount = discountType === 'percent' ? (subtotal * (discountValue || 0)) / 100 : (discountValue || 0);
  const grandTotal = Math.max(0, subtotal - computedDiscount);

  // Build items for branded invoice
  const invoiceItems = [
    {
      name: service.service_types.name,
      description: 'Base service charge',
      quantity: 1,
      price: Number((service as any)?.service_types?.base_price || 0),
    },
    {
      name: 'Labor Charges',
      description: 'Additional labor and diagnostics',
      quantity: 1,
      price: Number(service.labor_charges || 0),
    },
    ...((service.service_parts || []).map((part) => ({
      name: part.spare_parts.part_name,
      description: part.spare_parts.part_number,
      quantity: Number(part.quantity),
      price: Number(part.unit_price),
    })))
  ];

  // Prefer stored total_cost discount if present on the service record
  const storedDiscount = Math.max(0, subtotal - Number((service as any)?.total_cost ?? subtotal));
  const uiDiscount = discountType === 'percent' ? (subtotal * (discountValue || 0)) / 100 : (discountValue || 0);
  const discountAmount = storedDiscount > 0 ? storedDiscount : uiDiscount;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={() => { setTheme('bw'); setIsOpen(true); }}>
          <Receipt className="h-4 w-4 mr-2" />
          B/W Invoice
        </Button>
      </div>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Service Invoice</DialogTitle>
        </DialogHeader>
        <BrandedInvoice
          logoSrc={'/images/EliteLogo.png'}
          invoiceNumber={service.id.slice(0, 8).toUpperCase()}
          date={service.service_date}
          customerName={service.vehicles.customers.name}
          customerContact={[service.vehicles.customers.phone, service.vehicles.customers.email, service.vehicles.customers.address].filter(Boolean).join(' • ')}
          contact={{
            phone: '+91 888-86-88488, +91 902-85-44476',
            email: 'elitecarwashanddetailing0@gmail.com',
            instagram: '@elite.car.wash.and.detailing',
            address: 'Elite Motors and Detailing, Nashik-422011',
          }}
          items={invoiceItems}
          taxPercent={0}
          discountAmount={discountAmount}
          theme={theme}
        />
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" size="sm" onClick={() => window.print()}>
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
          <Button variant="secondary" size="sm" onClick={handleDownloadPdf}>
            <Download className="h-4 w-4 mr-2" />
            Download PDF
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
