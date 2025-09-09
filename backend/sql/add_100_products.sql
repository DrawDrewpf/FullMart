-- Limpiar productos existentes y agregar 100 productos con imagenes reales
DELETE FROM products;

-- Electronics (25 productos)
INSERT INTO products (name, description, price, image_url, category, stock_quantity) VALUES
-- Laptops
('MacBook Pro 14', 'Laptop profesional con chip M3 Pro, pantalla Retina de alta calidad', 2199.99, 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400&h=300&fit=crop&auto=format', 'Electronics', 25),
('Dell XPS 13', 'Ultrabook premium con pantalla InfinityEdge y procesador Intel', 1499.99, 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=400&h=300&fit=crop&auto=format', 'Electronics', 30),
('ASUS ROG Gaming', 'Laptop gaming de alto rendimiento con RTX 4070 y RGB', 1799.99, 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=400&h=300&fit=crop&auto=format', 'Electronics', 20),
('Lenovo ThinkPad X1', 'Laptop empresarial con certificacion militar MIL-STD', 1299.99, 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=300&fit=crop&auto=format', 'Electronics', 35),
('HP Pavilion 15', 'Laptop versatil para trabajo y entretenimiento diario', 899.99, 'https://images.unsplash.com/photo-1484788984921-03950022c9ef?w=400&h=300&fit=crop&auto=format', 'Electronics', 40),

-- Smartphones
('iPhone 15 Pro', 'Smartphone Apple con chip A17 Pro y cuerpo de titanio', 1199.99, 'https://images.unsplash.com/photo-1512499617640-c74ae3a79d37?w=400&h=300&fit=crop&auto=format', 'Electronics', 50),
('Samsung Galaxy S24 Ultra', 'Android flagship con camara de 200MP y S Pen integrado', 1299.99, 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=300&fit=crop&auto=format', 'Electronics', 45),
('Google Pixel 8 Pro', 'Smartphone con IA avanzada y fotografia computacional', 999.99, 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=400&h=300&fit=crop&auto=format', 'Electronics', 30),
('OnePlus 12', 'Smartphone premium con carga rapida de 100W SuperVOOC', 899.99, 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=300&fit=crop&auto=format', 'Electronics', 25),
('Xiaomi 14 Ultra', 'Smartphone con sistema de camaras Leica y pantalla OLED', 1099.99, 'https://images.unsplash.com/photo-1567581935884-3349723552ca?w=400&h=300&fit=crop&auto=format', 'Electronics', 20),

-- Tablets y Audio
('iPad Pro 12.9', 'Tablet profesional con chip M2 y compatibilidad Magic Keyboard', 1299.99, 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=300&fit=crop&auto=format', 'Electronics', 30),
('Samsung Galaxy Tab S9', 'Tablet Android premium con S Pen incluido y resistencia IP68', 849.99, 'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=400&h=300&fit=crop&auto=format', 'Electronics', 25),
('Microsoft Surface Pro 9', 'Tablet 2-en-1 con Windows 11 completo y conectividad 5G', 999.99, 'https://images.unsplash.com/photo-1585790050230-5dd28404ccb9?w=400&h=300&fit=crop&auto=format', 'Electronics', 20),
('AirPods Pro 2', 'Auriculares inalambricos con cancelacion activa de ruido', 279.99, 'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=400&h=300&fit=crop&auto=format', 'Electronics', 60),
('Sony WH-1000XM5', 'Auriculares over-ear con la mejor cancelacion de ruido del mercado', 399.99, 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=400&h=300&fit=crop&auto=format', 'Electronics', 40),

-- Gaming y Accesorios
('PlayStation 5', 'Consola de videojuegos de nueva generacion con SSD ultrarapido', 499.99, 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400&h=300&fit=crop&auto=format', 'Electronics', 15),
('Xbox Series X', 'Consola gaming 4K con retrocompatibilidad total', 499.99, 'https://images.unsplash.com/photo-1621259182978-fbf93132d53d?w=400&h=300&fit=crop&auto=format', 'Electronics', 12),
('Nintendo Switch OLED', 'Consola hibrida con pantalla OLED de 7 pulgadas mejorada', 349.99, 'https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=400&h=300&fit=crop&auto=format', 'Electronics', 30),
('Monitor Gaming 4K', 'Monitor 27 pulgadas 4K 144Hz con tecnologia HDR', 699.99, 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&h=300&fit=crop&auto=format', 'Electronics', 20),
('Teclado Mecanico RGB', 'Teclado gaming con switches Cherry MX y retroiluminacion', 159.99, 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400&h=300&fit=crop&auto=format', 'Electronics', 50),

-- Smart Home
('Apple Watch Series 9', 'Reloj inteligente con GPS y monitor de salud avanzado', 429.99, 'https://images.unsplash.com/photo-1579586337278-3f436f25d4d5?w=400&h=300&fit=crop&auto=format', 'Electronics', 40),
('Amazon Echo Dot 5', 'Altavoz inteligente con Alexa y sonido mejorado', 59.99, 'https://images.unsplash.com/photo-1518444065439-e933c06ce9cd?w=400&h=300&fit=crop&auto=format', 'Electronics', 80),
('Ring Video Doorbell', 'Timbre inteligente con camara HD y deteccion de movimiento', 199.99, 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=300&fit=crop&auto=format', 'Electronics', 35),
('Philips Hue Starter Kit', 'Kit de bombillas inteligentes RGB con control por app', 149.99, 'https://images.unsplash.com/photo-1558582305-1c1c9b4de4ee?w=400&h=300&fit=crop&auto=format', 'Electronics', 60),
('Nest Thermostat', 'Termostato inteligente con aprendizaje automatico', 249.99, 'https://images.unsplash.com/photo-1545259741-2ea3ebf61fa1?w=400&h=300&fit=crop&auto=format', 'Electronics', 30),

-- Clothing - Hombre (25 productos)
('Camiseta Nike Dri-FIT', 'Camiseta deportiva con tecnologia de absorcion de humedad', 29.99, 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=300&fit=crop&auto=format', 'Clothing', 100),
('Polo Ralph Lauren', 'Polo clasico de algodon 100% con logo bordado', 89.99, 'https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=400&h=300&fit=crop&auto=format', 'Clothing', 80),
('Jeans Levis 501', 'Jeans clasicos de corte recto en algodon premium', 79.99, 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=300&fit=crop&auto=format', 'Clothing', 60),
('Chaqueta North Face', 'Chaqueta impermeable para actividades al aire libre', 199.99, 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=300&fit=crop&auto=format', 'Clothing', 40),
('Sudadera Adidas', 'Sudadera con capucha de algodon organico y logo bordado', 69.99, 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=300&fit=crop&auto=format', 'Clothing', 90),
('Camisa Formal Blanca', 'Camisa de vestir en algodon egipcio de alta calidad', 59.99, 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=400&h=300&fit=crop&auto=format', 'Clothing', 70),
('Pantalones Chinos', 'Pantalones casuales de algodon con corte slim fit', 49.99, 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=400&h=300&fit=crop&auto=format', 'Clothing', 85),
('Blazer Negro Casual', 'Blazer versatil para ocasiones semi-formales', 149.99, 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop&auto=format', 'Clothing', 35),
('Shorts Deportivos', 'Shorts de entrenamiento con tecnologia moisture-wicking', 34.99, 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=400&h=300&fit=crop&auto=format', 'Clothing', 95),
('Sueter de Lana Merino', 'Sueter premium de lana merino australiana', 119.99, 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=400&h=300&fit=crop&auto=format', 'Clothing', 45),
('Traje Completo Gris', 'Traje de dos piezas en lana virgen con corte moderno', 399.99, 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&h=300&fit=crop&auto=format', 'Clothing', 20),
('Camiseta Grafica Vintage', 'Camiseta con diseno retro en algodon organico', 24.99, 'https://images.unsplash.com/photo-1583743814966-8936f37f4152?w=400&h=300&fit=crop&auto=format', 'Clothing', 110),
('Parka de Invierno', 'Parka con aislamiento termico y capucha desmontable', 249.99, 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop&auto=format', 'Clothing', 30),
('Jeans Skinny Negros', 'Jeans ajustados en denim elastico de alta calidad', 89.99, 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=400&h=300&fit=crop&auto=format', 'Clothing', 75),
('Chaleco Acolchado', 'Chaleco ligero con relleno sintetico para entretiempo', 79.99, 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=300&fit=crop&auto=format', 'Clothing', 55),
('Camisa de Cuadros', 'Camisa casual de franela en patron escoces', 44.99, 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=400&h=300&fit=crop&auto=format', 'Clothing', 65),
('Pantalones de Vestir', 'Pantalones formales de lana con pliegue frontal', 89.99, 'https://images.unsplash.com/photo-1506629905607-c95ba2ecf25a?w=400&h=300&fit=crop&auto=format', 'Clothing', 50),
('Tank Top Deportivo', 'Camiseta sin mangas para entrenamiento intensivo', 19.99, 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=400&h=300&fit=crop&auto=format', 'Clothing', 120),
('Cardigan de Punto', 'Cardigan clasico de punto con botones de madera', 94.99, 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400&h=300&fit=crop&auto=format', 'Clothing', 40),
('Bermudas Casuales', 'Bermudas de algodon para uso diario en verano', 39.99, 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=400&h=300&fit=crop&auto=format', 'Clothing', 80),
('Abrigo de Lana', 'Abrigo elegante de lana para temporada fria', 299.99, 'https://images.unsplash.com/photo-1520975954732-35dd22299614?w=400&h=300&fit=crop&auto=format', 'Clothing', 25),
('Jersey Deportivo', 'Jersey tecnico para actividades deportivas', 54.99, 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=300&fit=crop&auto=format', 'Clothing', 70),
('Camisa Hawaiana', 'Camisa tropical con estampado floral colorido', 34.99, 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400&h=300&fit=crop&auto=format', 'Clothing', 60),
('Pantalones Cargo', 'Pantalones utilitarios con multiples bolsillos', 64.99, 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=400&h=300&fit=crop&auto=format', 'Clothing', 45),
('Hoodie Premium', 'Sudadera con capucha de algodon organico y forro suave', 89.99, 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=300&fit=crop&auto=format', 'Clothing', 55),

-- Clothing - Mujer (25 productos)
('Vestido Casual Verano', 'Vestido comodo de algodon con estampado floral', 59.99, 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=300&fit=crop&auto=format', 'Clothing', 70),
('Blusa Elegante Seda', 'Blusa de seda natural para ocasiones especiales', 89.99, 'https://images.unsplash.com/photo-1564557287817-3785e38ec1f5?w=400&h=300&fit=crop&auto=format', 'Clothing', 50),
('Leggings Deportivos', 'Leggings de alta compresion con tecnologia anti-humedad', 49.99, 'https://images.unsplash.com/photo-1506629905607-c95ba2ecf25a?w=400&h=300&fit=crop&auto=format', 'Clothing', 120),
('Chaqueta Denim Clasica', 'Chaqueta de mezclilla vintage con detalles gastados', 79.99, 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop&auto=format', 'Clothing', 60),
('Falda Midi Elegante', 'Falda de largo medio en tela fluida para oficina', 69.99, 'https://images.unsplash.com/photo-1583496661160-fb5886a13c0e?w=400&h=300&fit=crop&auto=format', 'Clothing', 45),
('Top Crop Deportivo', 'Top corto de entrenamiento con soporte integrado', 34.99, 'https://images.unsplash.com/photo-1506629905607-c95ba2ecf25a?w=400&h=300&fit=crop&auto=format', 'Clothing', 90),
('Vestido de Noche Negro', 'Vestido elegante para eventos formales', 149.99, 'https://images.unsplash.com/photo-1566479179817-0dcc5a644956?w=400&h=300&fit=crop&auto=format', 'Clothing', 30),
('Cardigan Oversized', 'Cardigan amplio de punto suave en colores neutros', 74.99, 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400&h=300&fit=crop&auto=format', 'Clothing', 65),
('Jeans de Talle Alto', 'Jeans vintage de talle alto con corte recto', 84.99, 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=400&h=300&fit=crop&auto=format', 'Clothing', 80),
('Blazer Rosa Polvo', 'Blazer femenino en color rosa suave para oficina', 119.99, 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop&auto=format', 'Clothing', 40),
('Shorts de Mezclilla', 'Shorts denim con dobladillo deshilachado', 44.99, 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=400&h=300&fit=crop&auto=format', 'Clothing', 85),
('Sueter Cuello Alto', 'Sueter de cashmere con cuello alto elegante', 129.99, 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=400&h=300&fit=crop&auto=format', 'Clothing', 35),
('Falda Plisada', 'Falda plisada de longitud media en polyester', 54.99, 'https://images.unsplash.com/photo-1583496661160-fb5886a13c0e?w=400&h=300&fit=crop&auto=format', 'Clothing', 60),
('Camiseta Basica Blanca', 'Camiseta esencial de algodon organico', 22.99, 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=300&fit=crop&auto=format', 'Clothing', 150),
('Vestido Maxi Bohemio', 'Vestido largo con estampado bohemio y mangas largas', 94.99, 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=300&fit=crop&auto=format', 'Clothing', 40),
('Pantalones Palazzo', 'Pantalones anchos de pierna ancha para comodidad', 64.99, 'https://images.unsplash.com/photo-1506629905607-c95ba2ecf25a?w=400&h=300&fit=crop&auto=format', 'Clothing', 55),
('Kimono Floral', 'Kimono ligero con estampado de flores para verano', 49.99, 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop&auto=format', 'Clothing', 70),
('Mono Enterizo', 'Mono completo de una pieza para ocasiones casuales', 89.99, 'https://images.unsplash.com/photo-1583496661160-fb5886a13c0e?w=400&h=300&fit=crop&auto=format', 'Clothing', 45),
('Chaqueta Bomber', 'Chaqueta estilo bomber con detalles metalicos', 94.99, 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop&auto=format', 'Clothing', 50),
('Falda de Cuero Sintetico', 'Falda corta en cuero vegano de alta calidad', 74.99, 'https://images.unsplash.com/photo-1583496661160-fb5886a13c0e?w=400&h=300&fit=crop&auto=format', 'Clothing', 35),
('Body Elastico', 'Body ajustado de manga larga en algodon elastico', 39.99, 'https://images.unsplash.com/photo-1564557287817-3785e38ec1f5?w=400&h=300&fit=crop&auto=format', 'Clothing', 75),
('Abrigo de Lana Rosa', 'Abrigo elegante de lana en tono rosa empolvado', 199.99, 'https://images.unsplash.com/photo-1520975954732-35dd22299614?w=400&h=300&fit=crop&auto=format', 'Clothing', 25),
('Pantalones de Yoga', 'Pantalones elasticos para yoga y pilates', 54.99, 'https://images.unsplash.com/photo-1506629905607-c95ba2ecf25a?w=400&h=300&fit=crop&auto=format', 'Clothing', 100),
('Vestido Camisero', 'Vestido estilo camisa en algodon con cinturon', 69.99, 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=300&fit=crop&auto=format', 'Clothing', 55),
('Chaqueta de Punto', 'Chaqueta tejida con botones dorados y bolsillos', 84.99, 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400&h=300&fit=crop&auto=format', 'Clothing', 40),

-- Books (15 productos)
('JavaScript: The Good Parts', 'Guia esencial para programacion en JavaScript moderno', 39.99, 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=400&h=300&fit=crop&auto=format', 'Books', 80),
('Clean Code', 'Manual de tecnicas para escribir codigo limpio y mantenible', 44.99, 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=300&fit=crop&auto=format', 'Books', 65),
('Design Patterns', 'Patrones de diseno reutilizables en programacion orientada a objetos', 54.99, 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop&auto=format', 'Books', 45),
('Atomic Habits', 'Libro de autoayuda sobre formacion de habitos efectivos', 24.99, 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=300&fit=crop&auto=format', 'Books', 120),
('The Pragmatic Programmer', 'Guia profesional para desarrolladores de software', 49.99, 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=400&h=300&fit=crop&auto=format', 'Books', 55),
('You Do not Know JS', 'Serie completa de libros sobre JavaScript avanzado', 89.99, 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=300&fit=crop&auto=format', 'Books', 40),
('The Art of War', 'Clasico tratado militar de estrategia y tacticas', 19.99, 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop&auto=format', 'Books', 90),
('Sapiens', 'Historia fascinante de la humanidad y su evolucion', 29.99, 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=300&fit=crop&auto=format', 'Books', 75),
('The Lean Startup', 'Metodologia para crear empresas exitosas con innovacion', 34.99, 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=400&h=300&fit=crop&auto=format', 'Books', 60),
('Think and Grow Rich', 'Clasico libro de desarrollo personal y exito financiero', 22.99, 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=300&fit=crop&auto=format', 'Books', 100),
('The Clean Coder', 'Guia de conducta profesional para programadores', 42.99, 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop&auto=format', 'Books', 50),
('Mindset', 'Libro sobre psicologia del exito y mentalidad de crecimiento', 26.99, 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=300&fit=crop&auto=format', 'Books', 85),
('The 7 Habits', 'Siete habitos de personas altamente efectivas', 28.99, 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=400&h=300&fit=crop&auto=format', 'Books', 70),
('Code Complete', 'Manual completo de construccion de software profesional', 59.99, 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=300&fit=crop&auto=format', 'Books', 35),
('Rich Dad Poor Dad', 'Libro sobre educacion financiera y inversion inteligente', 24.99, 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop&auto=format', 'Books', 95),

-- Home (10 productos)
('Cafetera Automatica', 'Cafetera espresso con molinillo integrado y pantalla tactil', 299.99, 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=300&fit=crop&auto=format', 'Home', 30),
('Aspiradora Robot', 'Aspiradora inteligente con mapeo laser y app movil', 399.99, 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=300&fit=crop&auto=format', 'Home', 25),
('Silla Ergonomica', 'Silla de oficina con soporte lumbar y ajuste completo', 299.99, 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop&auto=format', 'Home', 40),
('Lampara LED Inteligente', 'Lampara de mesa con control por voz y 16 millones de colores', 89.99, 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=300&fit=crop&auto=format', 'Home', 60),
('Purificador de Aire', 'Purificador HEPA con sensor de calidad de aire', 249.99, 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=400&h=300&fit=crop&auto=format', 'Home', 35),
('Humidificador Ultrasónico', 'Humidificador silencioso con aromaterapia incluida', 79.99, 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=300&fit=crop&auto=format', 'Home', 50),
('Set de Ollas Ceramica', 'Juego de 5 ollas antiadherentes con recubrimiento ceramico', 159.99, 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop&auto=format', 'Home', 45),
('Microondas Digital', 'Horno microondas con grill y funciones preestablecidas', 199.99, 'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=400&h=300&fit=crop&auto=format', 'Home', 30),
('Ventilador de Torre', 'Ventilador silencioso con control remoto y temporizador', 129.99, 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=400&h=300&fit=crop&auto=format', 'Home', 40),
('Organizador Multiusos', 'Sistema modular de almacenamiento para cualquier espacio', 69.99, 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop&auto=format', 'Home', 70);

-- Actualizar la secuencia del ID para que continue desde el nuevo maximo
SELECT setval('products_id_seq', (SELECT MAX(id) FROM products));
