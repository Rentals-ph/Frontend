import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import PageHeader from '../components/layout/PageHeader'
import './NewsPage.css'

function NewsPage() {
  // Category colors mapping
  const categoryColors: { [key: string]: string } = {
    'Business': '#4A90E2',
    'Economy': '#50C878',
    'Technology': '#9B59B6',
    'Politics': '#E74C3C',
    'Health': '#F39C12',
    'Sports': '#3498DB',
    'Entertainment': '#E91E63',
    'Science': '#00BCD4'
  }

  const getCategoryColor = (category: string) => {
    return categoryColors[category] || '#999999'
  }

  const featuredNews = [
    {
      id: 1,
      title: 'Scientist Discover Promising New Treatment for Disease',
      author: 'Maria Santos',
      date: 'January 15, 2026',
      image: '/assets/property-main.png'
    },
    {
      id: 2,
      title: 'New Economic Policies Show Positive Impact on Local Markets',
      author: 'John Reyes',
      date: 'January 14, 2026',
      image: '/assets/property-main.png'
    },
    {
      id: 3,
      title: 'Tech Innovation Drives Real Estate Market Growth',
      author: 'Maria Santos',
      date: 'January 13, 2026',
      image: '/assets/property-main.png'
    },
    {
      id: 4,
      title: 'Government Announces New Housing Development Plans',
      author: 'Ana Garcia',
      date: 'January 12, 2026',
      image: '/assets/property-main.png'
    },
    {
      id: 5,
      title: 'Healthcare Facilities Expand Across Metro Manila',
      author: 'Maria Santos',
      date: 'January 11, 2026',
      image: '/assets/property-main.png'
    }
  ]

  const column2Data = {
    largeCard: {
      id: 1,
      category: 'Politics',
      title: 'Popular Tourist Destination Implements New Entry Rules',
      author: 'Maria Santos',
      date: 'January 15, 2026',
      image: '/assets/property-main.png'
    },
    mediumCards: [
      {
        id: 2,
        title: 'Local Community Rallies to Support Flood Victims',
        author: 'Maria Santos',
        date: 'January 15, 2026',
        image: '/assets/property-main.png'
      },
      {
        id: 3,
        title: 'Wildlife Conservation Efforts Show Positive Results',
        author: 'Maria Santos',
        date: 'January 15, 2026',
        image: '/assets/property-main.png'
      }
    ],
    smallerArticles: [
      {
        id: 4,
        category: 'Business',
        title: 'Local Community Rallies to Support Flood Victims',
        author: 'Maria Santos',
        date: 'January 15, 2026',
        image: '/assets/property-main.png'
      },
      {
        id: 5,
        category: 'Economy',
        title: 'Wildlife Conservation Efforts Show Positive Results',
        author: 'John Reyes',
        date: 'January 14, 2026',
        image: '/assets/property-main.png'
      },
      {
        id: 6,
        category: 'Technology',
        title: 'New AI Tools Transform Property Management',
        author: 'Ana Garcia',
        date: 'January 13, 2026',
        image: '/assets/property-main.png'
      },
      {
        id: 7,
        category: 'Politics',
        title: 'City Council Approves New Zoning Regulations',
        author: 'Maria Santos',
        date: 'January 12, 2026',
        image: '/assets/property-main.png'
      },
      {
        id: 8,
        category: 'Health',
        title: 'Public Health Initiative Reaches Milestone',
        author: 'John Reyes',
        date: 'January 11, 2026',
        image: '/assets/property-main.png'
      }
    ]
  }

  const column3Data = {
    mediumCard: {
      id: 1,
      title: 'Local Community Rallies to Support Flood Victims',
      author: 'Maria Santos',
      date: 'January 15, 2026',
      image: '/assets/property-main.png'
    },
    smallerArticles: [
      {
        id: 2,
        category: 'Politics',
        title: 'New Legislation Affects Property Owners',
        author: 'Ana Garcia',
        date: 'January 15, 2026',
        image: '/assets/property-main.png'
      },
      {
        id: 3,
        category: 'Health',
        title: 'Medical Facilities Upgrade Infrastructure',
        author: 'Maria Santos',
        date: 'January 14, 2026',
        image: '/assets/property-main.png'
      },
      {
        id: 4,
        category: 'Business',
        title: 'Startup Ecosystem Thrives in Metro Manila',
        author: 'John Reyes',
        date: 'January 13, 2026',
        image: '/assets/property-main.png'
      },
      {
        id: 5,
        category: 'Technology',
        title: 'Smart City Initiatives Gain Momentum',
        author: 'Ana Garcia',
        date: 'January 12, 2026',
        image: '/assets/property-main.png'
      },
      {
        id: 6,
        category: 'Economy',
        title: 'Economic Growth Exceeds Expectations',
        author: 'Maria Santos',
        date: 'January 11, 2026',
        image: '/assets/property-main.png'
      }
    ]
  }

  return (
    <div className="news-page">
      <Navbar />

      {/* Page Header */}
      <PageHeader title="NEWS" />

      {/* Main Content */}
      <main className="news-main-content">
        <div className="news-content-layout">
          {/* Left Column - Featured News */}
          <div className="news-featured-column">
            <h2 className="news-section-title">Featured News</h2>
            <div className="featured-news-list">
              {featuredNews.slice(0, 3).map((article) => (
                <article key={article.id} className="featured-news-item">
                  <div className="featured-news-image">
                    <img src={article.image} alt={article.title} />
                  </div>
                  <div className="featured-news-content">
                    <h3 className="featured-news-title">{article.title}</h3>
                    <div className="featured-news-meta">
                      <span className="news-author">{article.author}</span>
                      <span className="news-date">{article.date}</span>
                    </div>
                  </div>
                </article>
                
              ))}
              <a href="https://news.example.com/featured" target="_blank" rel="noopener noreferrer" className="news-see-more-link">
              View More News →
            </a>
            </div>
            
            <div className="news-advertisement">
              <span className="ad-text">ADVERTISEMENT</span>
            </div>
            
          </div>

          {/* Second Column - Large Card, Two Medium Cards, Smaller Articles */}
          <div className="news-column-2">
            <h2 className="news-section-title">Editors Choice</h2>
            
            {/* Large Featured Card */}
            <article className="column2-large-card">
              <div className="column2-large-image">
                <img src={column2Data.largeCard.image} alt={column2Data.largeCard.title} />
                <div className="column2-large-overlay">
                  <span className="column2-category" style={{ color: getCategoryColor(column2Data.largeCard.category) }}>• {column2Data.largeCard.category}</span>
                  <h3 className="column2-large-title">{column2Data.largeCard.title}</h3>
                  <div className="column2-large-meta">
                    <span className="news-author">{column2Data.largeCard.author}</span>
                    <span className="news-date">{column2Data.largeCard.date}</span>
                  </div>
                </div>
              </div>
            </article>

            {/* Two Medium Cards Side by Side */}
            <div className="column2-medium-cards">
              {column2Data.mediumCards.map((article) => (
                <article key={article.id} className="column2-medium-card">
                  <div className="column2-medium-image">
                    <img src={article.image} alt={article.title} />
                  </div>
                  <div className="column2-medium-content">
                    <h4 className="column2-medium-title">{article.title}</h4>
                    <div className="column2-medium-meta">
                      <span className="news-author">{article.author}</span>
                      <span className="news-date">{article.date}</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* Smaller Articles */}
            <div className="column2-small-articles">
              {column2Data.smallerArticles.slice(0, 3).map((article) => (
                <article key={article.id} className="column2-small-article">
                  <div className="column2-small-content">
                    <span className="column2-small-category" style={{ color: getCategoryColor(article.category) }}>• {article.category}</span>
                    <h5 className="column2-small-title">{article.title}</h5>
                    <div className="column2-small-meta">
                      <span className="news-author">{article.author}</span>
                      <span className="news-date">{article.date}</span>
                    </div>
                  </div>
                  <div className="column2-small-image">
                    <img src={article.image} alt={article.title} />
                  </div>
                </article>
              ))}
            </div>
            <a href="https://news.example.com/editors-choice" target="_blank" rel="noopener noreferrer" className="news-see-more-link">
              View More News →
            </a>
          </div>

          {/* Third Column - Medium Card and Smaller Articles */}
          <div className="news-column-3">
            <h2 className="news-section-title">Trending</h2>
            
            {/* Medium Card */}
            <article className="column3-medium-card">
              <div className="column3-medium-image">
                <img src={column3Data.mediumCard.image} alt={column3Data.mediumCard.title} />
              </div>
              <div className="column3-medium-content">
                <h4 className="column3-medium-title">{column3Data.mediumCard.title}</h4>
                <div className="column3-medium-meta">
                  <span className="news-author">{column3Data.mediumCard.author}</span>
                  <span className="news-date">{column3Data.mediumCard.date}</span>
                </div>
              </div>
            </article>

            {/* Smaller Articles */}
            <div className="column3-small-articles">
              {column3Data.smallerArticles.slice(0, 3).map((article) => (
                <article key={article.id} className="column3-small-article">
                  <div className="column3-small-content">
                    <span className="column3-small-category" style={{ color: getCategoryColor(article.category) }}>• {article.category}</span>
                    <h5 className="column3-small-title">{article.title}</h5>
                    <div className="column3-small-meta">
                      <span className="news-author">{article.author}</span>
                      <span className="news-date">{article.date}</span>
                    </div>
                  </div>
                  <div className="column3-small-image">
                    <img src={article.image} alt={article.title} />
                  </div>
                </article>
              ))}
            </div>
            <a href="https://news.example.com/trending" target="_blank" rel="noopener noreferrer" className="news-see-more-link">
              View More News →
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default NewsPage

