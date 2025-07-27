import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Gift, Plus, Edit, Trash2, Check, X, Calendar, DollarSign, Percent } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Voucher } from '@/types';

const mockVouchers: Voucher[] = [
  {
    id: 'v1',
    code: 'SAVE20',
    title: '20% Off Electronics',
    description: 'Get 20% off on all electronics items',
    discountType: 'percentage',
    discountValue: 20,
    minOrderValue: 100,
    expiryDate: '2024-12-31',
    isUsed: false,
  },
  {
    id: 'v2',
    code: 'WELCOME50',
    title: '$50 Welcome Bonus',
    description: 'Welcome bonus for new customers',
    discountType: 'fixed',
    discountValue: 50,
    minOrderValue: 200,
    expiryDate: '2024-06-30',
    isUsed: true,
    usedDate: '2024-01-15',
  },
  {
    id: 'v3',
    code: 'PLATINUM25',
    title: 'Platinum Member 25% Off',
    description: 'Exclusive discount for Platinum members',
    discountType: 'percentage',
    discountValue: 25,
    minOrderValue: 150,
    expiryDate: '2024-12-31',
    isUsed: false,
  },
  {
    id: 'v4',
    code: 'FIRSTORDER',
    title: 'First Order Discount',
    description: '15% off your first order',
    discountType: 'percentage',
    discountValue: 15,
    minOrderValue: 50,
    expiryDate: '2024-06-30',
    isUsed: true,
    usedDate: '2024-01-12',
  },
];

interface VoucherRedemption {
  id: string;
  voucherId: string;
  voucherCode: string;
  customerName: string;
  customerEmail: string;
  orderTotal: number;
  discountApplied: number;
  redemptionDate: string;
}

const mockRedemptions: VoucherRedemption[] = [
  {
    id: 'r1',
    voucherId: 'v2',
    voucherCode: 'WELCOME50',
    customerName: 'John Doe',
    customerEmail: 'john@example.com',
    orderTotal: 299.99,
    discountApplied: 50,
    redemptionDate: '2024-01-15',
  },
  {
    id: 'r2',
    voucherId: 'v4',
    voucherCode: 'FIRSTORDER',
    customerName: 'Mike Johnson',
    customerEmail: 'mike@example.com',
    orderTotal: 149.99,
    discountApplied: 22.50,
    redemptionDate: '2024-01-12',
  },
];

