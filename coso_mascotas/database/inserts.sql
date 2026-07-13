BEGIN;

INSERT INTO site_settings (key, value) VALUES ('theme', 'permanente')
ON CONFLICT (key) DO NOTHING;

INSERT INTO site_settings (key, value) VALUES
  ('free_shipping_minimum', '50000'),
  ('standard_shipping_cost', '4500'),
  ('low_stock_threshold', '5'),
  ('support_phone', '+56 9 1234 5678'),
  ('store_email', 'contacto@lilypets.cl'),
  ('store_address', '27 Oriente 22 y media Norte 3431, Talca, Maule.'),
  ('instagram_url', 'https://instagram.com/lilypets.store'),
  ('tiktok_url', 'https://tiktok.com/@lilypets.store'),
  ('facebook_url', 'https://facebook.com/lilypets.store')
ON CONFLICT (key) DO NOTHING;

INSERT INTO site_settings (key, value) VALUES
  ('hero_perros_image', 'https://images.unsplash.com/photo-1676877323964-05b2e2eba2d8?w=900&h=1100&fit=crop&auto=format'),
  ('hero_gatos_image', 'https://images.unsplash.com/photo-1761249257124-ab02fc22c5b5?w=900&h=1100&fit=crop&auto=format')
ON CONFLICT (key) DO NOTHING;

