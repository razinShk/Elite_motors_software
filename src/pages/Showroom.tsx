import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const cars = [
    {
        id: 1,
        name: "Tesla Model S",
        price: "$89,990",
        image: "https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&q=80&w=800",
        description: "Electric luxury sedan with autopilot capabilities."
    },
    {
        id: 2,
        name: "BMW M4 Competition",
        price: "$78,600",
        image: "https://images.unsplash.com/photo-1617531653332-bd46c24f2068?auto=format&fit=crop&q=80&w=800",
        description: "High-performance sports coupe with aggressive styling."
    },
    {
        id: 3,
        name: "Mercedes-AMG GT",
        price: "$118,600",
        image: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&q=80&w=800",
        description: "Two-door sports car with a powerful V8 engine."
    },
    {
        id: 4,
        name: "Porsche 911 Carrera",
        price: "$114,400",
        image: "https://images.unsplash.com/photo-1503376763036-066120622c74?auto=format&fit=crop&q=80&w=800",
        description: "Iconic sports car known for its handling and performance."
    },
    {
        id: 5,
        name: "Audi RS e-tron GT",
        price: "$147,100",
        image: "https://images.unsplash.com/photo-1614200187524-dc41162f7687?auto=format&fit=crop&q=80&w=800",
        description: "All-electric grand tourer with stunning design."
    },
    {
        id: 6,
        name: "Lamborghini Huracán",
        price: "$248,295",
        image: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?auto=format&fit=crop&q=80&w=800",
        description: "Exotic supercar with a V10 engine and striking looks."
    }
];

const Showroom = () => {
    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <Link to="/">
                            <Button variant="ghost" size="icon">
                                <ArrowLeft className="h-6 w-6" />
                            </Button>
                        </Link>
                        <h1 className="text-4xl font-bold text-gray-900">Showroom</h1>
                    </div>
                    <Link to="/inventory">
                        <Button variant="outline">Admin Login</Button>
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {cars.map((car) => (
                        <Card key={car.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                            <div className="aspect-video w-full overflow-hidden">
                                <img
                                    src={car.image}
                                    alt={car.name}
                                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                                />
                            </div>
                            <CardHeader>
                                <CardTitle className="flex justify-between items-center">
                                    <span>{car.name}</span>
                                    <span className="text-blue-600">{car.price}</span>
                                </CardTitle>
                                <CardDescription>{car.description}</CardDescription>
                            </CardHeader>
                            <CardFooter>
                                <Link to={`/car-details/${car.id}`} className="w-full">
                                    <Button className="w-full bg-blue-600 hover:bg-blue-700">View Details</Button>
                                </Link>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Showroom;
