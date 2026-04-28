import React from 'react';

export default function PropertyCard({ property }) {
  const formatter = new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    maximumFractionDigits: 0
  });

  // Mocking Airbnb-like metrics
  const rating = property.rating || "4.92";
  const isGuestFavorite = property.status === 'Disponible' || Math.random() > 0.5;

  return (
    <div className="property-card">
      <div className="property-card-img-wrapper">
        <img 
          src={property.featured_image_url || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80'} 
          alt={property.title} 
          className="property-card-img" 
        />
        {isGuestFavorite && (
          <div className="guest-favorite-badge">
            Recomendado
          </div>
        )}
        <div style={{ position: 'absolute', top: '12px', right: '12px', cursor: 'pointer' }}>
          <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block', fill: 'rgba(0, 0, 0, 0.5)', height: '24px', width: '24px', stroke: 'white', strokeWidth: 2, overflow: 'visible' }}><path d="m16 28c7-4.733 14-10 14-17 0-1.792-.683-3.583-2.05-4.95-1.367-1.366-3.158-2.05-4.95-2.05-1.791 0-3.583.684-4.949 2.05l-2.051 2.051-2.05-2.051c-1.367-1.366-3.158-2.05-4.95-2.05-1.791 0-3.583.684-4.949 2.05-1.367 1.367-2.051 3.158-2.051 4.95 0 7 7 12.267 14 17z"></path></svg>
        </div>
      </div>

      <div className="property-title-row">
        <div className="property-title">{property.city}, {property.type}</div>
        <div className="property-rating">
          <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block', height: '12px', width: '12px', fill: 'currentcolor' }}><path d="M15.094 1.579l-4.124 8.885-9.86 1.27a1 1 0 0 0-.542 1.736l7.293 6.565-1.965 9.852a1 1 0 0 0 1.483 1.061L16 25.951l8.625 4.997a1 1 0 0 0 1.482-1.06l-1.965-9.853 7.293-6.565a1 1 0 0 0-.541-1.735l-9.86-1.271-4.127-8.885a1 1 0 0 0-1.814 0z"></path></svg>
          {rating}
        </div>
      </div>
      
      <div className="property-subtitle" style={{ marginTop: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
        {property.title}
      </div>
      <div className="property-subtitle">
        {property.bedrooms} hab · {property.bathrooms} baños · {property.size_m2} m²
      </div>
      
      <div className="property-price">
        {formatter.format(property.price)} <span>{property.price_suffix || ''}</span>
      </div>
    </div>
  );
}
