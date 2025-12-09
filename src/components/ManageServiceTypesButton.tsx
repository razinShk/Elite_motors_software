import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useServiceTypes, useCreateServiceType, useUpdateServiceType, useDeleteServiceType } from '@/hooks/useServicesData';
import { Loader2, Wrench, Trash2, Pencil } from 'lucide-react';

export const ManageServiceTypesButton = () => {
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', base_price: '', description: '' });

  const { data: serviceTypes, isLoading } = useServiceTypes();
  const createMutation = useCreateServiceType();
  const updateMutation = useUpdateServiceType();
  const deleteMutation = useDeleteServiceType();

  const resetForm = () => {
    setEditingId(null);
    setForm({ name: '', base_price: '', description: '' });
  };

  const startEdit = (st: any) => {
    setEditingId(st.id);
    setForm({
      name: st.name || '',
      base_price: String(st.base_price ?? ''),
      description: st.description || '',
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      await updateMutation.mutateAsync({
        id: editingId,
        updates: {
          name: form.name,
          base_price: Number(form.base_price) || 0,
          description: form.description || null,
        } as any,
      });
    } else {
      await createMutation.mutateAsync({
        name: form.name,
        base_price: Number(form.base_price) || 0,
        description: form.description || null,
      } as any);
    }
    resetForm();
  };

  const handleDelete = async (id: string) => {
    await deleteMutation.mutateAsync(id);
    if (editingId === id) resetForm();
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) resetForm(); }}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Wrench className="mr-2 h-4 w-4" />
          Manage Service Types
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Service Types</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <Label>Name</Label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              </div>
              <div>
                <Label>Base Price</Label>
                <Input type="number" step="0.01" value={form.base_price} onChange={(e) => setForm({ ...form, base_price: e.target.value })} />
              </div>
              <div>
                <Label>Description</Label>
                <Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              </div>
              <div className="flex gap-2">
                <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                  {(createMutation.isPending || updateMutation.isPending) ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : null}
                  {editingId ? 'Update' : 'Add'}
                </Button>
                {editingId && (
                  <Button type="button" variant="secondary" onClick={resetForm}>Cancel</Button>
                )}
              </div>
            </form>
          </div>

          <div className="overflow-auto max-h-[50vh]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow><TableCell colSpan={4} className="text-center">Loading...</TableCell></TableRow>
                ) : (serviceTypes || []).map((st: any) => (
                  <TableRow key={st.id}>
                    <TableCell>{st.name}</TableCell>
                    <TableCell>{Number(st.base_price || 0).toFixed(2)}</TableCell>
                    <TableCell className="max-w-[240px] truncate">{st.description}</TableCell>
                    <TableCell className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => startEdit(st)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDelete(st.id)} disabled={deleteMutation.isPending}>
                        {deleteMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ManageServiceTypesButton;


