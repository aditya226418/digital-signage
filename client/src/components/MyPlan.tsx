import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  AlertCircle,
  Minus,
  Plus,
  Star,
  BadgeCheck,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Zap,
  TrendingUp,
  X,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

// Types
interface Plan {
  id: string;
  name: string;
  tagline: string;
  priceMonthlyPerScreen: number;
  yearlyDiscountPercent: number;
  topBenefits: string[];
  fullBenefits: string[];
  isPopular?: boolean;
}

// Mock Data
const currentUser = {
  name: "Brian Johnson",
  email: "brian@company.com",
  organization: "Acme Digital Solutions",
  trialEndsInDays: 13,
  trialExpiryDate: "October 21, 2025",
  trialIncludedScreens: 1,
};

const plans: Plan[] = [
  {
    id: "professional",
    name: "Professional",
    tagline: "Best for single-location setups",
    priceMonthlyPerScreen: 15,
    yearlyDiscountPercent: 10,
    isPopular: true,
    topBenefits: [
      "Self-management of displays",
      "Access to free media repositories",
      "Built-in graphic design tool (Artboard)",
      "100+ free templates",
    ],
    fullBenefits: [
      "Self-management of displays",
      "Access to free media repositories",
      "Built-in graphic design tool (Artboard)",
      "100+ free templates",
      "60+ content apps & integrations",
      "Composition & playlist creation",
      "Advanced content scheduling",
      "User audit logs & proof-of-play reports",
    ],
  },
  {
    id: "business",
    name: "Business",
    tagline: "Ideal for large or multi-location organizations",
    priceMonthlyPerScreen: 25,
    yearlyDiscountPercent: 10,
    isPopular: false,
    topBenefits: [
      "Everything in Professional, plus",
      "Multi-Factor Authentication (MFA)",
      "4K content support",
      "API access & Zapier integration",
    ],
    fullBenefits: [
      "Everything in Professional, plus:",
      "Multi-Factor Authentication (MFA)",
      "Access to premium apps",
      "4K content support",
      "Advanced playlists",
      "Live Zoom event streaming",
      "Campaign apps",
      "8 GB storage per screen",
      "API access & Zapier integration",
    ],
  },
];

const premiumFeatureHighlights = [
  { icon: Sparkles, text: "Manage unlimited screens effortlessly" },
  { icon: TrendingUp, text: "Get advanced scheduling & analytics" },
  { icon: Zap, text: "Unlock 4K playback & premium integrations" },
  { icon: BadgeCheck, text: "Access 100+ premium templates" },
  { icon: ArrowRight, text: "Multi-Factor Authentication (MFA)" },
  { icon: Star, text: "Priority 24/7 support" },
];

// Helper
const formatCurrency = (amount: number) => `US$${amount.toFixed(2)}`;

