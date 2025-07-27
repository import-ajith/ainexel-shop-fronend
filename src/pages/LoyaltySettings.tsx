import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, Plus, Edit, Trash2, Gift } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { products } from '@/data/products';

interface LoyaltyRule {
  id: string;
  customerId: string;
  customerName: string;
  productId: string;
  productName: string;
  pointsMultiplier: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

const mockCustomers = [
  { id: '2', name: 'John Doe', email: 'john@example.com' },
  { id: '3', name: 'Sarah Wilson', email: 'sarah@example.com' },
  { id: '4', name: 'Mike Johnson', email: 'mike@example.com' },
];

const mockLoyaltyRules: LoyaltyRule[] = [
  {
    id: 'lr1',
    customerId: '2',
    customerName: 'John Doe',
    productId: '1',
    productName: 'iPhone 15 Pro',
    pointsMultiplier: 2.0,
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    isActive: true,
  },
  {
    id: 'lr2',
    customerId: '3',
    customerName: 'Sarah Wilson',
    productId: '2',
    productName: 'MacBook Air M3',
    pointsMultiplier: 1.5,
    startDate: '2024-01-01',
    endDate: '2024-06-30',
    isActive: true,
  },
  {
    id: 'lr3',
    customerId: '4',
    customerName: 'Mike Johnson',
    productId: '3',
    productName: 'Sony WH-1000XM5',
    pointsMultiplier: 3.0,
    startDate: '2024-02-01',
    endDate: '2024-08-31',
    isActive: false,
  },
];

export default function LoyaltySettings() {
  const [loyaltyRules, setLoyaltyRules] = useState<LoyaltyRule[]>(mockLoyaltyRules);
  const [editingRule, setEditingRule] = useState<LoyaltyRule | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }
  }, [user, navigate]);

  const handleRuleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const selectedCustomer = mockCustomers.find(c => c.id === formData.get('customerId'));
    const selectedProduct = products.find(p => p.id === formData.get('productId'));
    
    const ruleData: LoyaltyRule = {
      id: editingRule?.id || Date.now().toString(),
      customerId: formData.get('customerId') as string,
      customerName: selectedCustomer?.name || '',
      productId: formData.get('productId') as string,
      productName: selectedProduct?.name || '',
      pointsMultiplier: parseFloat(formData.get('pointsMultiplier') as string),
      startDate: formData.get('startDate') as string,
      endDate: formData.get('endDate') as string,
      isActive: formData.get('isActive') === 'true',
    };

    if (editingRule) {
      setLoyaltyRules(prev => prev.map(r => r.id === editingRule.id ? ruleData : r));
      toast({ title: "Loyalty rule updated successfully" });
    } else {
      setLoyaltyRules(prev => [...prev, ruleData]);
      toast({ title: "Loyalty rule created successfully" });
    }

    setIsDialogOpen(false);
    setEditingRule(null);
  };

  const handleDeleteRule = (id: string) => {
    setLoyaltyRules(prev => prev.filter(r => r.id !== id));
    toast({ title: "Loyalty rule deleted successfully" });
  };

  const toggleRuleStatus = (id: string) => {
    setLoyaltyRules(prev => prev.map(r => 
      r.id === id ? { ...r, isActive: !r.isActive } : r
    ));
    toast({ title: "Loyalty rule status updated" });
  };

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-muted-foreground">You need admin privileges to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container-width section-padding">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Loyalty Settings</h1>
            <p className="text-muted-foreground">Manage loyalty point multipliers for specific customers and products</p>
          </div>
          <Badge className="bg-success text-success-foreground">Admin Access</Badge>
        </div>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5" />
                Loyalty Rules
              </CardTitle>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="btn-primary" onClick={() => setEditingRule(null)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Rule
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>{editingRule ? 'Edit Loyalty Rule' : 'Create New Loyalty Rule'}</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleRuleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="customerId">Customer</Label>
                        <Select name="customerId" defaultValue={editingRule?.customerId}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select customer" />
                          </SelectTrigger>
                          <SelectContent>
                            {mockCustomers.map(customer => (
                              <SelectItem key={customer.id} value={customer.id}>
                                {customer.name} ({customer.email})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="productId">Product</Label>
                        <Select name="productId" defaultValue={editingRule?.productId}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select product" />
                          </SelectTrigger>
                          <SelectContent>
                            {products.map(product => (
                              <SelectItem key={product.id} value={product.id}>
                                {product.name} (${product.price})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="pointsMultiplier">Points Multiplier</Label>
                        <Input 
                          id="pointsMultiplier" 
                          name="pointsMultiplier" 
                          type="number" 
                          step="0.1" 
                          min="1" 
                          max="10"
                          defaultValue={editingRule?.pointsMultiplier} 
                          required 
                        />
                      </div>
                      <div>
                        <Label htmlFor="startDate">Start Date</Label>
                        <Input 
                          id="startDate" 
                          name="startDate" 
                          type="date" 
                          defaultValue={editingRule?.startDate} 
                          required 
                        />
                      </div>
                      <div>
                        <Label htmlFor="endDate">End Date</Label>
                        <Input 
                          id="endDate" 
                          name="endDate" 
                          type="date" 
                          defaultValue={editingRule?.endDate} 
                          required 
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="isActive">Status</Label>
                      <Select name="isActive" defaultValue={editingRule?.isActive ? 'true' : 'false'}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="true">Active</SelectItem>
                          <SelectItem value="false">Inactive</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button type="submit" className="btn-primary">
                        {editingRule ? 'Update' : 'Create'} Rule
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {loyaltyRules.map((rule) => (
                <div key={rule.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold">{rule.customerName}</h3>
                      <Badge variant="outline">{rule.productName}</Badge>
                      <Badge className={rule.isActive ? 'bg-success text-success-foreground' : 'bg-secondary'}>
                        {rule.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <span className="font-medium">{rule.pointsMultiplier}x points</span> • 
                      {new Date(rule.startDate).toLocaleDateString()} to {new Date(rule.endDate).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleRuleStatus(rule.id)}
                    >
                      {rule.isActive ? 'Deactivate' : 'Activate'}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditingRule(rule);
                        setIsDialogOpen(true);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteRule(rule.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
              
              {loyaltyRules.length === 0 && (
                <div className="text-center py-8">
                  <Gift className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No loyalty rules found</h3>
                  <p className="text-muted-foreground">Create your first loyalty rule to reward customers with bonus points.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}