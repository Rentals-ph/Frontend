import './TestimonialCard.css'

interface TestimonialCardProps {
  quoteIcon: string
  avatar: string
  text: string
  name: string
  role: string
  secondName?: string
  secondRole?: string
  decorativeVector: string
  style: 'style-1' | 'style-2' | 'style-3'
}

function TestimonialCard({
  quoteIcon,
  avatar,
  text,
  name,
  role,
  secondName,
  secondRole,
  decorativeVector,
  style,
}: TestimonialCardProps) {
  return (
    <article className={`testimonial-card testimonial-card-${style}`}>
      <img
        src={quoteIcon}
        alt="Quote icon"
        className="testimonial-quote-icon"
      />
      <div className="testimonial-content-wrapper">
        <p className="testimonial-text">{text}</p>
      </div>
      <img
        src={avatar}
        alt={name}
        className="testimonial-avatar"
      />
      <div className="testimonial-bottom-section">
        <img
          src={decorativeVector}
          alt="Decorative vector"
          className="testimonial-decorative-vector"
        />
        {style === 'style-1' && secondName ? (
          <div className="testimonial-names-group">
            <div className="testimonial-name-group">
              <h3 className="testimonial-name">{name}</h3>
              <p className="testimonial-role">{role}</p>
            </div>
            <div className="testimonial-name-group">
              <h3 className="testimonial-name">{secondName}</h3>
              <p className="testimonial-role">{secondRole}</p>
            </div>
          </div>
        ) : (
          <div className="testimonial-name-group">
            <h3 className="testimonial-name">{name}</h3>
            <p className="testimonial-role">{role}</p>
          </div>
        )}
      </div>
    </article>
  )
}

export default TestimonialCard

