import './PageHeader.css'

interface PageHeaderProps {
  title: string
}

function PageHeader({ title }: PageHeaderProps) {
  return (
    <div className="page-header">
      <div className="page-header-content">
        <h1 className="page-header-title">{title}</h1>
      </div>
      <div className="page-header-accent"></div>
    </div>
  )
}

export default PageHeader

