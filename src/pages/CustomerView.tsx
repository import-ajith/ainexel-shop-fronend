import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, User as UserIcon, Package, Star, Gift, CreditCard, Calendar, Phone, Mail, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useAuth } from '@/contexts/AuthContext';
import { User, Order, Voucher, Transaction } from '@/types';

// Mock customer data
const mockCustomers: User[] = [
  {
    id: '2',
    email: 'john@example.com',
    name: 'John Doe',
    role: 'customer',
    phone: '+1 (555) 123-4567',
    dateJoined: '2023-06-15',
    totalOrders: 8,
    totalSpent: 2450.00,
    loyaltyPoints: 1225,
    membershipTier: 'Gold',
  },
  {
    id: '3',
    email: 'sarah@example.com',
    name: 'Sarah Wilson',
    role: 'customer',
    phone: '+1 (555) 987-6543',
    dateJoined: '2023-08-22',
    totalOrders: 12,
    totalSpent: 3200.00,
    loyaltyPoints: 1600,
    membershipTier: 'Platinum',
  },
  {
    id: '4',
    email: 'mike@example.com',
    name: 'Mike Johnson',
    role: 'customer',
    phone: '+1 (555) 456-7890',
    dateJoined: '2024-01-10',
    totalOrders: 3,
    totalSpent: 890.00,
    loyaltyPoints: 445,
    membershipTier: 'Bronze',
  },
];

