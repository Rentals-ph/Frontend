import TestimonialCard from './TestimonialCard'
import './Testimonials.css'

function Testimonials() {
  return (
    <section className="testimonials-section" id="testimonials">
      <div className="max-w-6xl mx-auto">
        <h2 className="testimonials-title">Testimonials</h2>
        <p className="section-subtitle mb-12">
          Highlights of satisfied customers through our services
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <TestimonialCard
            quoteIcon="/assets/quote-icon-2.svg"
            avatar="/assets/testimonial-elaine.png"
            text="When it comes to reliability, Rent.ph stands head and shoulders above the rest. Their team of rent managers goes above and beyond to ensure a smooth rental process. I cannot express my recommendation for them enough. They are truly exceptional!"
            name="Elaine Mae Ofiaza"
            role="Client"
            decorativeVector="/assets/wave-vector-2.svg"
            style="style-2"
          />

          <TestimonialCard
            quoteIcon="/assets/quote-icon-1.svg"
            avatar="/assets/testimonial-rica.png"
            text="We are incredibly grateful to Filipino Homes for providing this extraordinary opportunity for us to learn additional expertise from Harvard Leadership Techniques graduats and to enjoy the journey of success with team MINDANAO."
            name="Rica Grate"
            role="Rent Manager"
            decorativeVector="/assets/wave-vector-1.svg"
            style="style-3"
          />

          <TestimonialCard
            quoteIcon="/assets/quote-icon-3.svg"
            avatar="/assets/testimonial-javie.png"
            text="Rent.ph has been an invaluable asset in our rental management journey. This platform has simplified and streamlined our operations, allowing us to effectively manage our rental properties with ease."
            name="Grandy & Fave"
            role="Rent Manager"
            decorativeVector="/assets/wave-vector-3.svg"
            style="style-3"
          />
        </div>

        {/* Carousel indicators */}
        <div className="carousel-indicators">
          <button className="carousel-indicator active" aria-label="Slide 1" />
          <button className="carousel-indicator" aria-label="Slide 2" />
          <button className="carousel-indicator" aria-label="Slide 3" />
          <button className="carousel-indicator" aria-label="Slide 4" />
          <button className="carousel-indicator" aria-label="Slide 5" />
        </div>
      </div>
    </section>
  )
}

export default Testimonials

