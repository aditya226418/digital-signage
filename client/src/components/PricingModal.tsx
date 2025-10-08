import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { CheckCircle2, MonitorSmartphone, Briefcase, Star, Building2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface PricingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function PricingModal({ open, onOpenChange }: PricingModalProps) {
  const personalFeatures = [
    {
      text: "Up to 10 screens",
      description: "Perfect for cafes, salons, and clinics.",
    },
    {
      text: "Unlimited content uploads",
      description: "Keep your displays fresh and updated.",
    },
    {
      text: "HD media playback",
      description: "Deliver clear, crisp visuals easily.",
    },
    {
      text: "Basic analytics & reports",
      description: "Know what content performs best.",
    },
    {
      text: "Email support",
      description: "Get help whenever needed.",
    },
  ];

  const enterpriseFeatures = [
    {
      text: "Unlimited screens",
      description: "Ideal for retail chains or large organizations.",
    },
    {
      text: "4K media playback",
      description: "Present your brand in stunning clarity.",
    },
    {
      text: "Advanced analytics & reports",
      description: "Know what works and optimize fast.",
    },
    {
      text: "Priority 24/7 support",
      description: "Instant help whenever your team needs it.",
    },
    {
      text: "Custom branding",
      description: "Keep displays on-brand across locations.",
    },
    {
      text: "API access",
      description: "Integrate with existing tools.",
    },
    {
      text: "Dedicated account manager",
      description: "Personalized onboarding & support.",
    },
  ];

  const testimonials = [
    {
      quote: "We increased foot traffic by 40% after switching to Pickcel. The scheduling and templates are game-changers.",
      author: "Sarah L.",
      role: "Retail Manager",
      rating: 5,
      initials: "SL",
    },
    {
      quote: "Intuitive UI and solid uptime. Perfect for managing multiple stores.",
      author: "Rajesh P.",
      role: "Marketing Head",
      rating: 4,
      initials: "RP",
    },
  ];

  const companyLogos = [
    { name: "Starbucks", initials: "SB" },
    { name: "McDonald's", initials: "M" },
    { name: "Walmart", initials: "W" },
    { name: "Marriott", initials: "M" },
    { name: "Nike", initials: "N" },
    { name: "Target", initials: "T" },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[95vh] max-w-6xl p-0 gap-0">
        <ScrollArea className="max-h-[95vh]">
          <div className="mx-auto p-6 sm:p-10 space-y-10">
            {/* Header Section */}
            <div className="text-center space-y-4">
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
                Choose Your Plan
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Select the perfect plan to power your digital signage experience.
              </p>
              <p className="text-sm text-muted-foreground max-w-xl mx-auto">
                See your message come alive — engage audiences anywhere, anytime.
              </p>
              
              {/* Ratings Row */}
              <div className="flex flex-wrap items-center justify-center gap-4 pt-2 text-sm">
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="h-4 w-4 fill-primary text-primary" />
                    ))}
                  </div>
                  <span className="font-medium text-foreground">4.8/5 on G2</span>
                </div>
                
                <Separator orientation="vertical" className="h-4" />
                
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="h-4 w-4 fill-primary text-primary" />
                    ))}
                  </div>
                  <span className="font-medium text-foreground">4.7/5 on Capterra</span>
                </div>
              </div>
            </div>

            {/* Pricing Cards Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-5xl mx-auto">
              {/* Personal Plan */}
              <Card className="relative overflow-hidden border bg-card shadow-sm hover:shadow-md transition-all duration-200">
                <CardContent className="p-6 space-y-6">
                  {/* Plan Header */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <MonitorSmartphone className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-foreground">Personal</h3>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-5xl font-bold text-foreground">$29</span>
                        <span className="text-lg text-muted-foreground">/month</span>
                      </div>
                      <p className="mt-2 text-sm text-muted-foreground">
                        Perfect for small businesses
                      </p>
                    </div>
                  </div>

                  {/* CTA Section */}
                  <div className="space-y-3">
                    <Button
                      className="w-full"
                      size="lg"
                      data-testid="button-select-personal"
                    >
                      Get Started
                    </Button>
                    <p className="text-xs text-center text-muted-foreground">
                      🎉 14-day free trial. No credit card required. Cancel anytime.
                    </p>
                  </div>

                  {/* Features List */}
                  <div className="space-y-3 pt-2">
                    {personalFeatures.map((feature, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 shrink-0 text-primary mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-foreground">{feature.text}</p>
                          <p className="text-xs text-muted-foreground italic">{feature.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Enterprise Plan */}
              <Card className="relative overflow-hidden border-2 border-primary bg-card shadow-md hover:shadow-lg transition-all duration-200 hover:scale-[1.02]">
                {/* Popular Badge */}
                <div className="absolute right-0 top-0 z-10">
                  <Badge variant="default" className="rounded-none rounded-bl-lg px-3 py-1">
                    Popular
                  </Badge>
                </div>

                <CardContent className="p-6 space-y-6">
                  {/* Plan Header */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <Briefcase className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-foreground">Enterprise</h3>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-5xl font-bold text-foreground">$99</span>
                        <span className="text-lg text-muted-foreground">/month</span>
                      </div>
                      <p className="mt-2 text-sm text-muted-foreground">
                        For growing teams and organizations
                      </p>
                    </div>
                  </div>

                  {/* CTA Section */}
                  <div className="space-y-3">
                    <Button
                      className="w-full ring-2 ring-primary/20"
                      size="lg"
                      data-testid="button-select-enterprise"
                    >
                      Get Started
                    </Button>
                    <p className="text-xs text-center text-muted-foreground">
                      🎉 14-day free trial. No credit card required. Cancel anytime.
                    </p>
                  </div>

                  {/* Features List */}
                  <div className="space-y-3 pt-2">
                    {enterpriseFeatures.map((feature, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 shrink-0 text-primary mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-foreground">{feature.text}</p>
                          <p className="text-xs text-muted-foreground italic">{feature.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Trust Section */}
            <div className="space-y-6 text-center">
              <div className="space-y-4">
                <p className="text-sm font-medium text-muted-foreground">
                  Trusted by 1,200+ businesses across 60 countries.
                </p>

                {/* Company Logos */}
                <div className="flex flex-wrap items-center justify-center gap-3">
                  {companyLogos.map((company, index) => (
                    <div key={index} className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border bg-muted/30">
                      <Avatar className="h-6 w-6 bg-primary/10">
                        <AvatarFallback className="text-xs font-bold text-primary">
                          {company.initials}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium text-foreground">{company.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Testimonials */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-4xl mx-auto pt-4">
                {testimonials.map((testimonial, index) => (
                  <Card key={index} className="bg-muted/50 border-border">
                    <CardContent className="p-6 space-y-4">
                      {/* Star Rating */}
                      <div className="flex">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                        ))}
                      </div>

                      {/* Quote */}
                      <p className="text-sm text-foreground leading-relaxed">
                        "{testimonial.quote}"
                      </p>

                      {/* Author */}
                      <div className="flex items-center gap-3 pt-2">
                        <Avatar className="h-10 w-10 border border-border bg-primary/10">
                          <AvatarFallback className="text-xs font-medium text-primary">
                            {testimonial.initials}
                          </AvatarFallback>
                        </Avatar>
                        <div className="text-left">
                          <p className="text-sm font-medium text-foreground">
                            {testimonial.author}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {testimonial.role}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Footer Section */}
            <div className="space-y-4 pt-6">
              <Separator />
              <p className="text-xs text-center text-muted-foreground">
                All plans include a 14-day free trial. No credit card required. Cancel anytime.
              </p>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
