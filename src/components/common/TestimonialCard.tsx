import './TestimonialCard.css'

interface TestimonialCardProps {
  avatar: string
  text: string
  name: string
  role: string
}

function TestimonialCard({
  avatar,
  text,
  name,
  role,
}: TestimonialCardProps) {
  return (
    <article className="testimonial-card">
      <div className="testimonial-image-wrapper">
        <img
          src={avatar}
          alt={name}
          className="testimonial-image"
        />
        <div className="testimonial-quote-icon-overlay">
          <div className="testimonial-quote-circle-small">
            <img 
              src="/assets/quote-icon-1.svg" 
              alt="Quote icon" 
              className="testimonial-quote-icon-svg"
            />
          </div>
        </div>
      </div>
      <div className="testimonial-divider"></div>
      <div className="testimonial-content">
        <p className="testimonial-text">{text}</p>
        <div className="testimonial-author">
          <h3 className="testimonial-name">{name}</h3>
          <p className="testimonial-role">{role}</p>
        </div>
      </div>
    </article>
  )
}

export default TestimonialCard