INSERT INTO announcements (title, subtitle, image_url, link_url, duration_seconds, sort_order)
SELECT seed.title, seed.subtitle, seed.image_url, seed.link_url, seed.duration_seconds, seed.sort_order
FROM (VALUES
  ('Ofertas para cuidar a tu mascota', 'Descubre descuentos especiales en alimentos, juguetes y accesorios.', 'https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=1400&h=500&fit=crop&auto=format', '#productos', 6, 1),
  ('Todo para perros y gatos', 'Productos seleccionados para acompañarlos en cada etapa.', 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=1400&h=500&fit=crop&auto=format', '#categorias', 6, 2)
) AS seed(title, subtitle, image_url, link_url, duration_seconds, sort_order)
WHERE NOT EXISTS (SELECT 1 FROM announcements);

INSERT INTO categories (label, species, image_url) VALUES
  ('Alimentos · Perros', 'perros', 'https://images.unsplash.com/photo-1714068691210-073dc52c6c1d?w=600&h=700&fit=crop&auto=format'),
  ('Juguetes · Perros', 'perros', 'https://images.unsplash.com/photo-1531531534025-0b78da954d21?w=600&h=700&fit=crop&auto=format'),
  ('Accesorios · Perros', 'perros', 'https://images.unsplash.com/photo-1599773952341-5f5d8d5433d6?w=600&h=700&fit=crop&auto=format'),
  ('Alimentos · Gatos', 'gatos', 'https://images.unsplash.com/photo-1577023311546-cdc07a8454d9?w=600&h=700&fit=crop&auto=format'),
  ('Juguetes · Gatos', 'gatos', 'https://images.unsplash.com/photo-1638826595775-e2eae86cda8e?w=600&h=700&fit=crop&auto=format'),
  ('Accesorios · Gatos', 'gatos', 'https://images.unsplash.com/photo-1596822316110-288c7b8f24f8?w=600&h=700&fit=crop&auto=format')
ON CONFLICT (label, species) DO UPDATE SET image_url = EXCLUDED.image_url;

INSERT INTO products (category_id, name, description, price, original_price, rating, review_count, badge, badge_color, image_url, stock, status)
SELECT c.id, seed.name, seed.description, seed.price, seed.original_price, seed.rating, seed.review_count, seed.badge, seed.badge_color, seed.image_url, seed.stock, 'Activo'
FROM (VALUES
  ('Alimentos · Perros', 'Lo que come la Stella y el Thor', 'Bolsa 25 kg — Croquetas para perros adultos razas grandes', 24990::numeric, 27990::numeric, 4.7::numeric, 31, 'Más vendido', 'blue', 'https://images.unsplash.com/photo-1601758228006-964e41e5e8eb?w=500&h=500&fit=crop&auto=format', 24),
  ('Alimentos · Gatos', 'Churu Pack 12 sobres', 'Pack 12 sobres — Comida húmeda para gatos adultos', 8990::numeric, 10590::numeric, 4.6::numeric, 341, '–15%', 'red', 'https://www.petmax.ca/cdn/shop/files/5371833.webp?v=1763779767&width=1200', 12),
  ('Juguetes · Gatos', 'Kit Juguetes', 'Set 5 piezas — Plumas, ratones y pelota con cascabel', 2990::numeric, NULL::numeric, 4.7::numeric, 129, 'Nuevo', 'orange', 'https://images.unsplash.com/photo-1691351943492-cfee023e9cbf?w=500&h=500&fit=crop&auto=format', 8),
  ('Accesorios · Perros', 'Arnés Ajustable Pro', 'Tallas S–XL — Anti-jale, transpirable, con reflectantes', 3490::numeric, NULL::numeric, 4.9::numeric, 87, 'Top rated', 'gray', 'https://images.unsplash.com/photo-1595523752419-5592b5327242?w=500&h=500&fit=crop&auto=format', 15),
  ('Juguetes · Perros', 'Pelota Kong Classic', 'Talla M — Caucho natural, rellena con premios', 1890::numeric, 2100::numeric, 4.8::numeric, 503, 'Clásico', 'gray', 'https://images.unsplash.com/photo-1611254965886-e7caa829b627?w=500&h=500&fit=crop&auto=format', 34),
  ('Accesorios · Gatos', 'Arenero Cerrado', 'Arenero cubierto para mayor privacidad y limpieza.', 6200::numeric, NULL::numeric, 4.5::numeric, 68, 'Nuevo', 'orange', 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Cat%20house.jpg?width=900', 9)
) AS seed(category_label, name, description, price, original_price, rating, review_count, badge, badge_color, image_url, stock)
JOIN categories c ON c.label = seed.category_label
WHERE NOT EXISTS (SELECT 1 FROM products p WHERE p.name = seed.name);

INSERT INTO categories (label, species, image_url) VALUES
  ('Farmacia · Perros', 'perros', 'https://images.unsplash.com/photo-1676877323964-05b2e2eba2d8?w=600&h=700&fit=crop&auto=format'),
  ('Farmacia · Gatos', 'gatos', 'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?w=600&h=700&fit=crop&auto=format')
ON CONFLICT (label, species) DO UPDATE SET image_url = EXCLUDED.image_url;

INSERT INTO products (category_id, name, description, price, original_price, rating, review_count, badge, badge_color, image_url, stock, status)
SELECT c.id, seed.name, seed.description, seed.price, seed.original_price, seed.rating, seed.review_count, seed.badge, seed.badge_color, seed.image_url, seed.stock, 'Activo'
FROM (VALUES
  ('Farmacia · Perros', 'Pipeta antiparasitaria para perros', 'Protección mensual contra pulgas y garrapatas.', 8990::numeric, 10990::numeric, 4.8::numeric, 42, 'Oferta', 'red', 'https://images.unsplash.com/photo-1676877323964-05b2e2eba2d8?w=500&h=500&fit=crop&auto=format', 18),
  ('Farmacia · Gatos', 'Suplemento Omega 3 para gatos', 'Suplemento nutricional para piel, pelaje y bienestar general.', 7490::numeric, NULL::numeric, 4.7::numeric, 25, 'Nuevo', 'green', 'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?w=500&h=500&fit=crop&auto=format', 14)
) AS seed(category_label, name, description, price, original_price, rating, review_count, badge, badge_color, image_url, stock)
JOIN categories c ON c.label = seed.category_label
WHERE NOT EXISTS (SELECT 1 FROM products p WHERE p.name = seed.name);

UPDATE products
SET image_url = CASE name
  WHEN 'Churu Pack 12 sobres' THEN 'https://www.petmax.ca/cdn/shop/files/5371833.webp?v=1763779767&width=1200'
  WHEN 'Arenero Cerrado' THEN 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Cat%20house.jpg?width=900'
  ELSE image_url
END
WHERE name IN ('Churu Pack 12 sobres', 'Arenero Cerrado');

INSERT INTO tags (name) VALUES ('Nuevo'), ('Más vendido'), ('Oferta'), ('Top rated')
ON CONFLICT (name) DO NOTHING;

INSERT INTO product_tags (product_id, tag_id)
SELECT p.id, t.id
FROM products p
JOIN tags t ON t.name = CASE
  WHEN p.badge = 'Más vendido' THEN 'Más vendido'
  WHEN p.badge = '–15%' THEN 'Oferta'
  WHEN p.badge = 'Top rated' THEN 'Top rated'
  WHEN p.badge = 'Nuevo' THEN 'Nuevo'
  ELSE 'Top rated'
END
ON CONFLICT DO NOTHING;

COMMIT;
