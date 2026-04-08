import { BookingForm } from "@/components/booking/booking-form";
import { BookHeroSection } from "@/components/pages/book/book-hero-section";

export function BookPageView() {
  return (
    <>
      <BookHeroSection />
      <section className="section-shell pb-24">
        <BookingForm />
      </section>
    </>
  );
}
