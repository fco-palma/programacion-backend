-- Catálogo con su categoría y stock.
SELECT p.id, p.name, c.label AS category, c.species, p.price, p.stock, p.status
FROM products p
JOIN categories c ON c.id = p.category_id
ORDER BY p.created_at DESC;

-- Productos que necesitan reposición.
SELECT id, name, stock
FROM products
WHERE stock <= 10
ORDER BY stock ASC;

-- Pedidos con cantidad de artículos.
SELECT o.id, u.email, o.status, o.total, SUM(oi.quantity) AS items, o.created_at
FROM orders o
JOIN users u ON u.id = o.user_id
JOIN order_items oi ON oi.order_id = o.id
GROUP BY o.id, u.email
ORDER BY o.created_at DESC;