const mockVouchers: Record<string, Voucher[]> = {
  '2': [
    {
      id: 'v1',
      code: 'SAVE20',
      title: '20% Off Electronics',
      description: 'Get 20% off on all electronics',
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
  ],
  '3': [
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
  ],
  '4': [
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
  ],
};

const mockTransactions: Record<string, Transaction[]> = {
  '2': [
    {
      id: 't1',
      orderId: 'order-1',
      type: 'purchase',
      amount: 899.99,
      loyaltyPointsEarned: 90,
      date: '2024-01-15',
      description: 'iPhone 15 Pro purchase',
    },
    {
      id: 't2',
      orderId: 'order-2',
      type: 'purchase',
      amount: 549.99,
      loyaltyPointsEarned: 55,
      date: '2024-02-20',
      description: 'MacBook Air purchase',
    },
    {
      id: 't3',
      orderId: 'loyalty-redeem-1',
      type: 'loyalty_redeemed',
      amount: -25.00,
      loyaltyPointsUsed: 250,
      date: '2024-03-10',
      description: 'Loyalty points redeemed for discount',
    },
  ],
  '3': [
    {
      id: 't4',
      orderId: 'order-3',
      type: 'purchase',
      amount: 1299.99,
      loyaltyPointsEarned: 130,
      date: '2024-01-08',
      description: 'Sony WH-1000XM5 and MacBook Pro',
    },
    {
      id: 't5',
      orderId: 'order-4',
      type: 'purchase',
      amount: 399.99,
      loyaltyPointsEarned: 40,
      date: '2024-02-14',
      description: 'Apple Watch Series 9',
    },
  ],
  '4': [
    {
      id: 't6',
      orderId: 'order-5',
      type: 'purchase',
      amount: 699.99,
      loyaltyPointsEarned: 70,
      date: '2024-01-12',
      description: 'Gaming Laptop',
    },
  ],
};

export default function CustomerView() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<User | null>(null);
  const [filteredCustomers, setFilteredCustomers] = useState<User[]>([]);
  
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }
  }, [user, navigate]);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredCustomers([]);
      return;
    }

    const filtered = mockCustomers.filter(customer =>
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.phone?.includes(searchQuery)
    );
    setFilteredCustomers(filtered);
  }, [searchQuery]);

  const getMembershipColor = (tier: string) => {
    switch (tier) {
      case 'Bronze': return 'bg-amber-600 text-white';
      case 'Silver': return 'bg-slate-500 text-white';
      case 'Gold': return 'bg-yellow-500 text-white';
      case 'Platinum': return 'bg-purple-600 text-white';
      default: return 'bg-secondary text-secondary-foreground';
    }
  };

  const getTransactionTypeColor = (type: string) => {
    switch (type) {
      case 'purchase': return 'bg-success text-success-foreground';
      case 'refund': return 'bg-destructive text-destructive-foreground';
      case 'loyalty_earned': return 'bg-info text-info-foreground';
      case 'loyalty_redeemed': return 'bg-warning text-warning-foreground';
      default: return 'bg-secondary text-secondary-foreground';
    }
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
          <h1 className="text-3xl font-bold">Customer Management</h1>
          <Badge className="bg-success text-success-foreground">Admin Access</Badge>
        </div>

        {/* Search Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Search Customer
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, or phone number..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            {filteredCustomers.length > 0 && (
              <div className="mt-4 space-y-2">
                {filteredCustomers.map((customer) => (
                  <div
                    key={customer.id}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 cursor-pointer"
                    onClick={() => setSelectedCustomer(customer)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                        <UserIcon className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{customer.name}</h3>
                        <p className="text-sm text-muted-foreground">{customer.email}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className={getMembershipColor(customer.membershipTier || 'Bronze')}>
                        {customer.membershipTier}
                      </Badge>
                      <p className="text-sm text-muted-foreground mt-1">
                        {customer.totalOrders} orders • ${customer.totalSpent?.toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Customer Details */}
        {selectedCustomer && (
          <div className="space-y-6">
            {/* Customer Profile Header */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserIcon className="h-5 w-5" />
                  Customer Profile
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="space-y-2">
                    <h3 className="font-semibold text-lg">{selectedCustomer.name}</h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Mail className="h-4 w-4" />
                      {selectedCustomer.email}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Phone className="h-4 w-4" />
                      {selectedCustomer.phone}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      Joined: {new Date(selectedCustomer.dateJoined!).toLocaleDateString()}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium">Membership</h4>
                    <Badge className={getMembershipColor(selectedCustomer.membershipTier || 'Bronze')}>
                      {selectedCustomer.membershipTier} Member
                    </Badge>
                    <div className="flex items-center gap-2 text-sm">
                      <Star className="h-4 w-4 text-yellow-500" />
                      {selectedCustomer.loyaltyPoints} Points
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium">Order Statistics</h4>
                    <div className="flex items-center gap-2 text-sm">
                      <Package className="h-4 w-4" />
                      {selectedCustomer.totalOrders} Total Orders
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CreditCard className="h-4 w-4" />
                      ${selectedCustomer.totalSpent?.toFixed(2)} Total Spent
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium">Average Order Value</h4>
                    <div className="text-2xl font-bold">
                      ${((selectedCustomer.totalSpent || 0) / (selectedCustomer.totalOrders || 1)).toFixed(2)}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Detailed Information Tabs */}
            <Tabs defaultValue="transactions" className="space-y-6">
              <TabsList>
                <TabsTrigger value="transactions">Transaction History</TabsTrigger>
                <TabsTrigger value="vouchers">Vouchers</TabsTrigger>
                <TabsTrigger value="loyalty">Loyalty Details</TabsTrigger>
              </TabsList>

              <TabsContent value="transactions">
                <Card>
                  <CardHeader>
                    <CardTitle>Transaction History</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Description</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Loyalty Points</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {(mockTransactions[selectedCustomer.id] || []).map((transaction) => (
                          <TableRow key={transaction.id}>
                            <TableCell>{new Date(transaction.date).toLocaleDateString()}</TableCell>
                            <TableCell>
                              <Badge className={getTransactionTypeColor(transaction.type)}>
                                {transaction.type.replace('_', ' ').toUpperCase()}
                              </Badge>
                            </TableCell>
                            <TableCell>{transaction.description}</TableCell>
                            <TableCell>
                              <span className={transaction.amount < 0 ? 'text-destructive' : 'text-success'}>
                                ${Math.abs(transaction.amount).toFixed(2)}
                              </span>
                            </TableCell>
                            <TableCell>
                              {transaction.loyaltyPointsEarned && (
                                <span className="text-success">+{transaction.loyaltyPointsEarned}</span>
                              )}
                              {transaction.loyaltyPointsUsed && (
                                <span className="text-destructive">-{transaction.loyaltyPointsUsed}</span>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="vouchers">
                <Card>
                  <CardHeader>
                    <CardTitle>Vouchers & Coupons</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {(mockVouchers[selectedCustomer.id] || []).map((voucher) => (
                        <div key={voucher.id} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start">
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <Gift className="h-4 w-4" />
                                <h3 className="font-semibold">{voucher.title}</h3>
                                <Badge variant={voucher.isUsed ? 'secondary' : 'default'}>
                                  {voucher.isUsed ? 'Used' : 'Active'}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">{voucher.description}</p>
                              <div className="flex items-center gap-4 text-sm">
                                <span className="font-mono bg-muted px-2 py-1 rounded">{voucher.code}</span>
                                <span>
                                  {voucher.discountType === 'percentage' ? `${voucher.discountValue}% off` : `$${voucher.discountValue} off`}
                                </span>
                                <span>Min: ${voucher.minOrderValue}</span>
                              </div>
                            </div>
                            <div className="text-right text-sm text-muted-foreground">
                              <p>Expires: {new Date(voucher.expiryDate).toLocaleDateString()}</p>
                              {voucher.isUsed && voucher.usedDate && (
                                <p>Used: {new Date(voucher.usedDate).toLocaleDateString()}</p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="loyalty">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Star className="h-5 w-5" />
                        Loyalty Summary
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span>Current Points</span>
                        <span className="text-2xl font-bold">{selectedCustomer.loyaltyPoints}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Membership Tier</span>
                        <Badge className={getMembershipColor(selectedCustomer.membershipTier || 'Bronze')}>
                          {selectedCustomer.membershipTier}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Points to Next Tier</span>
                        <span className="font-semibold">
                          {selectedCustomer.membershipTier === 'Platinum' ? 'Max Tier' : '275 points'}
                        </span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Loyalty Benefits</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="text-sm">
                        <h4 className="font-medium mb-2">Current Benefits:</h4>
                        <ul className="space-y-1 text-muted-foreground">
                          <li>• {selectedCustomer.membershipTier === 'Bronze' ? '1%' : selectedCustomer.membershipTier === 'Silver' ? '2%' : selectedCustomer.membershipTier === 'Gold' ? '3%' : '5%'} cashback on purchases</li>
                          <li>• Early access to sales</li>
                          <li>• Free shipping on orders $50+</li>
                          {(selectedCustomer.membershipTier === 'Gold' || selectedCustomer.membershipTier === 'Platinum') && (
                            <li>• Priority customer support</li>
                          )}
                          {selectedCustomer.membershipTier === 'Platinum' && (
                            <li>• Exclusive member events</li>
                          )}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}

        {searchQuery && filteredCustomers.length === 0 && (
          <Card>
            <CardContent className="text-center py-8">
              <UserIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No customers found matching your search.</p>
            </CardContent>
          </Card>
        )}

        {!selectedCustomer && !searchQuery && (
          <Card>
            <CardContent className="text-center py-8">
              <Search className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Start by searching for a customer to view their details.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}