// src/LinkedList.jsx
import React, { useState, useRef } from 'react';
import Node from './Node';
import './LinkedList.css';

// 💡 Вспомогательный класс для логики узла (не React-компонент)
class ListNode {
  constructor(value) {
    this.value = value;
    this.next = null;
  }
}

const LinkedList = () => {
  const [head, setHead] = useState(null);
  const inputRef = useRef(null); // Для добавления в конец и начала
  const removeValueRef = useRef(null); // Для удаления по значению

  // --- Основные операции ---

  /**
   * ➕ Добавление нового узла в КОНЕЦ (Append/Push).
   * Логика из предыдущего примера.
   */
  const appendNode = (value) => {
    if (value === '') return;
    const newNode = new ListNode(value);

    if (!head) {
      setHead(newNode);
      return;
    }

    let current = head;
    while (current.next) {
      current = current.next;
    }

    current.next = newNode;
    setHead({ ...head }); // Обновляем state
  };

  /**
   * ⬇️ ДОБАВЛЕНИЕ В НАЧАЛО (Prepend/Unshift).
   * Новый узел становится новой головой списка.
   */
  const prependNode = (value) => {
    if (value === '') return;
    const newNode = new ListNode(value);

    // Новый узел указывает на текущую голову
    newNode.next = head;

    // Новый узел становится новой головой
    setHead(newNode);
  };

  /**
   * 🗑️ УДАЛЕНИЕ ИЗ КОНЦА (Remove Tail/Pop).
   * Находим предпоследний узел и устанавливаем его 'next' в null.
   */
  const removeTail = () => {
    if (!head) return; // Список пуст

    // Если в списке только один узел
    if (!head.next) {
      setHead(null);
      return;
    }

    let current = head;
    // Идем до предпоследнего узла
    while (current.next.next) {
      current = current.next;
    }

    // Устанавливаем next предпоследнего узла в null
    current.next = null;

    setHead({ ...head }); // Обновляем state
  };

  /**
   * 🔪 УДАЛЕНИЕ ПО ЗНАЧЕНИЮ (Remove By Value).
   * Находим узел с заданным значением и переназначаем указатели.
   */
  const removeByValue = (value) => {
    if (!head || value === '') return;

    // 1. Случай: Удаляем ГОЛОВУ (head)
    if (head.value.toString() === value) {
      setHead(head.next); // Головой становится следующий узел
      return;
    }

    // 2. Случай: Удаляем узел в середине/конце
    let current = head;
    let previous = null;

    // Ищем узел с нужным значением
    while (current && current.value.toString() !== value) {
      previous = current;
      current = current.next;
    }

    // Если узел найден (current не null)
    if (current) {
      // Переназначаем указатель 'next' предыдущего узла на следующий после текущего
      previous.next = current.next;
      setHead({ ...head }); // Обновляем state
    }
    // Если не найден, ничего не делаем
  };

  // --- Обработчики событий с получением значений из input ---

  const handleAppend = () => {
    const value = inputRef.current.value.trim();
    if (value) appendNode(value);
    inputRef.current.value = '';
  };

  const handlePrepend = () => {
    const value = inputRef.current.value.trim();
    if (value) prependNode(value);
    inputRef.current.value = '';
  };

  const handleRemoveByValue = () => {
    const value = removeValueRef.current.value.trim();
    if (value) removeByValue(value);
    removeValueRef.current.value = '';
  };

  // --- Рендеринг (Визуализация) ---

  const renderList = () => {
    const nodes = [];
    let current = head;

    while (current) {
      const isTail = current.next === null;
      nodes.push(
        <Node
          key={nodes.length}
          value={current.value}
          isTail={isTail}
        />
      );
      current = current.next;
    }
    return nodes;
  };

  return (
    <div className="linked-list-app">
      <h2>🔗 Линейный Связный Список</h2>
      <p>Общее количество узлов: {renderList().length}</p>

      {/* --- Элементы управления для ДОБАВЛЕНИЯ --- */}
      <h3>➕ Добавление узлов</h3>
      <div className="controls">
        <input
          type="text"
          ref={inputRef}
          placeholder="Значение для узла"
        />
        <button onClick={handlePrepend}>
          ⬅️ Добавить в **НАЧАЛО**
        </button>
        <button onClick={handleAppend}>
          ➡️ Добавить в **КОНЕЦ**
        </button>
      </div>

      <hr />

      {/* --- Элементы управления для УДАЛЕНИЯ --- */}
      <h3>🗑️ Удаление узлов</h3>
      <div className="controls remove-controls">
        <button onClick={removeTail}>
          ✖️ Удалить из **КОНЦА**
        </button>
        <input
          type="text"
          ref={removeValueRef}
          placeholder="Значение для удаления"
        />
        <button onClick={handleRemoveByValue}>
          🔪 Удалить по **ЗНАЧЕНИЮ**
        </button>
      </div>

      <hr />

      {/* 🖼️ Визуализация списка */}
      <h3>Визуализация списка</h3>
      <div className="list-visualization">
        {head ? (
          renderList()
        ) : (
          <p className="empty-list">Список пуст.</p>
        )}
      </div>
    </div>
  );
};

export default LinkedList;