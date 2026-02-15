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
            <svg className="testimonial-quote-icon-svg" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M11 7.5V14H7.5C7.5 15.3807 8.61929 16.5 10 16.5V18.5C7.51472 18.5 5.5 16.4853 5.5 14V7.5H11ZM18.5 7.5V14H15C15 15.3807 16.1193 16.5 17.5 16.5V18.5C15.0147 18.5 13 16.4853 13 14V7.5H18.5Z" />
            </svg>
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

