import { 
  PackageIcon, 
  ShoppingBagIcon, 
  TrendingUpIcon, 
  BarChart3Icon,
  ClockIcon,
  ShieldCheckIcon
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';

const FEATURES = [
  {
    icon: PackageIcon,
    title: 'Inventory Management',
    description: 'Track your coffee beans, supplies, and ingredients with real-time inventory updates.'
  },
  {
    icon: ShoppingBagIcon,
    title: 'Product Catalog',
    description: 'Manage your coffee menu, prices, and product variations all in one place.'
  },
  {
    icon: TrendingUpIcon,
    title: 'Sales Tracking',
    description: 'Monitor daily sales, revenue, and popular items to grow your business.'
  },
  {
    icon: BarChart3Icon,
    title: 'Analytics Dashboard',
    description: 'Get insights into your business performance with detailed reports and charts.'
  },
  {
    icon: ClockIcon,
    title: 'Quick Setup',
    description: 'Get started in minutes with our simple onboarding process and intuitive interface.'
  },
  {
    icon: ShieldCheckIcon,
    title: 'Secure & Reliable',
    description: 'Your data is protected with enterprise-grade security and reliable cloud hosting.'
  }
];

export function FeaturesSection() {
  return (
    <section className="py-20 px-6">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Everything you need to run your coffee shop
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            From inventory management to sales tracking, we've got all the tools 
            to help your coffee business thrive.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {FEATURES.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className="text-center">
                <CardHeader>
                  <div className="flex justify-center mb-4">
                    <div className="p-3 rounded-full bg-primary/10">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}