import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Plus, Search, Edit, Trash2, Loader2, Star, StarOff } from 'lucide-react';
import { useShowroomCars, useAddShowroomCar, useUpdateShowroomCar, useDeleteShowroomCar, ShowroomCar } from '@/hooks/useShowroomCars';
import { useToast } from '@/hooks/use-toast';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';

const ManageShowroom = () => {
    const { toast } = useToast();
    const [searchTerm, setSearchTerm] = useState('');
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [editingCar, setEditingCar] = useState<ShowroomCar | null>(null);
    const [newCar, setNewCar] = useState({
        make: '',
        model: '',
        year: '',
        price: '',
        image_url: '',
        description: '',
        engine: '',
        power: '',
        weight: '',
        top_speed: '',
        is_featured: false
    });


    const [imageFiles, setImageFiles] = useState<File[]>([]);
    const [previewUrls, setPreviewUrls] = useState<string[]>([]);

    const { data: cars, isLoading } = useShowroomCars();
    const addCarMutation = useAddShowroomCar();
    const updateCarMutation = useUpdateShowroomCar();
    const deleteCarMutation = useDeleteShowroomCar();
    const [uploading, setUploading] = useState(false);

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (!files) return;

        const newFiles = Array.from(files);
        setImageFiles((prev) => [...prev, ...newFiles]);

        // Create preview URLs
        const newPreviews = newFiles.map(file => URL.createObjectURL(file));
        setPreviewUrls((prev) => [...prev, ...newPreviews]);
    };

    const removeImage = (index: number) => {
        setImageFiles(prev => prev.filter((_, i) => i !== index));
        setPreviewUrls(prev => prev.filter((_, i) => i !== index));
    };

    // Uploads a single file and returns public URL
    const uploadFile = async (file: File): Promise<string> => {
        const fileExt = file.name.split('.').pop();
        const filePath = `${Math.random()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
            .from('showroom')
            .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
            .from('showroom')
            .getPublicUrl(filePath);

        return publicUrl;
    };

    const filteredCars = cars?.filter(car =>
        car.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
        car.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
        car.year.includes(searchTerm)
    );

    const handleAddCar = async () => {
        try {
            setUploading(true);

            // 1. Upload images first
            const uploadedUrls = [];
            for (const file of imageFiles) {
                const url = await uploadFile(file);
                uploadedUrls.push(url);
            }

            // Use first image as main image_url if not provided
            const mainImageUrl = newCar.image_url || uploadedUrls[0] || '';

            // 2. Create Car Record
            const carData = { ...newCar, image_url: mainImageUrl };
            const createdCar = await addCarMutation.mutateAsync(carData);

            if (!createdCar) throw new Error("Failed to create car");

            // 3. Insert into elite_showroom_car_images
            if (uploadedUrls.length > 0) {
                const imageInserts = uploadedUrls.map((url, index) => ({
                    car_id: createdCar.id,
                    image_url: url,
                    display_order: index
                }));

                const { error: imagesError } = await supabase
                    .from('elite_showroom_car_images')
                    .insert(imageInserts);

                if (imagesError) throw imagesError;
            }

            // Reset Form
            setNewCar({
                make: '',
                model: '',
                year: '',
                price: '',
                image_url: '',
                description: '',
                engine: '',
                power: '',
                weight: '',
                top_speed: '',
                is_featured: false
            });
            setImageFiles([]);
            setPreviewUrls([]);
            setIsAddDialogOpen(false);
            toast({ title: "Success", description: "Car added with images" });
        } catch (error: any) {
            console.error(error);
            toast({ title: "Error", description: error.message || "Failed to add car", variant: "destructive" });
        } finally {
            setUploading(false);
        }
    };

    // Keep Update simple for now or modify similarly if requested. 
    // For now, retaining existing Update logic but fixing the reference errors if any variable names changed.

    const handleUpdateCar = async () => {
        if (!editingCar) return;
        try {
            setUploading(true);

            // 1. Upload new images if any
            const uploadedUrls = [];
            for (const file of imageFiles) {
                const url = await uploadFile(file);
                uploadedUrls.push(url);
            }

            // 2. Insert new images into database
            if (uploadedUrls.length > 0) {
                // Get current max display_order to append correctly (optional, or just use 0/length)
                // For simplicity, we just append.
                const imageInserts = uploadedUrls.map((url, index) => ({
                    car_id: editingCar.id,
                    image_url: url,
                    display_order: (editingCar.elite_showroom_car_images?.length || 0) + index
                }));

                const { error: imagesError } = await supabase
                    .from('elite_showroom_car_images')
                    .insert(imageInserts);

                if (imagesError) throw imagesError;
            }

            // 3. Update Car Details
            await updateCarMutation.mutateAsync({
                id: editingCar.id,
                updates: {
                    make: editingCar.make,
                    model: editingCar.model,
                    year: editingCar.year,
                    price: editingCar.price,
                    image_url: editingCar.image_url, // Keep main image as is, or update if logic requires
                    description: editingCar.description,
                    engine: editingCar.engine,
                    power: editingCar.power,
                    weight: editingCar.weight,
                    top_speed: editingCar.top_speed,
                    is_featured: editingCar.is_featured
                },
            });

            setEditingCar(null);
            setImageFiles([]);
            setPreviewUrls([]);
            toast({ title: "Success", description: "Car updated successfully" });
        } catch (error: any) {
            console.error(error);
            toast({ title: "Error", description: error.message || "Failed to update car", variant: "destructive" });
        } finally {
            setUploading(false);
        }
    };

    const handleDeleteCar = async (id: string) => {
        try {
            await deleteCarMutation.mutateAsync(id);
            toast({ title: "Success", description: "Car removed from showroom" });
        } catch (error) {
            toast({ title: "Error", description: "Failed to delete car", variant: "destructive" });
        }
    };

    const handleDeleteImage = async (imageId: string) => {
        try {
            const { error } = await supabase
                .from('elite_showroom_car_images')
                .delete()
                .eq('id', imageId);

            if (error) throw error;

            // Update local state
            setEditingCar(prev => {
                if (!prev) return null;
                return {
                    ...prev,
                    elite_showroom_car_images: prev.elite_showroom_car_images?.filter(img => img.id !== imageId)
                };
            });

            toast({ title: "Success", description: "Image removed" });
        } catch (error) {
            console.error(error);
            toast({ title: "Error", description: "Failed to remove image", variant: "destructive" });
        }
    };

    const handleToggleFeature = async (car: ShowroomCar) => {
        try {
            await updateCarMutation.mutateAsync({
                id: car.id,
                updates: { is_featured: !car.is_featured }
            });
        } catch (error) {
            toast({ title: "Error", description: "Failed to update status", variant: "destructive" });
        }
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-96">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold">Showroom Management</h1>
                    <p className="text-gray-600">Manage cars displayed on the public website</p>
                </div>

                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Add Car
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>Add New Showroom Car</DialogTitle>
                        </DialogHeader>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Make</Label>
                                <Input value={newCar.make} onChange={(e) => setNewCar({ ...newCar, make: e.target.value })} placeholder="e.g. Dodge" />
                            </div>
                            <div className="space-y-2">
                                <Label>Model</Label>
                                <Input value={newCar.model} onChange={(e) => setNewCar({ ...newCar, model: e.target.value })} placeholder="e.g. Challenger SRT" />
                            </div>
                            <div className="space-y-2">
                                <Label>Year</Label>
                                <Input value={newCar.year} onChange={(e) => setNewCar({ ...newCar, year: e.target.value })} placeholder="e.g. 2023" />
                            </div>
                            <div className="space-y-2">
                                <Label>Price</Label>
                                <Input value={newCar.price} onChange={(e) => setNewCar({ ...newCar, price: e.target.value })} placeholder="e.g. $85,000" />
                            </div>
                            <div className="col-span-1 md:col-span-2 space-y-2">
                                <Label>Images (Select Multiple)</Label>
                                <div className="flex flex-col gap-4">
                                    <div className="flex gap-2">
                                        <Input
                                            type="file"
                                            multiple
                                            accept="image/*"
                                            onChange={handleFileSelect}
                                            disabled={uploading}
                                        />
                                    </div>
                                    {/* Preview Grid */}
                                    {previewUrls.length > 0 && (
                                        <div className="grid grid-cols-4 gap-2">
                                            {previewUrls.map((url, index) => (
                                                <div key={index} className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden border border-gray-200 group">
                                                    <img
                                                        src={url}
                                                        alt={`Preview ${index}`}
                                                        className="w-full h-full object-cover"
                                                    />
                                                    <button
                                                        onClick={() => removeImage(index)}
                                                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                                    >
                                                        <Trash2 className="w-3 h-3" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="col-span-1 md:col-span-2 space-y-2">
                                <Label>Description</Label>
                                <Textarea value={newCar.description} onChange={(e) => setNewCar({ ...newCar, description: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <Label>Engine</Label>
                                <Input value={newCar.engine} onChange={(e) => setNewCar({ ...newCar, engine: e.target.value })} placeholder="e.g. V8" />
                            </div>
                            <div className="space-y-2">
                                <Label>Power</Label>
                                <Input value={newCar.power} onChange={(e) => setNewCar({ ...newCar, power: e.target.value })} placeholder="e.g. 707 bhp" />
                            </div>
                            <div className="space-y-2">
                                <Label>Weight</Label>
                                <Input value={newCar.weight} onChange={(e) => setNewCar({ ...newCar, weight: e.target.value })} placeholder="e.g. 4449 lbs" />
                            </div>
                            <div className="space-y-2">
                                <Label>Top Speed</Label>
                                <Input value={newCar.top_speed} onChange={(e) => setNewCar({ ...newCar, top_speed: e.target.value })} placeholder="e.g. 199 mph" />
                            </div>
                            <div className="flex items-center space-x-2 pt-4">
                                <Switch id="featured" checked={newCar.is_featured} onCheckedChange={(checked) => setNewCar({ ...newCar, is_featured: checked })} />
                                <Label htmlFor="featured">Set as Featured (Hero)</Label>
                            </div>
                        </div>
                        <Button onClick={handleAddCar} className="w-full mt-4" disabled={uploading || addCarMutation.isPending}>
                            {uploading ? <Loader2 className="animate-spin mr-2" /> : null}
                            {uploading ? 'Uploading Images...' : 'Add Car'}
                        </Button>
                    </DialogContent>
                </Dialog>
            </div>

            <Card>
                <CardContent className="pt-6">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                            placeholder="Search showroom..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Showroom Inventory ({filteredCars?.length || 0})</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Car</TableHead>
                                <TableHead>Year</TableHead>
                                <TableHead>Price</TableHead>
                                <TableHead>Featured</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredCars?.map((car) => (
                                <TableRow key={car.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            {car.image_url && <img src={car.image_url} alt={car.model} className="w-12 h-8 object-cover rounded" />}
                                            <div>
                                                <div className="font-medium">{car.make} {car.model}</div>
                                                <div className="text-xs text-gray-500">{car.engine}</div>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>{car.year}</TableCell>
                                    <TableCell>{car.price}</TableCell>
                                    <TableCell>
                                        <Button variant="ghost" size="icon" onClick={() => handleToggleFeature(car)}>
                                            {car.is_featured ? <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" /> : <StarOff className="h-4 w-4 text-gray-400" />}
                                        </Button>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex space-x-2">
                                            <Button variant="outline" size="sm" onClick={() => setEditingCar(car)}>
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button variant="outline" size="sm" onClick={() => handleDeleteCar(car.id)} disabled={deleteCarMutation.isPending}>
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Edit Dialog - Similar to Add but prefilled */}
            <Dialog open={!!editingCar} onOpenChange={(open) => {
                if (!open) {
                    setEditingCar(null);
                    setImageFiles([]);
                    setPreviewUrls([]);
                }
            }}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Edit Car</DialogTitle>
                    </DialogHeader>
                    {editingCar && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Make</Label>
                                <Input value={editingCar.make} onChange={(e) => setEditingCar({ ...editingCar, make: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <Label>Model</Label>
                                <Input value={editingCar.model} onChange={(e) => setEditingCar({ ...editingCar, model: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <Label>Year</Label>
                                <Input value={editingCar.year} onChange={(e) => setEditingCar({ ...editingCar, year: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <Label>Price</Label>
                                <Input value={editingCar.price} onChange={(e) => setEditingCar({ ...editingCar, price: e.target.value })} />
                            </div>

                            <div className="col-span-1 md:col-span-2 space-y-4 border-t border-b py-4 my-2">
                                <h3 className="font-semibold text-gray-900">Images</h3>

                                {/* Existing Images */}
                                {editingCar.elite_showroom_car_images && editingCar.elite_showroom_car_images.length > 0 && (
                                    <div>
                                        <Label className="text-xs text-gray-500 mb-2 block">Existing Images</Label>
                                        <div className="grid grid-cols-4 gap-2">
                                            {editingCar.elite_showroom_car_images.map((img) => (
                                                <div key={img.id} className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden border border-gray-200 group">
                                                    <img src={img.image_url} alt="Existing" className="w-full h-full object-cover" />
                                                    <button
                                                        onClick={() => handleDeleteImage(img.id)}
                                                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                                        title="Delete Image"
                                                    >
                                                        <Trash2 className="w-3 h-3" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Add New Images */}
                                <div>
                                    <Label className="text-xs text-gray-500 mb-2 block">Add New Images</Label>
                                    <div className="flex gap-2 mb-2">
                                        <Input
                                            type="file"
                                            multiple
                                            accept="image/*"
                                            onChange={handleFileSelect}
                                            disabled={uploading}
                                        />
                                    </div>
                                    {/* Preview Grid for New Images */}
                                    {previewUrls.length > 0 && (
                                        <div className="grid grid-cols-4 gap-2">
                                            {previewUrls.map((url, index) => (
                                                <div key={index} className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden border border-gray-200 group">
                                                    <img
                                                        src={url}
                                                        alt={`Preview ${index}`}
                                                        className="w-full h-full object-cover"
                                                    />
                                                    <button
                                                        onClick={() => removeImage(index)}
                                                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                                    >
                                                        <Trash2 className="w-3 h-3" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Main Image URL Fallback */}
                                <div className="space-y-1">
                                    <Label className="text-xs text-gray-500">Main Image URL (Manual Override)</Label>
                                    <Input
                                        value={editingCar.image_url || ''}
                                        onChange={(e) => setEditingCar({ ...editingCar, image_url: e.target.value })}
                                        placeholder="https://..."
                                    />
                                </div>
                            </div>

                            <div className="col-span-1 md:col-span-2 space-y-2">
                                <Label>Description</Label>
                                <Textarea value={editingCar.description || ''} onChange={(e) => setEditingCar({ ...editingCar, description: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <Label>Engine</Label>
                                <Input value={editingCar.engine || ''} onChange={(e) => setEditingCar({ ...editingCar, engine: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <Label>Power</Label>
                                <Input value={editingCar.power || ''} onChange={(e) => setEditingCar({ ...editingCar, power: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <Label>Weight</Label>
                                <Input value={editingCar.weight || ''} onChange={(e) => setEditingCar({ ...editingCar, weight: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <Label>Top Speed</Label>
                                <Input value={editingCar.top_speed || ''} onChange={(e) => setEditingCar({ ...editingCar, top_speed: e.target.value })} />
                            </div>
                            <div className="flex items-center space-x-2 pt-4">
                                <Switch id="edit-featured" checked={editingCar.is_featured || false} onCheckedChange={(checked) => setEditingCar({ ...editingCar, is_featured: checked })} />
                                <Label htmlFor="edit-featured">Set as Featured (Hero)</Label>
                            </div>
                            <Button onClick={handleUpdateCar} className="w-full mt-4 col-span-1 md:col-span-2">
                                Update Car
                            </Button>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div >
    );
};

export default ManageShowroom;