export default function VoucherManagement() {
  const [vouchers, setVouchers] = useState<Voucher[]>(mockVouchers);
  const [redemptions] = useState<VoucherRedemption[]>(mockRedemptions);
  const [editingVoucher, setEditingVoucher] = useState<Voucher | null>(null);
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

  const generateVoucherCode = () => {
    return Math.random().toString(36).substr(2, 8).toUpperCase();
  };

  const handleVoucherSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const voucherData: Voucher = {
      id: editingVoucher?.id || Date.now().toString(),
      code: (formData.get('code') as string) || generateVoucherCode(),
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      discountType: formData.get('discountType') as 'percentage' | 'fixed',
      discountValue: parseFloat(formData.get('discountValue') as string),
      minOrderValue: parseFloat(formData.get('minOrderValue') as string),
      expiryDate: formData.get('expiryDate') as string,
      isUsed: false,
    };

    if (editingVoucher) {
      setVouchers(prev => prev.map(v => v.id === editingVoucher.id ? voucherData : v));
      toast({ title: "Voucher updated successfully" });
    } else {
      setVouchers(prev => [...prev, voucherData]);
      toast({ title: "Voucher created successfully" });
    }

    setIsDialogOpen(false);
    setEditingVoucher(null);
  };

  const handleDeleteVoucher = (id: string) => {
    setVouchers(prev => prev.filter(v => v.id !== id));
    toast({ title: "Voucher deleted successfully" });
  };

  const getVoucherStatusColor = (voucher: Voucher) => {
    if (voucher.isUsed) return 'bg-destructive text-destructive-foreground';
    if (new Date(voucher.expiryDate) < new Date()) return 'bg-secondary text-secondary-foreground';
    return 'bg-success text-success-foreground';
  };

  const getVoucherStatus = (voucher: Voucher) => {
    if (voucher.isUsed) return 'Used';
    if (new Date(voucher.expiryDate) < new Date()) return 'Expired';
    return 'Active';
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

  const activeVouchers = vouchers.filter(v => !v.isUsed && new Date(v.expiryDate) >= new Date());
  const usedVouchers = vouchers.filter(v => v.isUsed);
  const expiredVouchers = vouchers.filter(v => !v.isUsed && new Date(v.expiryDate) < new Date());

  return (
    <div className="min-h-screen py-8">
      <div className="container-width section-padding">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Voucher Management</h1>
            <p className="text-muted-foreground">Create, manage, and track voucher redemptions</p>
          </div>
          <Badge className="bg-success text-success-foreground">Admin Access</Badge>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Vouchers</CardTitle>
              <Gift className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{vouchers.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Vouchers</CardTitle>
              <Check className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeVouchers.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Redeemed</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{redemptions.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Discount Given</CardTitle>
              <Percent className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${redemptions.reduce((sum, r) => sum + r.discountApplied, 0).toFixed(2)}
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="vouchers" className="space-y-6">
          <TabsList>
            <TabsTrigger value="vouchers">Voucher Management</TabsTrigger>
            <TabsTrigger value="redemptions">Redemption History</TabsTrigger>
          </TabsList>

          <TabsContent value="vouchers">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center gap-2">
                    <Gift className="h-5 w-5" />
                    Vouchers
                  </CardTitle>
                  <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="btn-primary" onClick={() => setEditingVoucher(null)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Create Voucher
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>{editingVoucher ? 'Edit Voucher' : 'Create New Voucher'}</DialogTitle>
                      </DialogHeader>
                      <form onSubmit={handleVoucherSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="title">Voucher Title</Label>
                            <Input id="title" name="title" defaultValue={editingVoucher?.title} required />
                          </div>
                          <div>
                            <Label htmlFor="code">Voucher Code</Label>
                            <Input 
                              id="code" 
                              name="code" 
                              defaultValue={editingVoucher?.code} 
                              placeholder="Leave empty to auto-generate"
                            />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="description">Description</Label>
                          <Textarea id="description" name="description" defaultValue={editingVoucher?.description} required />
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <Label htmlFor="discountType">Discount Type</Label>
                            <Select name="discountType" defaultValue={editingVoucher?.discountType}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="percentage">Percentage (%)</SelectItem>
                                <SelectItem value="fixed">Fixed Amount ($)</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor="discountValue">Discount Value</Label>
                            <Input 
                              id="discountValue" 
                              name="discountValue" 
                              type="number" 
                              step="0.01" 
                              defaultValue={editingVoucher?.discountValue} 
                              required 
                            />
                          </div>
                          <div>
                            <Label htmlFor="minOrderValue">Min Order Value ($)</Label>
                            <Input 
                              id="minOrderValue" 
                              name="minOrderValue" 
                              type="number" 
                              step="0.01" 
                              defaultValue={editingVoucher?.minOrderValue} 
                              required 
                            />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="expiryDate">Expiry Date</Label>
                          <Input 
                            id="expiryDate" 
                            name="expiryDate" 
                            type="date" 
                            defaultValue={editingVoucher?.expiryDate} 
                            required 
                          />
                        </div>
                        <div className="flex justify-end space-x-2">
                          <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                            Cancel
                          </Button>
                          <Button type="submit" className="btn-primary">
                            {editingVoucher ? 'Update' : 'Create'} Voucher
                          </Button>
                        </div>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {vouchers.map((voucher) => (
                    <div key={voucher.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <h3 className="font-semibold">{voucher.title}</h3>
                          <span className="font-mono bg-muted px-2 py-1 rounded text-sm">{voucher.code}</span>
                          <Badge className={getVoucherStatusColor(voucher)}>
                            {getVoucherStatus(voucher)}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{voucher.description}</p>
                        <div className="flex items-center gap-4 text-sm">
                          <span>
                            {voucher.discountType === 'percentage' ? `${voucher.discountValue}% off` : `$${voucher.discountValue} off`}
                          </span>
                          <span>Min: ${voucher.minOrderValue}</span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            Expires: {new Date(voucher.expiryDate).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setEditingVoucher(voucher);
                            setIsDialogOpen(true);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteVoucher(voucher.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  
                  {vouchers.length === 0 && (
                    <div className="text-center py-8">
                      <Gift className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No vouchers found</h3>
                      <p className="text-muted-foreground">Create your first voucher to start offering discounts to customers.</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="redemptions">
            <Card>
              <CardHeader>
                <CardTitle>Redemption History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {redemptions.map((redemption) => (
                    <div key={redemption.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <h3 className="font-semibold">{redemption.customerName}</h3>
                          <span className="font-mono bg-muted px-2 py-1 rounded text-sm">{redemption.voucherCode}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{redemption.customerEmail}</p>
                        <div className="flex items-center gap-4 text-sm">
                          <span>Order: ${redemption.orderTotal.toFixed(2)}</span>
                          <span className="text-success">Discount: -${redemption.discountApplied.toFixed(2)}</span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(redemption.redemptionDate).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {redemptions.length === 0 && (
                    <div className="text-center py-8">
                      <DollarSign className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No redemptions yet</h3>
                      <p className="text-muted-foreground">Voucher redemptions will appear here once customers start using them.</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}