import React from 'react';

export default function Filters({ onSearchChange, onStatusChange, developments }) {
  return (
    <div className="advanced-search-wrapper" style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
      <div style={{ flex: '2', minWidth: '250px' }}>
        <input 
          type="text" 
          placeholder="¿Qué estás buscando? (Ej. Lote, Manzana, Desarrollo...)" 
          style={{ width: '100%' }}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <div style={{ flex: '1', minWidth: '180px' }}>
        <select style={{ width: '100%' }} onChange={(e) => onStatusChange(e.target.value)}>
          <option value="all">Estado: Todos</option>
          <option value="disponible">Disponibles</option>
          <option value="apartado">Apartados</option>
          <option value="vendido">Vendidos</option>
        </select>
      </div>
      <div style={{ flex: '1', minWidth: '180px' }}>
        <select style={{ width: '100%' }}>
          <option value="all">Desarrollo: Todos</option>
          {developments.map(dev => (
            <option key={dev} value={dev}>{dev}</option>
          ))}
        </select>
      </div>
      <button className="btn-primary" style={{ flex: '0 1 auto', whiteSpace: 'nowrap' }}>
        Buscar Propiedades
      </button>
    </div>
  );
}
