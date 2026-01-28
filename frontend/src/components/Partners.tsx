import './Partners.css'

function Partners() {
  return (
    <section className="partners-section">
      <div className="partners-container">
        <h2 className="partners-title">Our Partners</h2>
        <div className="partners-grid">
          <div >
            <img
              src="/assets/partner1.svg"
              alt="Partner 1"
              className="partner-logo"
            />
          </div>
          <div>
            <img
              src="/assets/partner2.svg"
              alt="Partner 2"
              className="partner-logo"
            />
          </div>
          <div >
            <img
              src="/assets/partner3.svg"
              alt="Partner 3"
              className="partner-logo"
            />
          </div>
          <div >
            <img
              src="/assets/partner1.svg"
              alt="Partner 4"
              className="partner-logo"
            />
          </div>
        </div>
        <div className="partner5-container">
          <img
            src="/assets/partner5.svg"
            alt="Partner 5"
            className="partner5-image"
          />
        </div>
      </div>
    </section>
  )
}

export default Partners