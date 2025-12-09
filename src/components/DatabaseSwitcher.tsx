import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useDatabase } from '@/contexts/DatabaseContext';
import { Building2, Car } from 'lucide-react';

export const DatabaseSwitcher: React.FC = () => {
  const { databaseType, setDatabaseType } = useDatabase();

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="h-5 w-5" />
          Database Selection
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <Button
            variant={databaseType === 'elite' ? 'default' : 'outline'}
            className="w-full justify-start"
            onClick={() => setDatabaseType('elite')}
          >
            <Car className="h-4 w-4 mr-2" />
            Elite Motor and Detailing
            {databaseType === 'elite' && (
              <Badge variant="secondary" className="ml-auto">
                Active
              </Badge>
            )}
          </Button>
          
          <Button
            variant={databaseType === 'shahi' ? 'default' : 'outline'}
            className="w-full justify-start"
            onClick={() => setDatabaseType('shahi')}
          >
            <Building2 className="h-4 w-4 mr-2" />
            Shahi Multi Car Care
            {databaseType === 'shahi' && (
              <Badge variant="secondary" className="ml-auto">
                Active
              </Badge>
            )}
          </Button>
        </div>
        
        <div className="text-sm text-gray-600">
          <p>Currently using: <strong>{databaseType === 'elite' ? 'Elite Motor and Detailing' : 'Shahi Multi Car Care'}</strong></p>
          <p className="text-xs mt-1">All data operations will use the selected database.</p>
        </div>
      </CardContent>
    </Card>
  );
};
