import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CalendarCheck, Check } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Generate time slots from 9:00 AM to 5:00 PM in 30-minute intervals
const generateTimeSlots = () => {
  const slots = [];
  for (let hour = 9; hour < 17; hour++) {
    for (let minute of [0, 30]) {
      const time = new Date();
      time.setHours(hour, minute, 0, 0);
      const timeString = time.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
      slots.push(timeString);
    }
  }
  return slots;
};

const timeSlots = generateTimeSlots();

type BookingStatus = "idle" | "booking" | "success";

export default function OnboardingBooking() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [bookingStatus, setBookingStatus] = useState<BookingStatus>("idle");

  const handleBookSession = () => {
    if (!selectedDate || !selectedTime) return;

    setBookingStatus("booking");

    // Simulate booking API call
    setTimeout(() => {
      setBookingStatus("success");

      // Auto-close modal after 3 seconds
      setTimeout(() => {
        handleCloseModal();
      }, 3000);
    }, 2000);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    // Reset form after animation completes
    setTimeout(() => {
      setBookingStatus("idle");
      setSelectedDate(undefined);
      setSelectedTime("");
      setPhoneNumber("");
    }, 300);
  };

  const isFormValid = selectedDate && selectedTime && phoneNumber.trim();

  return (
    <>
      {/* Compact Card for Expanded Sidebar */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
        className="group-data-[collapsible=icon]:hidden"
      >
        <Card className="relative overflow-hidden border border-primary/20 bg-gradient-to-br from-primary/5 via-background to-background shadow-sm hover:shadow-lg hover:border-primary/30 transition-all duration-300">
          <div className="p-4 space-y-3">
            {/* Icon and Title Row */}
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-sm">
                <CalendarCheck className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-foreground leading-tight">
                  Get started with a free 1:1 session
                </h3>
              </div>
            </div>

            {/* Description */}
            <p className="text-xs text-muted-foreground leading-relaxed pl-0.5">
              30-minute personalized onboarding with our team.
            </p>

            {/* CTA Button */}
            <Button
              size="sm"
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium shadow-sm hover:shadow transition-all"
              onClick={() => setIsModalOpen(true)}
            >
              Book Now
            </Button>
          </div>
        </Card>
      </motion.div>

    

      {/* Booking Modal */}
      <Dialog open={isModalOpen} onOpenChange={handleCloseModal}>
        <DialogContent className={selectedDate && bookingStatus !== "success" ? "sm:max-w-[600px]" : "sm:max-w-[420px]"}>
          {bookingStatus === "success" ? (
            // Success State
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="py-8 text-center"
            >
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
                <Check className="h-8 w-8 text-green-600 dark:text-green-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Session Booked!</h3>
              <p className="text-muted-foreground">
                You'll get a reminder soon. We look forward to helping you get
                started with Pickcel!
              </p>
            </motion.div>
          ) : (
            // Booking Form State
            <>
              <DialogHeader className="pb-3">
                <DialogTitle className="text-lg">
                  Free onboarding session with our experts
                </DialogTitle>
                <DialogDescription className="text-sm">
                  Choose a convenient time to get started with Pickcel.
                </DialogDescription>
              </DialogHeader>

              <div className={`flex gap-6 ${!selectedDate ? "justify-center" : ""}`}>
                {/* Calendar - Always Visible */}
                <div className="flex-shrink-0">
                  <Label className="text-sm font-medium mb-2 block">Select Date</Label>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={(date) =>
                      date < new Date() || date < new Date("1900-01-01")
                    }
                    initialFocus
                    className="rounded-md border"
                  />
                </div>

                {/* Time and Phone Fields - Show after date selection */}
                {selectedDate && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex-1 space-y-4 pt-8"
                  >
                    {/* Time Selection */}
                    <div className="space-y-2">
                      <Label htmlFor="time-select" className="text-sm font-medium">
                        Select Time
                      </Label>
                      <Select value={selectedTime} onValueChange={setSelectedTime}>
                        <SelectTrigger id="time-select">
                          <SelectValue placeholder="Choose a time slot" />
                        </SelectTrigger>
                        <SelectContent>
                          {timeSlots.map((slot) => (
                            <SelectItem key={slot} value={slot}>
                              {slot}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Phone Number */}
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-sm font-medium">
                        Phone Number <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+1 (555) 000-0000"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        required
                      />
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-2 justify-end pt-4 border-t mt-4">
                <Button
                  variant="outline"
                  onClick={handleCloseModal}
                  disabled={bookingStatus === "booking"}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleBookSession}
                  disabled={!isFormValid || bookingStatus === "booking"}
                >
                  {bookingStatus === "booking" ? "Booking..." : "Book Session"}
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