export default function MyPlan() {
  const { toast } = useToast();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [billingFrequency, setBillingFrequency] = useState<"monthly" | "yearly">("monthly");
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [deviceCount, setDeviceCount] = useState<number>(1);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [showMissingFeatures, setShowMissingFeatures] = useState(false);

  const trialProgress = ((30 - currentUser.trialEndsInDays) / 30) * 100;

  // Auto-open "See what you're missing" after delay to grab attention
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowMissingFeatures(true);
    }, 750); // 1.5/2 seconds delay

    return () => clearTimeout(timer);
  }, []);

  // Calculate pricing
  const selectedPlanData = plans.find((p) => p.id === selectedPlan);
  const monthlyPricePerScreen = selectedPlanData?.priceMonthlyPerScreen || 0;
  const yearlyPricePerScreen = monthlyPricePerScreen * (1 - (selectedPlanData?.yearlyDiscountPercent || 0) / 100);
  const pricePerScreen = billingFrequency === "monthly" ? monthlyPricePerScreen : yearlyPricePerScreen;
  const totalPrice = pricePerScreen * deviceCount;
  const annualSavings = billingFrequency === "yearly" 
    ? deviceCount * (monthlyPricePerScreen * 12 - yearlyPricePerScreen * 12)
    : 0;

  const handleDeviceCountChange = (delta: number) => {
    setDeviceCount((prev) => Math.max(1, Math.min(999, prev + delta)));
    // Analytics: event('screens_changed', { count: newCount })
  };

  const handleSelectPlan = (planId: string) => {
    setSelectedPlan(planId);
    // Analytics: event('plan_selected', { plan: planId })
  };

  const handleNextStep = () => {
    if (currentStep === 1 && !selectedPlan) {
      toast({
        title: "Please select a plan",
        description: "Choose a plan to continue.",
        variant: "destructive",
      });
      return;
    }
    setCurrentStep((prev) => Math.min(prev + 1, 3));
  };

  const handlePreviousStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleGoToStep = (step: number) => {
    setCurrentStep(step);
  };

  const handleConfirmUpgrade = () => {
    // Analytics: event('confirmation_confirmed', { plan: selectedPlan, screens: deviceCount, total: totalPrice })
    
    toast({
      title: "Redirecting to checkout...",
      description: "You will be redirected to complete your purchase.",
      duration: 3000,
    });

    // Stripe redirect placeholder
    // window.location.href = `/api/checkout?plan=${selectedPlan}&screens=${deviceCount}&billing=${billingFrequency}`
    console.log("Redirecting to Stripe:", { selectedPlan, deviceCount, billingFrequency, totalPrice });

    setTimeout(() => {
      setIsConfirmDialogOpen(false);
      setIsDrawerOpen(false);
      setCurrentStep(1);
    }, 1500);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    // Reset to step 1 when drawer closes
    setTimeout(() => setCurrentStep(1), 300);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
    

      {/* Trial Alert */}
      <Alert className="border-orange-500/40 bg-orange-500/5">
        <AlertDescription className="flex items-center justify-between gap-4 flex-wrap">
          <span className="text-sm">
            ⚠️ {currentUser.trialEndsInDays} days left in your free trial. Upgrade now to avoid
            interruption.
          </span>
          <Button size="sm" onClick={() => setIsDrawerOpen(true)}>
            Upgrade
          </Button>
        </AlertDescription>
      </Alert>

      {/* Current Plan Card */}
      <Card className="border-border/40">
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-primary/5 text-primary font-semibold text-lg">
                {currentUser.name.charAt(0)}
              </div>
              <div>
                <p className="font-semibold">{currentUser.name}</p>
                <p className="text-sm text-muted-foreground">{currentUser.organization}</p>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <Badge variant="secondary" className="text-sm">
                Trial
              </Badge>
              <div className="flex items-center gap-2">
                <Progress value={trialProgress} className="h-2 w-24" />
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  {currentUser.trialEndsInDays}/30 days
                </span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground mb-2">Trial includes:</p>
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-1.5">
                <BadgeCheck className="h-4 w-4 text-primary" />
                <span>{currentUser.trialIncludedScreens} screen</span>
              </div>
              <div className="flex items-center gap-1.5">
                <BadgeCheck className="h-4 w-4 text-primary" />
                <span>Basic templates</span>
              </div>
              <div className="flex items-center gap-1.5">
                <BadgeCheck className="h-4 w-4 text-primary" />
                <span>Email support</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              Expires on {currentUser.trialExpiryDate}
            </p>
          </div>

          <Separator />

          {/* Collapsible - What You're Missing */}
          <Collapsible open={showMissingFeatures} onOpenChange={setShowMissingFeatures}>
            <CollapsibleTrigger className="flex items-center justify-between w-full group">
              <motion.span
                className="text-sm font-medium text-primary group-hover:text-primary/80"
                animate={{
                  x: showMissingFeatures ? [0, 3, 0] : 0,
                }}
                transition={{
                  duration: 0.5,
                  ease: "easeInOut",
                }}
              >
                Get more with premium
              </motion.span>
              <motion.div
                animate={{ rotate: showMissingFeatures ? 180 : 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <ArrowRight className="h-4 w-4 text-primary rotate-90" />
              </motion.div>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <motion.div
                initial="hidden"
                animate="visible"
                variants={{
                  visible: {
                    transition: {
                      staggerChildren: 0.08,
                      delayChildren: 0.1,
                    },
                  },
                }}
                className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3"
              >
                {premiumFeatureHighlights.map((feature, idx) => {
                  const Icon = feature.icon;
                  return (
                    <motion.div
                      key={idx}
                      variants={{
                        hidden: { opacity: 0, x: -20, scale: 0.95 },
                        visible: { opacity: 1, x: 0, scale: 1 },
                      }}
                      transition={{
                        duration: 0.4,
                        ease: "easeOut",
                      }}
                      className="flex items-center gap-3 text-sm"
                    >
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                        <Icon className="h-4 w-4 text-primary" />
                      </div>
                      <span>{feature.text}</span>
                    </motion.div>
                  );
                })}
              </motion.div>
            </CollapsibleContent>
          </Collapsible>
        </CardContent>
      </Card>

      {/* Primary CTA */}
      <div className="text-center space-y-3 py-8">
        <Button size="lg" className="px-8" onClick={() => setIsDrawerOpen(true)}>
          <Sparkles className="mr-2 h-5 w-5" />
          Explore Upgrade Options
        </Button>
        <p className="text-sm text-muted-foreground">
          See which plan suits your business best.
        </p>
      </div>

      {/* Upgrade Drawer */}
      <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <DrawerContent className="max-h-[96vh]">
          <div className="mx-auto w-full max-w-5xl flex flex-col h-full">
            {/* Header with Step Indicator */}
            <DrawerHeader className="border-b">
              <div className="flex items-center justify-between">
                <DrawerClose asChild>
                  <Button variant="ghost" onClick={handleCloseDrawer}>
                    <X className="h-4 w-4 mr-2" />
                    Close
                  </Button>
                </DrawerClose>
                
                {/* Step Indicator */}
                <div className="flex items-center gap-2">
                  {[1, 2, 3].map((step) => (
                    <div key={step} className="flex items-center">
                      <div
                        className={cn(
                          "flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition-all",
                          currentStep === step
                            ? "bg-primary text-primary-foreground"
                            : currentStep > step
                            ? "bg-primary/20 text-primary"
                            : "bg-muted text-muted-foreground"
                        )}
                      >
                        {currentStep > step ? <CheckCircle2 className="h-4 w-4" /> : step}
                      </div>
                      {step < 3 && (
                        <div
                          className={cn(
                            "w-12 h-0.5 mx-1",
                            currentStep > step ? "bg-primary" : "bg-muted"
                          )}
                        />
                      )}
                    </div>
                  ))}
                </div>

                <div className="w-10" /> {/* Spacer for alignment */}
              </div>
              
              <DrawerTitle className="text-2xl text-center mt-4">
                {currentStep === 1 && "Choose Your Plan"}
                {currentStep === 2 && "Select Screen Count"}
                {currentStep === 3 && "Review Your Order"}
              </DrawerTitle>
            </DrawerHeader>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6">
              <AnimatePresence mode="wait">
                {currentStep === 1 && (
                  <Step1PlanSelection
                    key="step1"
                    billingFrequency={billingFrequency}
                    setBillingFrequency={setBillingFrequency}
                    selectedPlan={selectedPlan}
                    handleSelectPlan={handleSelectPlan}
                    plans={plans}
                  />
                )}
                {currentStep === 2 && (
                  <Step2ScreenCount
                    key="step2"
                    selectedPlanData={selectedPlanData}
                    billingFrequency={billingFrequency}
                    deviceCount={deviceCount}
                    handleDeviceCountChange={handleDeviceCountChange}
                    pricePerScreen={pricePerScreen}
                    totalPrice={totalPrice}
                    annualSavings={annualSavings}
                    onChangePlan={() => handleGoToStep(1)}
                  />
                )}
                {currentStep === 3 && (
                  <Step3OrderSummary
                    key="step3"
                    selectedPlanData={selectedPlanData}
                    billingFrequency={billingFrequency}
                    deviceCount={deviceCount}
                    pricePerScreen={pricePerScreen}
                    totalPrice={totalPrice}
                    annualSavings={annualSavings}
                    onChangePlan={() => handleGoToStep(1)}
                    onChangeScreens={() => handleGoToStep(2)}
                  />
                )}
              </AnimatePresence>
            </div>

            {/* Footer with Navigation */}
            <div className="border-t bg-card p-4 sm:p-6">
              <div className="flex items-center justify-between gap-4">
                {currentStep > 1 ? (
                  <Button variant="outline" onClick={handlePreviousStep}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                  </Button>
                ) : (
                  <DrawerClose asChild>
                    <Button variant="outline" onClick={handleCloseDrawer}>Cancel</Button>
                  </DrawerClose>
                )}

                {currentStep === 1 && (
                  <Button
                    onClick={handleNextStep}
                    disabled={!selectedPlan}
                    className="ml-auto"
                  >
                    Continue
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                )}

                {currentStep === 2 && (
                  <Button
                    onClick={handleNextStep}
                    className="ml-auto"
                  >
                    Continue
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                )}

                {currentStep === 3 && (
                  <Button
                    onClick={() => {
                      // Placeholder for payment action
                      // This will trigger Stripe checkout or payment flow
                      toast({
                        title: "Payment initiated",
                        description: "Payment integration coming soon...",
                      });
                    }}
                    className="ml-auto"
                  >
                    Make Payment
                  </Button>
                )}
              </div>
            </div>
          </div>
        </DrawerContent>
      </Drawer>

      {/* Confirmation Dialog */}
      <Dialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm your subscription</DialogTitle>
            <DialogDescription>
              Review your selection before proceeding to payment.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Plan</span>
                <span className="font-semibold">{selectedPlanData?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Billing</span>
                <span className="font-semibold capitalize">{billingFrequency}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Screens</span>
                <span className="font-semibold">{deviceCount}</span>
              </div>
              <Separator />
              <div className="flex justify-between items-center">
                <span className="font-medium">Total</span>
                <div className="text-right">
                  <p className="text-xl font-bold text-primary">{formatCurrency(totalPrice)}</p>
                  <p className="text-xs text-muted-foreground">
                    per {billingFrequency === "monthly" ? "month" : "year"}
                  </p>
                </div>
              </div>
            </div>

            <Alert className="border-primary/20 bg-primary/5">
              <AlertDescription className="text-xs">
                You'll be redirected to our secure payment page. Your trial will continue until you
                complete payment.
              </AlertDescription>
            </Alert>
          </div>

          <DialogFooter className="sm:justify-between">
            <Button variant="outline" onClick={() => setIsConfirmDialogOpen(false)}>
              Go Back
            </Button>
            <Button onClick={handleConfirmUpgrade}>Confirm and Continue</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Step 1: Plan Selection Component
interface Step1Props {
  billingFrequency: "monthly" | "yearly";
  setBillingFrequency: (value: "monthly" | "yearly") => void;
  selectedPlan: string | null;
  handleSelectPlan: (planId: string) => void;
  plans: Plan[];
}

function Step1PlanSelection({
  billingFrequency,
  setBillingFrequency,
  selectedPlan,
  handleSelectPlan,
  plans,
}: Step1Props) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Billing Toggle */}
      <div className="flex justify-center">
        <div className="inline-flex items-center rounded-lg bg-muted p-1">
          <button
            onClick={() => setBillingFrequency("monthly")}
            className={cn(
              "px-4 py-2 rounded-md text-sm font-medium transition-all",
              billingFrequency === "monthly"
                ? "bg-background shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingFrequency("yearly")}
            className={cn(
              "px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2",
              billingFrequency === "yearly"
                ? "bg-background shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Yearly
            <Badge variant="secondary" className="text-xs">
              Save 10%
            </Badge>
          </button>
        </div>
      </div>

      {/* Plan Cards Side-by-Side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {plans.map((plan, index) => {
          const price =
            billingFrequency === "monthly"
              ? plan.priceMonthlyPerScreen
              : plan.priceMonthlyPerScreen * (1 - plan.yearlyDiscountPercent / 100);
          const isSelected = selectedPlan === plan.id;

          return (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{
                opacity: isSelected === false && selectedPlan !== null ? 0.6 : 1,
                scale: isSelected ? 1.02 : 1,
                y: 0,
              }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
            >
              <Card
                className={cn(
                  "relative transition-all duration-300 h-full",
                  isSelected && "ring-2 ring-primary shadow-lg"
                )}
              >
                {plan.isPopular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                    <Badge className="text-xs px-3 shadow-md">Most Popular</Badge>
                  </div>
                )}

                <CardHeader className="pb-4">
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{plan.tagline}</p>
                  <div className="pt-3">
                    <motion.div
                      key={`${plan.id}-${billingFrequency}`}
                      initial={{ scale: 0.95 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.2 }}
                      className="flex items-baseline gap-2"
                    >
                      <span className="text-3xl font-bold">{formatCurrency(price)}</span>
                      <span className="text-sm text-muted-foreground">/screen</span>
                    </motion.div>
                    <p className="text-xs text-muted-foreground mt-1">
                      per {billingFrequency === "monthly" ? "month" : "year"}
                    </p>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <ul className="space-y-2.5">
                    {plan.topBenefits.map((benefit, idx) => (
                      <motion.li
                        key={idx}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 + idx * 0.05 }}
                        className="flex items-start gap-2"
                      >
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-primary mt-0.5" />
                        <span className="text-sm">{benefit}</span>
                      </motion.li>
                    ))}
                  </ul>

                  <Collapsible>
                    <CollapsibleTrigger className="text-sm text-primary hover:text-primary/80 flex items-center gap-1">
                      View all {plan.fullBenefits.length} features
                      <ArrowRight className="h-3 w-3 rotate-90" />
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <ul className="space-y-2 mt-3 pt-3 border-t">
                        {plan.fullBenefits.slice(plan.topBenefits.length).map((benefit, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <CheckCircle2 className="h-4 w-4 shrink-0 text-primary mt-0.5" />
                            <span className="text-sm">{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </CollapsibleContent>
                  </Collapsible>

                  <Button
                    className="w-full mt-4"
                    variant={isSelected ? "default" : "outline"}
                    onClick={() => handleSelectPlan(plan.id)}
                  >
                    {isSelected ? (
                      <>
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                        Selected
                      </>
                    ) : (
                      `Select ${plan.name}`
                    )}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}

// Step 2: Screen Count Component
interface Step2Props {
  selectedPlanData: Plan | undefined;
  billingFrequency: "monthly" | "yearly";
  deviceCount: number;
  handleDeviceCountChange: (delta: number) => void;
  pricePerScreen: number;
  totalPrice: number;
  annualSavings: number;
  onChangePlan: () => void;
}

function Step2ScreenCount({
  selectedPlanData,
  billingFrequency,
  deviceCount,
  handleDeviceCountChange,
  pricePerScreen,
  totalPrice,
  annualSavings,
  onChangePlan,
}: Step2Props) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="max-w-2xl mx-auto space-y-6"
    >
      {/* Selected Plan Summary */}
      <Card className="bg-muted/30">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Selected Plan</p>
              <p className="font-semibold">{selectedPlanData?.name}</p>
              <p className="text-xs text-muted-foreground capitalize">
                {billingFrequency} billing
              </p>
            </div>
            <Button variant="ghost" size="sm" onClick={onChangePlan} className="text-primary">
              Change plan
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Device Stepper */}
      <Card>
        <CardHeader>
          <CardTitle className="text-center">How many screens do you need?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-center gap-6">
            <Button
              variant="outline"
              size="icon"
              className="h-12 w-12"
              onClick={() => handleDeviceCountChange(-1)}
              disabled={deviceCount <= 1}
            >
              <Minus className="h-5 w-5" />
            </Button>
            <motion.div
              key={deviceCount}
              initial={{ scale: 1.2 }}
              animate={{ scale: 1 }}
              className="text-center min-w-[100px]"
            >
              <div className="text-5xl font-bold">{deviceCount}</div>
              <div className="text-sm text-muted-foreground">
                {deviceCount === 1 ? "screen" : "screens"}
              </div>
            </motion.div>
            <Button
              variant="outline"
              size="icon"
              className="h-12 w-12"
              onClick={() => handleDeviceCountChange(1)}
              disabled={deviceCount >= 999}
            >
              <Plus className="h-5 w-5" />
            </Button>
          </div>

          {/* Live Price Calculation */}
          <div className="bg-muted/50 rounded-lg p-6 text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              {deviceCount} {deviceCount === 1 ? "screen" : "screens"} × {formatCurrency(pricePerScreen)} ={" "}
            </p>
            <motion.p
              key={totalPrice}
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              className="text-4xl font-bold text-primary"
            >
              {formatCurrency(totalPrice)}
            </motion.p>
            <p className="text-sm text-muted-foreground">
              per {billingFrequency === "monthly" ? "month" : "year"}
            </p>
            {annualSavings > 0 && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-sm text-primary font-medium pt-2"
              >
                💰 Save {formatCurrency(annualSavings)} annually
              </motion.p>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// Step 3: Order Summary Component
interface Step3Props {
  selectedPlanData: Plan | undefined;
  billingFrequency: "monthly" | "yearly";
  deviceCount: number;
  pricePerScreen: number;
  totalPrice: number;
  annualSavings: number;
  onChangePlan: () => void;
  onChangeScreens: () => void;
}

function Step3OrderSummary({
  selectedPlanData,
  billingFrequency,
  deviceCount,
  pricePerScreen,
  totalPrice,
  annualSavings,
  onChangePlan,
  onChangeScreens,
}: Step3Props) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="max-w-2xl mx-auto space-y-6"
    >
      {/* Order Summary Card */}
      <Card>
        <CardHeader>
          <CardTitle>Order Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              visible: {
                transition: {
                  staggerChildren: 0.1,
                },
              },
            }}
            className="space-y-4"
          >
            <motion.div
              variants={{
                hidden: { opacity: 0, x: -20 },
                visible: { opacity: 1, x: 0 },
              }}
              className="flex items-center justify-between"
            >
              <div>
                <p className="text-sm text-muted-foreground">Plan</p>
                <p className="font-semibold flex items-center gap-2">
                  {selectedPlanData?.name}
                  {selectedPlanData?.isPopular && (
                    <Badge variant="secondary" className="text-xs">
                      Popular
                    </Badge>
                  )}
                </p>
              </div>
              <Button variant="ghost" size="sm" onClick={onChangePlan} className="text-primary">
                Change
              </Button>
            </motion.div>

            <Separator />

            <motion.div
              variants={{
                hidden: { opacity: 0, x: -20 },
                visible: { opacity: 1, x: 0 },
              }}
              className="flex items-center justify-between"
            >
              <div>
                <p className="text-sm text-muted-foreground">Billing frequency</p>
                <p className="font-semibold capitalize">{billingFrequency}</p>
              </div>
            </motion.div>

            <Separator />

            <motion.div
              variants={{
                hidden: { opacity: 0, x: -20 },
                visible: { opacity: 1, x: 0 },
              }}
              className="flex items-center justify-between"
            >
              <div>
                <p className="text-sm text-muted-foreground">Number of screens</p>
                <p className="font-semibold">{deviceCount}</p>
              </div>
              <Button variant="ghost" size="sm" onClick={onChangeScreens} className="text-primary">
                Change
              </Button>
            </motion.div>

            <Separator />

            <motion.div
              variants={{
                hidden: { opacity: 0, x: -20 },
                visible: { opacity: 1, x: 0 },
              }}
              className="space-y-2"
            >
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Price per screen</span>
                <span>{formatCurrency(pricePerScreen)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatCurrency(totalPrice)}</span>
              </div>
              {annualSavings > 0 && (
                <div className="flex justify-between text-sm text-primary">
                  <span>Annual savings</span>
                  <span>-{formatCurrency(annualSavings)}</span>
                </div>
              )}
            </motion.div>

            <Separator />

            <motion.div
              variants={{
                hidden: { opacity: 0, scale: 0.9 },
                visible: { opacity: 1, scale: 1 },
              }}
              className="flex items-center justify-between pt-2"
            >
              <span className="text-lg font-semibold">Total</span>
              <div className="text-right">
                <p className="text-3xl font-bold text-primary">{formatCurrency(totalPrice)}</p>
                <p className="text-xs text-muted-foreground">
                  per {billingFrequency === "monthly" ? "month" : "year"}
                </p>
              </div>
            </motion.div>
          </motion.div>
        </CardContent>
      </Card>

      {/* Trust Indicators */}
      <Card className="bg-muted/30">
        <CardContent className="p-4 space-y-3">
          <div className="flex flex-wrap items-center justify-center gap-3 text-sm">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-primary text-primary" />
              <span className="font-medium">4.8/5 on G2</span>
            </div>
            <Separator orientation="vertical" className="h-4" />
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-primary text-primary" />
              <span className="font-medium">4.7/5 on Capterra</span>
            </div>
          </div>
          <p className="text-xs text-center text-muted-foreground">
            14-day free trial • Cancel anytime • Trusted by 1,200+ businesses
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}
