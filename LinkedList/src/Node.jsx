// src/Node.js
import React from 'react';
import './Node.css';

/**
 * Визуальный компонент для узла связанного списка.
 * @param {object} props
 * @param {string|number} props.value - Значение, хранящееся в узле.
 * @param {boolean} props.isTail - Флаг, указывающий, является ли узел последним (хвостом).
 */
const Node = ({ value, isTail }) => {
  return (
    <div className="node-container">
      {/* Отображает само значение узла */}
      <div className="node-box">
        {value}
      </div>

      {/* Отображает стрелку "next", если это не хвост */}
      {!isTail && (
        <div className="pointer-arrow">
          →
        </div>
      )}

      {/* Отображает "NULL" для хвоста */}
      {isTail && (
        <div className="null-indicator">
          NULL
        </div>
      )}
    </div>
  );
};

export default Node;